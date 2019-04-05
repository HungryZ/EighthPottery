const cloud = require('wx-server-sdk')

cloud.init({
  env: 'release-c4723b',
})

const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    const orderModel = event.orderModel
    let parameters = {}

    console.log(orderModel)

    if (orderModel.hasOwnProperty("isDone")) {
      parameters.isDone = orderModel.isDone
      if (orderModel.isDone) {
        parameters.doneDate = new Date(orderModel.doneDate)
        parameters.doneBy = cloud.getWXContext().OPENID
      } else {
        parameters.doneDate = _.remove()
        parameters.doneBy = _.remove()
        parameters.isTook = false
        parameters.tookDate = _.remove()
        parameters.tookModifiedBy = _.remove()
      }
    }
    if (orderModel.createDate) {
      parameters.createDate = new Date(orderModel.createDate)
    }
    if (orderModel.note) {
      parameters.note = orderModel.note
    }
    if (orderModel.hasOwnProperty("isTook")) {
      parameters.isTook = orderModel.isTook
      parameters.tookDate = orderModel.isTook ? new Date(orderModel.tookDate) : _.remove()
      parameters.tookModifiedBy = orderModel.isTook ? cloud.getWXContext().OPENID : _.remove()
    }

    return await db.collection('order').doc(orderModel._id)
      .update({
        data: parameters
      })
  } catch (e) {
    console.error(e)
  }
}