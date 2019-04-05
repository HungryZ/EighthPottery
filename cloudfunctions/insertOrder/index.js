// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // env: 'release-c4723b',
})
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    await db.collection('order')
      .add({
        data: {
          _openid: event._openid,
          order_id: event.order_id,
          createDate: new Date(event.dateString),
          isDone: false
        }
      })
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}