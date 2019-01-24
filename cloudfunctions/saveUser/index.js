const cloud = require('wx-server-sdk')
cloud.init({
  env: 'test-aa70dd',
})
const db = cloud.database()
exports.main = async (event, context) => await db.collection('user').where({
}).get()