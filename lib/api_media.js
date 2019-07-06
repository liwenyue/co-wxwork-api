'use strict';

const path = require('path');
const { statSync } = require('fs');
const formstream = require('formstream');

/**
 * 新增临时素材，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
 * 详情请见：<http://mp.weixin.qq.com/wiki/5/963fc70b80dc75483a271298a76a8d59.html>
 * Examples:
 * ```
 * api.uploadMedia('filepath', type);
 * ```
 *
 * Result:
 * ```
 * {"type":"TYPE","media_id":"MEDIA_ID","created_at":123456789}
 * ```
 * Shortcut:
 * - `exports.uploadImageMedia(filepath);`
 * - `exports.uploadVoiceMedia(filepath);`
 * - `exports.uploadVideoMedia(filepath);`
 * - `exports.uploadThumbMedia(filepath);`
 *
 * 不再推荐使用：
 *
 * - `exports.uploadImage(filepath);`
 * - `exports.uploadVoice(filepath);`
 * - `exports.uploadVideo(filepath);`
 * - `exports.uploadThumb(filepath);`
 *
 * @param {String|Buffer} filepath 文件路径/文件Buffer数据
 * @param {String} type 媒体类型，可用值有image、voice、video、thumb
 * @param {String} filename 文件名
 * @param {String} mime 文件类型,filepath为Buffer数据时才需要传
 */
exports.uploadMedia =  function (filepath, type, filename, mime) {
  let form = formstream();
  if (Buffer.isBuffer(filepath)) {
    form.buffer('media', filepath, filename, mime);
  } else if (typeof filepath === 'string') {
    let stat = statSync(filepath);
    form.file('media', filepath, filename || path.basename(filepath), stat.size);
  }
  let opts = {
    method: 'post',
    headers: form.headers(),
    data: form,
    url: 'media/upload',
    params: { type }
  };
  opts.headers.Accept = 'application/json';
  return this.request(opts);
};

['image', 'voice', 'video', 'thumb'].forEach(function (type) {
  let method = 'upload' + type[0].toUpperCase() + type.substring(1);
  let newMethod = method + 'Media';
  // exports[method] = util.deprecate(async function (filepath) {
  //   return this.uploadMedia(filepath, type);
  // }, `${method}: Use ${newMethod} instead`);

  exports[newMethod] = function (filepath) {
    return this.uploadMedia(filepath, type);
  };
});


/**
 * 获取临时素材
 * 详情请见：<http://mp.weixin.qq.com/wiki/11/07b6b76a6b6e8848e855a435d5e34a5f.html>
 * Examples:
 * ```
 * api.getMedia('media_id');
 * ```
 * - `result`, 调用正常时得到的文件Buffer对象
 * - `res`, HTTP响应对象
 * @param {String} mediaId 媒体文件的ID
 */
exports.getMediaHD =  function (mediaId) {
  return this.request({url: 'media/get/jssdk', params: {media_id: mediaId}, responseType: 'stream'});
};

/**
 * 获取临时素材
 * 详情请见：<http://mp.weixin.qq.com/wiki/11/07b6b76a6b6e8848e855a435d5e34a5f.html>
 * Examples:
 * ```
 * api.getMedia('media_id');
 * ```
 * - `result`, 调用正常时得到的文件Buffer对象
 * - `res`, HTTP响应对象
 * @param {String} mediaId 媒体文件的ID
 */
exports.getMedia =  function (mediaId) {
  return this.request({url: 'media/get', params: {media_id: mediaId}, responseType: 'stream'});
};
/**
 * 上传图文消息内的图片获取URL
 * 详情请见：<http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html>
 * Examples:
 * ```
 * api.uploadImage('filepath');
 * ```
 * Result:
 * ```
 * {"url":  "http://mmbiz.qpic.cn/mmbiz/gLO17UPS6FS2xsypf378iaNhWacZ1G1UplZYWEYfwvuU6Ont96b1roYsCNFwaRrSaKTPCUdBK9DgEHicsKwWCBRQ/0"}
 * ```
 * @param {String} filepath 图片文件路径
 */
exports.uploadImage = function (filepath) {
  let stat = statSync(filepath);
  let form = formstream();
  form.file('media', filepath, path.basename(filepath), stat.size);
  let opts = {
    method: 'post',
    url: 'media/uploadimg',
    headers: form.headers(),
    data: form
  };
  opts.headers.Accept = 'application/json';
  return this.request(opts);
};
