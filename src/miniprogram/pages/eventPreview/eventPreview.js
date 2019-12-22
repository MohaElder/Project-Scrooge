// miniprogram/pages/eventDetail/eventDetail.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
const util = require('../../utils/util.js');

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
    for (let item of app.globalData.dataPackage.commodities) {
      item.checked = false;
      item.addedPrice = item.price;
      item.initialStock = item.stock;
    }
    that.setData({
      event: app.globalData.dataPackage,
      checkboxItems: app.globalData.dataPackage.commodities,
    })
  },

  PickerChange(e) {
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

  inputNote: function(e) {
    this.setData({
      note: e.detail.value
    })
  },

  inputStock: function(e) {
    var checkboxItem = this.data.checkboxItems[e.target.dataset.index]
    var pricePath = 'checkboxItems[' + e.target.dataset.index + '].addedPrice';
    var price = checkboxItem.price * e.detail.value;
    var stockPath = 'checkboxItems[' + e.target.dataset.index + '].stock';
    var stock = checkboxItem.initialStock - e.detail.value;
    var purchasedPath = 'checkboxItems[' + e.target.dataset.index + '].purchasedNum';
    if (Number(e.detail.value) > Number(checkboxItem.initialStock)) {
      wx.showToast({
        icon: 'none',
        title: 'Stock Limit Reached'
      })
    } else {
      this.setData({
        [pricePath]: price,
        [stockPath]: stock,
        [purchasedPath]: e.detail.value
      })
    }
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
    for (let item of this.data.checkboxItems) {
      if (item.checked) {
        totalPrice += item.addedPrice;
      }
    }
    this.setData({
      price: totalPrice
    })
  },

  askCreate: function() {
    var that = this;
    wx.showModal({
      title: 'Just Checking',
      content: 'Are you sure you want to upload?',
      success(res) {
        if (res.confirm) {
          that.createEvent();
        }
      }
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

  },

  createEvent: function() {
    wx.showLoading({
      title: 'Creating...',
    })
    wx.cloud.uploadFile({
      cloudPath: 'eventPics/' + app.globalData.dataPackage._id + "bigPic.png",
      filePath: app.globalData.dataPackage.bigPic, // 文件路径
      success: res => {
        var bigPic = res.fileID
        wx.cloud.uploadFile({
          cloudPath: 'eventPics/' + app.globalData.dataPackage._id + "coverPic.png",
          filePath: app.globalData.dataPackage.coverPic, // 文件路径
          success: res => {
            var coverPic = res.fileID;
            wx.cloud.uploadFile({
              cloudPath: 'eventPics/' + app.globalData.dataPackage._id + "contentPic.png",
              filePath: app.globalData.dataPackage.contentPic, // 文件路径
              success: res => {
                var contentPic = res.fileID
                wx.cloud.uploadFile({
                  cloudPath: 'eventPics/' + app.globalData.dataPackage._id + "paymentPic.png",
                  filePath: app.globalData.dataPackage.paymentPic, // 文件路径
                  success: res => {
                    var paymentPic = res.fileID;
                    db.collection('event').add({
                      data: {
                        _id: app.globalData.dataPackage._id,
                        name: app.globalData.dataPackage.name,
                        desc: app.globalData.dataPackage.desc,
                        location: app.globalData.dataPackage.location,
                        date: app.globalData.dataPackage.date,
                        provider: app.globalData.dataPackage.provider,
                        bigPic: bigPic,
                        contentPic: contentPic,
                        coverPic: coverPic,
                        paymentPic: paymentPic,
                        commodities: app.globalData.dataPackage.commodities,
                        createdBy: app.globalData.openid,
                        note: app.globalData.dataPackage.note
                      },
                      success: function(res) {
                        wx.hideLoading();
                        wx.reLaunch({
                          url: '../index/index',
                        })
                      }
                    });
                  }
                })
              }
            })
          }
        })
      }
    })
  }
})