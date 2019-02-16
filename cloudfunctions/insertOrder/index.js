// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    await db.collection('order')
      .add({
        data: {
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