const cloud = require('wx-server-sdk')
cloud.init({
  env: 'test-aa70dd',
})
const db = cloud.database()

exports.main = async(event, context) => {
  // 承载所有操作的 promise 的数组
  const tasks = []
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
  let result = (await Promise.all(tasks)).map(item => {
    // 修改成功数量，用于判断是否修改成功……从而操作id数组
    return item.stats.updated
    console.log('111111')
  })

  return {
    success: result
  }
}