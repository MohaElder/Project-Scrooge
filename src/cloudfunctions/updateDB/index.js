const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async(event, context) => {
  try {
    return await event.commdities.map(item => {
      db.collection('event').where({
        'commodities.commID': item.commID
      }).update({
        data: {
          stock: item.stock
        }
      })
    })
  } catch (e) {
    console.error(e)
  }
}