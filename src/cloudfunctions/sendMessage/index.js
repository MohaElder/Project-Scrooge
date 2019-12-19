const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async(event, context) => {
  try {
    if(event.status == "Paid"){
      var status = "已支付";
    }
    else if(event.status == "Pending"){
      var status = "未支付"
    }
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid,
      page: 'index',
      data: {
        character_string6: {
          value: event.checkID
        },
        thing1: {
          value: event.eventName
        },
        phrase2: {
          value: status
        },
        date3: {
          value: event.time
        }
      },
      templateId: 'KWz4gYx0OcHMZfVFPNjXx43ln50Sllf5Fklj8IfqVks'
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}