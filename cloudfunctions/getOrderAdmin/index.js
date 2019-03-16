// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'release-c4723b',
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let orderModel = await db.collection('order').doc(event.orderID).get()
  orderModel = orderModel.data

  let tasks = []
  // 之前的数据没有_openid
  if (orderModel._openid) {
    const promise = db.collection('user').where({
      _openid: orderModel._openid
    }).get()
    tasks.push(promise)
  }

  if (orderModel.doneBy) {
    const promise2 = db.collection('user').where({
      _openid: orderModel.doneBy
    }).get()
    tasks.push(promise2)
  }

  let userArray = (await Promise.all(tasks)).map(res => {
    return res.data[0]
  })
  if (userArray[0]) {
    orderModel.createrName = userArray[0].nickName
  }
  if (userArray[1]) {
    orderModel.doneName = userArray[0].nickName
  }

  return {
    order: orderModel,
    userArray: userArray
  }
}