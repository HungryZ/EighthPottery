const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  // 承载所有操作的 promise 的数组
  const tasks = [], successIDs = [], failureIDs = []

  event.orderIDArray.forEach(order_id => {
    const promise = cloud.callFunction({
      name: 'insertOrder',
      data: {
        order_id: order_id,
        dateString: event.dateString,
      }
    })
    tasks.push(promise)
  })
  // 等待执行所有
  const results = (await Promise.all(tasks)).map(res => {
    return res.result
  })
  console.log('执行结果：', results)
  
  for (var i = 0; i < results.length; i++) {
    if (results[i]) {
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