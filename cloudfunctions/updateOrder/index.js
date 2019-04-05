const cloud = require('wx-server-sdk')

cloud.init({
  // env: 'release-c4723b',
})

const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    const orderModel = event.orderModel
    let parameters = {
      isDone: orderModel.isDone,
      doneDate: orderModel.isDone ? new Date(orderModel.doneDate) : _.remove(),
      doneBy: orderModel.isDone ? cloud.getWXContext().OPENID : _.remove(),
    }
    if (orderModel.createDate) {
      parameters.createDate = new Date(orderModel.createDate)
    }
    if (orderModel.note) {
      parameters.note = orderModel.note
    }

    return await db.collection('order').doc(orderModel._id)
      .update({
        data: parameters
      })
  } catch (e) {
    console.error(e)
  }
}