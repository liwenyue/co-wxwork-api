/**
 * 获取配置了客户联系功能的成员列表
 * https://work.weixin.qq.com/api/doc#90000/90135/90221
 * @param data 成员信息
 * @returns {Promise.<TResult>}
 */
exports.getCustomerContacts = function (data) {
  return this.request({
    method: 'post',
    url: 'crm/get_customer_contacts',
    data
  })
}

/**
 * 获取外部联系人列表
 * https://work.weixin.qq.com/api/doc#90000/90135/91555
 * @param userId 成员UserID。对应管理端的帐号，企业内必须唯一。不区分大小写，长度为1~64个字节
 * @returns {Promise.<TResult>}
 */
exports.getExternalContactList = function (userId) {
  return this.request({
    url: 'crm/get_external_contact_list',
    params: {
      userid: userId
    }
  })
}

/**
 * 获取外部联系人详情
 * https://work.weixin.qq.com/api/doc#90000/90135/91556
 * @param externalUserId 对应管理端的帐号，企业内必须唯一。不区分大小写，长度为1~64个字节
 * @param data 需要更新的成员信息
 * @returns {Promise.<TResult>}
 */
exports.getExternalContact = function (externalUserId) {
  return this.request({
    url: 'crm/get_external_contact',
    params: {
      external_userid: userId
    }
  })
}

/**
 * 配置客户联系「联系我」方式
 * https://work.weixin.qq.com/api/doc#90000/90135/91559
 * @param data
 {
   "type" :1,
   "scene":1,
   "style":1,
   "remark":"渠道客户",
   "skip_verify":true,
   "state":"teststate",
   "user" : ["UserID1", "UserID2", "UserID3"],
   "party" : [PartyID1, PartyID2]
}
@returns {
   "errcode": 0,
   "errmsg": "ok",
   "config_id":"42b34949e138eb6e027c123cba77fad7"　　
}
 * 参数说明：

参数	必须	说明
access_token	是	调用接口凭证
type	是	联系方式类型,1-单人, 2-多人
scene	是	场景，1-在小程序中联系，2-通过二维码联系
style	否	在小程序中联系时使用的控件样式，详见附表
remark	否	联系方式的备注信息，用于助记，不超过30个字符
skip_verify	否	外部客户添加时是否无需验证，默认为true
state	否	企业自定义的state参数，用于区分不同的添加渠道，在调用“获取外部联系人详情”时会返回该参数值
user	否	使用该联系方式的用户userID列表，在type为1时为必填，且只能有一个
party	否	使用该联系方式的部门id列表，只在type为2时有效

 * @returns {Promise.<TResult>}
 */
exports.addContactWay = function (userId) {
  return this.request({
    url: 'crm/add_contact_way',
    method: 'post',
    data: Object.assign({userid: userId}, data)
  })
}

/**
 * 获取企业已配置的「联系我」方式
 * https://work.weixin.qq.com/api/doc#90000/90135/91559
 * @param configId 
 * {
   "errcode": 0,
   "errmsg": "ok",
   "contact_way":[
    {
        "config_id":42b34949e138eb6e027c123cba77fad7,
        "type":1,
        "scene":1,
        "style":2,
        "remark":"test remark",
        "skip_verify":true,
        "state":"teststate",
        "qr_code":"http://p.qpic.cn/wwhead/duc2TvpEgSdicZ9RrdUtBkv2UiaA/0"
    }
   ]
}
 * @returns {Promise.<TResult>}
 */
exports.getContactWay = function (configId) {
  return this.request({
    method: 'post',
    url: 'crm/get_contact_way',
    data: {
      config_id: configId
    }
  })
}

/**
 * 更新企业已配置的「联系我」方式
 * https://work.weixin.qq.com/api/doc#90000/90135/91559
 * @param 
 * {
   "config_id":"42b34949e138eb6e027c123cba77fad7",
   "remark":"渠道客户",
   "skip_verify":true,
   "style":1,
   "state":"teststate",
   "user" : ["UserID1", "UserID2", "UserID3"],
   "party" : [PartyID1, PartyID2]
}

{
   "errcode": 0,
   "errmsg": "ok"
}
 * @returns {Promise.<TResult>}
 */
exports.updateContactWay = function (data) {
  return this.request({
    url: 'crm/update_contact_way',
    method: 'post',
    data
  })
}

/**
 * 删除企业已配置的「联系我」方式
 * https://work.weixin.qq.com/api/doc#90000/90135/91559
 * @param configId
 * @returns {Promise.<TResult>}
 */
exports.delContactWay = function (configId) {
  return this.request({
    url: 'crm/del_contact_way',
    method: 'post',
    data: {
      config_id: configId
    }
  })
}
