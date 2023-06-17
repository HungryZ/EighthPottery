// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const res = await db.collection('user').where({
    _openid: wxContext.OPENID
  }).get()

  console.log('用户信息：', res.data[0]);

  const res2 = await db.collection('administrator').where({
    admin_openid: wxContext.OPENID
  }).count()

  return {
    user: res.data[0],
    isAdministrator: res2.total == 0 ? false : true
  }

}