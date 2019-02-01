// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const nowDate = new Date()

  const res = await db.collection('user').where({
    _openid: wxContext.OPENID
  }).count()

  const isNewUser = res.total == 0 ? true : false
  if (isNewUser) {
    await db.collection('user').add({
      data: {
        _openid: wxContext.OPENID,
        avatarUrl: event.avatarUrl,
        nickName: event.nickName,
        createDate: nowDate,
        lastLoginDate: nowDate,
      }
    })
  } else {
    await db.collection('user').where({
      _openid: wxContext.OPENID
    }).update({
      data: {
        avatarUrl: event.avatarUrl,
        nickName: event.nickName,
        lastLoginDate: nowDate,
      }
    })
  }

  const res = await db.collection('administrator').where({
    admin_openid: wxContext.OPENID
  }).count()

  console.log('用户信息：', event.avatarUrl);
  console.log('用户信息：', event.nickName);

  return {
    message: isNewUser ? '新用户' : '老用户',
    isAdministrator: res.total == 0 ? false : true
  }

}