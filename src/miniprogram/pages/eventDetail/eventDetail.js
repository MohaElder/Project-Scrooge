// miniprogram/pages/eventDetail/eventDetail.js
const md5 = require('../../utils/md5.js');
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog:false,
    checkboxItems: [
    ],
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

  openDialog: function () {
    this.setData({
      istrue: true
    })
  },
  
  closeDialog: function () {
    this.setData({
      istrue: false
    })
  },

  checkboxChange: function (e) {
    var checkboxItems = this.data.checkboxItems
    var values = e.detail.value;
    var price = 0;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].price == values[j]) {
          checkboxItems[i].checked = true;
          price += checkboxItems[i].price;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems,
      price: price
    });

  },

  purchase: function() {
    this.setData({
      istrue: false
    })
    wx.showToast({
      title: 'Success!',
    })
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