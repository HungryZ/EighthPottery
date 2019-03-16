const cloud = require('wx-server-sdk')
cloud.init({
  env: 'release-c4723b',
})
const db = cloud.database()
const _ = db.command
const MAX_LIMIT = 100

exports.main = async (event, context) => {
  console.log('parameters: ', event.parameters)

  if (event.parameters.createDate.length == 10) {       // 按精确日期查询

    event.parameters.createDate = new Date(event.parameters.createDate)
    
  } else if(event.parameters.createDate.length == 7) {  // 按月份查询

    let fromDate = new Date(event.parameters.createDate + '-01')

    let dateArray = event.parameters.createDate.split('-')
    let toYear = Number(dateArray[0])
    let toMonth = Number(dateArray[1]) + 1
    if (toMonth == 13) {
      toMonth = 1
      toYear += 1
    }
    let toDate = new Date(toYear + '-' + toMonth + '-01')

    console.log('From : ' + fromDate)
    console.log('To : ' + toDate)
    
    event.parameters.createDate = _.gte(fromDate).and(_.lt(toDate))
  }

  // 先取出集合记录总数
  const countResult = await db.collection('order').where(event.parameters).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('order').where(event.parameters).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => ({
    data: acc.data.concat(cur.data),
    errMsg: acc.errMsg,
  }))
}