const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-aa70dd',
})

const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('order').doc(event._id).remove()
  } catch (e) {
    console.error(e)
  }
}