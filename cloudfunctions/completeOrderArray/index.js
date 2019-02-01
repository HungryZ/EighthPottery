const cloud = require('wx-server-sdk')
cloud.init({
  env: 'release-c4723b',
})
const db = cloud.database()

exports.main = async (event, context) => {
  // 承载所有操作的 promise 的数组
  const tasks = [], successIDs = [], failureIDs = []

  for (let i = 0; i < event.orderIDArray.length; i++) {
    const promise = db.collection('order').where({
      order_id: event.orderIDArray[i]
    })
      .update({
        data: {
          isDone: true,
          doneDate: new Date(event.dateString)
        }
      })
    tasks.push(promise)
  }
  // 等待执行所有
  const results = await Promise.all(tasks)
  for (var i = 0; i < results.length; i++) {
    // results[i].stats.updated代表成功更新的个数
    if (results[i].stats.updated) {
      successIDs.push(event.orderIDArray[i])
    } else {
      failureIDs.push(event.orderIDArray[i])
    }
  }

  return {
    successIDs: successIDs,
    failureIDs: failureIDs
  }
}