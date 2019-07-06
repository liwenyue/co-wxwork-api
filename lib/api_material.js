'use strict';

const path = require('path');
const { statSync } = require('fs');
const formstream = require('formstream');

/**
 * 上传永久素材，分别有图片（image）、语音（voice）、和缩略图（thumb）
 * 详情请见：<http://mp.weixin.qq.com/wiki/14/7e6c03263063f4813141c3e17dd4350a.html>
 * Examples:
 * ```
 * api.uploadMaterial('filepath', type);
 * ```

 * Result:
 * ```
 * {"type":"TYPE","media_id":"MEDIA_ID","created_at":123456789}
 * ```
 * Shortcut: * - `exports.uploadImageMaterial(filepath);`
 * - `exports.uploadVoiceMaterial(filepath);`
 * - `exports.uploadThumbMaterial(filepath);` * @param {String} filepath 文件路径
 * @param {String} type 媒体类型，可用值有image、voice、video、thumb
 */
exports.uploadMaterial = function (filepath, type) {
  let stat = statSync(filepath);
  let form = formstream();
  form.file('media', filepath, path.basename(filepath), stat.size);
  // let url = this.prefix + '?access_token=' + accessToken + '&type=' + type;
  let opts = {
    method: 'post',
    url: 'material/add_material' ,
    headers: form.headers(),
    data: form,
    params: { type }
  };
  return this.request(opts);
};

['image', 'voice', 'thumb'].forEach(function (type) {
  let method = 'upload' + type[0].toUpperCase() + type.substring(1) + 'Material';
  exports[method] =  function (filepath) {
    return this.uploadMaterial(filepath, type);
  };
});

/**
 * 上传永久素材，视频（video）
 * 详情请见：<http://mp.weixin.qq.com/wiki/14/7e6c03263063f4813141c3e17dd4350a.html>
 * Examples:
 * ```
 * let description = {
 *   "title":VIDEO_TITLE,
 *   "introduction":INTRODUCTION
 * };
 * api.uploadVideoMaterial('filepath', description);
 * ```
 *
 * Result:
 * ```
 * {"media_id":"MEDIA_ID"}
 * ```
 * @param {String} filepath 视频文件路径
 * @param {Object} description 描述
 */
exports.uploadVideoMaterial = function (filepath, description) {
  let stat = statSync(filepath);
  let form = formstream();
  form.file('media', filepath, path.basename(filepath), stat.size);
  form.field('description', JSON.stringify(description));
  // let url = this.prefix + 'material/add_material';
  let opts = {
    method: 'post',
    url: 'material/add_material' ,
    headers: form.headers(),
    data: form,
    params: { type: 'video' }
  };
  return this.request(opts);
};

/**
 * 新增永久图文素材 * News:
 * ```
 * {
 *  "articles": [
 *    {
 *      "title": TITLE,
 *      "thumb_media_id": THUMB_MEDIA_ID,
 *      "author": AUTHOR,
 *      "digest": DIGEST,
 *      "show_cover_pic": SHOW_COVER_PIC(0 / 1),
 *      "content": CONTENT,
 *      "content_source_url": CONTENT_SOURCE_URL
 *    },
 *    //若新增的是多图文素材，则此处应还有几段articles结构
 *  ]
 * }
 * ```
 * Examples:
 * ```
 * api.uploadNewsMaterial(news);
 * ```
 *
 * Result:
 * ```
 * {"errcode":0,"errmsg":"ok"}
 * ```
 * @param {Object} news 图文对象
 */
exports.uploadNewsMaterial =  function (news) {
  // let url = this.prefix + '';
  return this.request({url: 'material/add_news', data: news});
};
/**
 * 更新永久图文素材
 * News:
 * ```
 * {
 *  "media_id":MEDIA_ID,
 *  "index":INDEX,
 *  "articles": [
 *    {
 *      "title": TITLE,
 *      "thumb_media_id": THUMB_MEDIA_ID,
 *      "author": AUTHOR,
 *      "digest": DIGEST,
 *      "show_cover_pic": SHOW_COVER_PIC(0 / 1),
 *      "content": CONTENT,
 *      "content_source_url": CONTENT_SOURCE_URL
 *    },
 *    //若新增的是多图文素材，则此处应还有几段articles结构
 *  ]
 * }
 * ```
 * Examples:
 * ```
 * api.uploadNewsMaterial(news);
 * ```
 * Result:
 * ```
 * {"errcode":0,"errmsg":"ok"}
 * ```
 * @param {Object} news 图文对象
 */
exports.updateNewsMaterial =  function (news) {
  return this.request({url: 'material/add_news', data: news, method: 'post'});
};
/**
 * 根据媒体ID获取永久素材
 * 详情请见：<http://mp.weixin.qq.com/wiki/4/b3546879f07623cb30df9ca0e420a5d0.html>
 * Examples:
 * ```
 * api.getMaterial('media_id');
 * ```
 *
 * - `result`, 调用正常时得到的文件Buffer对象
 * - `res`, HTTP响应对象 * @param {String} mediaId 媒体文件的ID
 */
exports.getMaterial = function (mediaId) {
  let opts = {
    method: 'get',
    url: 'material/get_material',
    data: {'media_id': mediaId},
    responseType: 'stream',
    headers: {
      'Content-Type': 'application/json'
    },
  };
  return this.request(opts);
};

/**
 * 删除永久素材
 * 详情请见：<http://mp.weixin.qq.com/wiki/5/e66f61c303db51a6c0f90f46b15af5f5.html>
 * Examples:
 * ```
 * api.removeMaterial('media_id');
 * ```
 *
 * - `result`, 调用正常时得到的文件Buffer对象
 * - `res`, HTTP响应对象 * @param {String} mediaId 媒体文件的ID
 */
exports.removeMaterial =  function (mediaId) {
  return this.request({url:'material/del_material' ,  method: 'post', data: {'media_id': mediaId}});
};

/**
 * 获取素材总数
 * 详情请见：<http://mp.weixin.qq.com/wiki/16/8cc64f8c189674b421bee3ed403993b8.html>
 * Examples:
 * ```
 * api.getMaterialCount();
 * ```
 *
 * - `result`, 调用正常时得到的文件Buffer对象
 * - `res`, HTTP响应对象 * Result:
 * ```
 * {
 *  "voice_count":COUNT,
 *  "video_count":COUNT,
 *  "image_count":COUNT,
 *  "news_count":COUNT
 * }
 * ```
 */
exports.getMaterialCount = function () {
  return this.request({url: 'material/get_materialcount', method: 'get'});
};

/**
 * 获取永久素材列表
 * 详情请见：<http://mp.weixin.qq.com/wiki/12/2108cd7aafff7f388f41f37efa710204.html>
 * Examples:
 * ```
 * api.getMaterials(type, offset, count);
 * ```
 *
 * - `result`, 调用正常时得到的文件Buffer对象
 * - `res`, HTTP响应对象 * Result:
 * ```
 * {
 *  "total_count": TOTAL_COUNT,
 *  "item_count": ITEM_COUNT,
 *  "item": [{
 *    "media_id": MEDIA_ID,
 *    "name": NAME,
 *    "update_time": UPDATE_TIME
 *  },
 *  //可能会有多个素材
 *  ]
 * }
 * ```
 * @param {String} type 素材的类型，图片（image）、视频（video）、语音 （voice）、图文（news）
 * @param {Number} offset 从全部素材的该偏移位置开始返回，0表示从第一个素材 返回
 * @param {Number} count 返回素材的数量，取值在1到20之间
 */
exports.getMaterials =  function (type, offset, count) {
  let url = 'material/batchget_material';
  let data = {
    type: type,
    offset: offset,
    count: count
  };
  return this.request({ url, data, method: 'post'});
};
