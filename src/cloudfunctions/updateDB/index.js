const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    console.log(event.index, event.commID, event.dbName, event.id, event.stock)
    var path = 'commodities.' + event.index + '.stock';
    console.log(path);
    return await db.collection(event.dbName).where({
      'commodities.commID': event.commID
    }).update({
      data: {
        ['commodities.' + event.index + '.stock']: event.stock
      }
    })
  } catch (e) {
    console.error(e)
  }
}








