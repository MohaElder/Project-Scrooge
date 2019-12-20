// miniprogram/pages/eventDetail/eventDetail.js
const md5 = require('../../utils/md5.js');
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
const util = require('../../utils/util.js');

var commodity = [];
var price = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,
    checkboxItems: [],
    price: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    for (var i = 0; i < app.globalData.eventList.length; i++) {
      if (app.globalData.eventList[i]._id == options.id) {
        for (let item of app.globalData.eventList[i].commodities) {
          item.checked = false;
          item.addedPrice = item.price;
        }
        that.setData({
          event: app.globalData.eventList[i],
          checkboxItems: app.globalData.eventList[i].commodities
        })
      }
    }
  },

  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },

  openDialog: function() {
    this.setData({
      istrue: true
    })
  },

  closeDialog: function() {
    this.setData({
      istrue: false
    })
  },

  closeImage: function() {
    this.setData({
      isImage: false
    })
  },

  inputNote: function(e){
    this.setData({
      note:e.detail.value
    })
  },

  inputStock: function(e) {
    var checkboxItem = this.data.checkboxItems[e.target.dataset.index]
    var pricePath = 'checkboxItems[' + e.target.dataset.index + '].addedPrice';
    var price = checkboxItem.price * e.detail.value;
    var stockPath = 'checkboxItems[' + e.target.dataset.index + '].stock';
    this.setData({
      [pricePath]: price,
      [stockPath]: _.inc(-e.detail.value)
    })
    this.calcPrice();
  },

  checkboxChange: function(e) {
    var checkboxItems = this.data.checkboxItems
    var checkedPath = 'checkboxItems[' + e.currentTarget.dataset.index + '].checked'
    this.setData({
      [checkedPath]: !checkboxItems[e.currentTarget.dataset.index].checked
    });
    this.calcPrice();
  },

  calcPrice: function() {
    var totalPrice = 0;
    for(let item of this.data.checkboxItems){
      if(item.checked){
        totalPrice += item.addedPrice;
      }
    }
    this.setData({
      price: totalPrice
    })
  },

  joinEvent: function() {
    this.setData({
      istrue: false
    })
    this.purchase();
  },

  //确认触发购买函数
  purchase: function() {
    var that = this;
    wx.requestSubscribeMessage({
      tmplIds: ['KWz4gYx0OcHMZfVFPNjXx43ln50Sllf5Fklj8IfqVks'],
      success(res) {
        var checkID = "mooa";
        for (var i = 0; i < 6; i++) {
          checkID += Number.parseInt(Math.random() * 10);
        }
        wx.setClipboardData({
          data: checkID,
          success(res) {
            wx.getClipboardData({
              success(res) {
                console.log(res.data) // data
              }
            })
          }
        })
        that.updateOrder();
        that.updateCheck(checkID);
        that.updateLocal();
        that.setData({
          isImage: true,
          checkID: checkID
        })
      }
    })
  },

  saveID: function() {
    wx.setClipboardData({
      data: this.data.checkID,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },

  //更新数据库仓库信息
  updateOrder: function() {
    var that = this;
      wx.cloud.callFunction({
        name: 'updateDB',
        data: {
          id: this.data.event._id,
          commodities: this.data.checkboxItems
        }
      }).then(res => {

      }).catch(console.error);
  },

  scanCode: function(options) {
    var that = this;
    wx.cloud.downloadFile({
      fileID: options.currentTarget.dataset.src,
      success: function(res) {
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res) {
            wx.showLoading({
              title: '正在调制孟婆汤',
            })
            that.setData({
              isImage: false
            })
            wx.hideLoading();
            wx.showModal({
              title: 'Image Saved!',
              content: 'Use Scan Code in WeChat and scan the payment image. Remember to type in the copied ticket ID in the side note.',
              success: function(res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../profile/profile',
                  })
                }
              }
            })
          }
        })
      }
    })
  },

  //更新数据库订单信息
  updateCheck: function(checkID) {
    var that = this;
    var time = util.formatTime(new Date());
    db.collection("check").add({
      data: {
        _id: checkID,
        user: app.globalData.user,
        event: that.data.event,
        commodities: commodity,
        time: time,
        isRated: false,
        totalPrice: price,
        note: this.data.note,
        status: "Pending"
      }
    });
    // res.data 包含该记录的数据b
  },

  //刷新本地渲染信息
  updateLocal: function() {
    var that = this;
    that.setData({
      isOrdered: true,
      modalName: "purchaseDone"
    });
    app.globalData.isOrdered = true;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})