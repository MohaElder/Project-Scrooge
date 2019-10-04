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
    price: "Free"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    for (var i = 0; i < app.globalData.eventList.length; i++) {
      if (app.globalData.eventList[i]._id == options.id) {
        console.log(app.globalData.eventList[i]);
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

  checkboxChange: function(e) {
    var checkboxItems = this.data.checkboxItems
    var values = e.detail.value;
    price = 0;
    commodity = [];
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].price == values[j]) {
          checkboxItems[i].checked = true;
          price += checkboxItems[i].price;
          commodity.push(i);
          //console.log(commodity);
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems,
      price: price
    });

  },

  joinEvent: function() {
    this.setData({
      istrue: false
    })
    this.purchase();
  },

  //确认触发购买函数
  purchase: function() {
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
    this.setData({
      isImage: true,
      checkID: checkID
    })
  },

  saveID: function(){
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
    for (var i = 0; i < commodity.length; i++) {
      wx.cloud.callFunction({
        name: 'updateDB',
        data: {
          dbName: "event",
          id: this.data.event._id,
          index: commodity[i],
          commID: this.data.event.commodities[commodity[i]].commID,
          stock: this.data.event.commodities[commodity[i]].stock - 1
        }
      }).then(res => {

      }).catch(console.error);
    }
  },

  scanCode: function(options) {
    var that = this;
    wx.downloadFile({
      url: options.currentTarget.dataset.src,
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
            that.updateOrder();
            that.updateCheck(that.data.checkID);
            that.updateLocal();
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
        status: "Pending"
      }
    });
    // res.data 包含该记录的数据
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