const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-aa70dd',
})

const db = cloud.database()
exports.main = async (event, context) => {
  try {
    const progressModel = event.progressModel
    return await db.collection('progress').doc(progressModel._id)
      .update({
        data: {
          description: progressModel.description,
          time: progressModel.time,
          note: progressModel.note,
        },
      })
  } catch (e) {
    console.error(e)
  }
}