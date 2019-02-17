const cloud = require('wx-server-sdk')

cloud.init({
  env: 'release-c4723b',
})

const db = cloud.database()
exports.main = async (event, context) => {
  try {
    console.log(event._id)
    return await db.collection('administrator').where({
      admin_openid: event._openid
    }).remove()
  } catch (e) {
    console.error(e)
  }
}