// miniprogram/pages/newEvent/newEvent.js
var items = [];
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: {
      bigPic: "",
      coverPic: "",
      contentPic: "",
      paymentPic: ""
    },
    date: "2019-09-01",
    time: "12:00",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    for (var i = 0; i < 99; i++) {
      items.push({
        name: "",
        price: 0
      });
    }
  },

  chooseImage: function(options) {
    var that = this;
    var path = "pics." + options.currentTarget.dataset.imagename;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          [path]: res.tempFilePaths
        });
      }
    })
  },

  inputItemNumber: function(e) {
    var num = e.detail.value - 0;
    if (num < 99) {
      for (var i = 0; i < 99; i++) {
        items.push({
          name: "",
          price: 0
        });
      }

      this.setData({
        itemNumber: num
      })
    } else {
      wx.showModal({
        title: 'Warning',
        content: 'Item Number Out of Range',
      })
    }

  },

  addItemName: function(e) {
    items[e.currentTarget.dataset.index].name = e.detail.value
  },
  addItemPrice: function(e) {
    items[e.currentTarget.dataset.index].price = Number(e.detail.value)
  },
  addItemStock: function(e) {
    items[e.currentTarget.dataset.index].stock = e.detail.value
  },
  addItemNote: function(e) {
    this.setData({
      note: e.detail.value
    })
  },

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },

  createEvent: function(res) {
    wx.showLoading({
      title: 'Uploading...',
    })
    for (let i = 0; i < items.length; i++) {
      if (items[i].name == "") {
        items.splice(i, 1);
        i = 0;
      }
    }
    for (let item of items) {
      item.commID = "mocomm";
      for (let i = 0; i < 6; i++) {
        item.commID += Number.parseInt(Math.random() * 10);
      }
    }
    var name = res.detail.value.eventName,
      provider = res.detail.value.eventProvider,
      location = res.detail.value.eventLocation,
      desc = res.detail.value.eventDesc;
    var date = this.data.date + " " + this.data.time;
    var eventID = "moha";
    for (var i = 0; i < 6; i++) {
      eventID += Number.parseInt(Math.random() * 10);
    }
    var dataPackage = {
      bigPic: this.data.pics.bigPic[0],
      coverPic: this.data.pics.coverPic[0],
      contentPic: this.data.pics.contentPic[0],
      paymentPic: this.data.pics.paymentPic[0],
      _id: eventID,
      name: name,
      desc: desc,
      location: location,
      date: date,
      provider: provider,
      commodities: items,
      createdBy: app.globalData.openid,
      note: this.data.note
    }

    app.globalData.dataPackage = dataPackage;

    wx.navigateTo({
      url: '../eventPreview/eventPreview',
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