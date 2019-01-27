const cloud = require('wx-server-sdk')

cloud.init({
  env: 'release-c4723b',
})

const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('progress').doc(event._id).remove()
  } catch (e) {
    console.error(e)
  }
}