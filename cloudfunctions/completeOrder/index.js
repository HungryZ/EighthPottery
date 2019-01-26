// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-aa70dd',
})

const db = cloud.database()
exports.main = async(event, context) => {
  try {
    return await db.collection('order').where({
        order_id: event.order_id
      })
      .update({
        data: {
          isDone: true,
          doneDate: new Date(event.dateString)
        },
      })
  } catch (e) {
    console.error(e)
  }
}