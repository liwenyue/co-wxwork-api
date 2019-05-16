/**
 * 应用支持推送文本、图片、视频、文件、图文等类型。
 * https://work.weixin.qq.com/api/doc#90000/90135/90221
 * @param data
 * {
   "touser" : "UserID1|UserID2|UserID3",
   "toparty" : "PartyID1|PartyID2",
   "totag" : "TagID1 | TagID2",
   "msgtype" : "text",
   "agentid" : 1,
   "text" : {
       "content" : "你的快递已到，请携带工卡前往邮件中心领取。\n出发前可查看<a href=\"http://work.weixin.qq.com\">邮件中心视频实况</a>，聪明避开排队。"
   },
   "safe":0
}
 * @returns {Promise.<TResult>}
 */
exports.send = function (data) {
  return this.request({
    method: 'post',
    url: 'message/send',
    data
  })
}


exports.sendText = function ({touser, toparty, totag, agentid, content}) {
  return this.send({
    touser,
    toparty,
    totag,
    msgtype : "text",
    agentid,
    text : {
      content
    },
  });
}


exports.sendCard = function ({touser, toparty, totag, agentid, title, description, url, btntxt}) {
  return this.send({
    touser,
    toparty,
    totag,
    msgtype : "textcard",
    agentid,
    textcard : {
      title,
      description,
      url,
      btntxt: btntxt || '详情'
    }
  });
}


exports.sendCard = function ({touser, toparty, totag, agentid, title, description, url, btntxt}) {
  return this.send({
    touser,
    toparty,
    totag,
    msgtype: "textcard",
    agentid,
    textcard: {
      title,
      description,
      url,
      btntxt: btntxt || '详情'
    }
  });
}


exports.sendMarkDown = function ({touser, toparty, totag, agentid, content}) {
  return this.send({
    touser,
    toparty,
    totag,
    msgtype: "markdown",
    agentid,
    markdown: {
      content
    }
  });
}

