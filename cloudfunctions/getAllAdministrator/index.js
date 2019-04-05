// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取所有管理员
  const res = await db.collection('administrator').get()
  const adminIDArray = res.data.map(admin => {
    return admin.admin_openid
  })

  // 到user表查询
  const tasks = adminIDArray.map(_openid => {
    return db.collection('user').where({
      _openid: _openid
    }).get()
  })
  const userArray = (await Promise.all(tasks)).map(res => {
    return res.data[0]
  })

  return {
    userArray: userArray
  }
}