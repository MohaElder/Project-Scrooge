// miniprogram/pages/myEvents/myEvents.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    event: {},
    checkList:[],
    showDialog: false,
    isImage: false,
    inputShowed: false,
    inputVal: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    db.collection('event').where({
      _id: options.id
    }).get().then(res => {
      that.setData({
        event: res.data[0]
      });
    })

    db.collection('check').where({
      'event._id': options.id
    }).get().then(res => {
      that.setData({
        checkList: res.data
      });
      this.calcRevenue(res.data);
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

  calcRevenue: function (checks) {
    let revenue = 0;
    for (let check of checks) {
      revenue += check.totalPrice;
    }
    this.setData({
      revenue: revenue
    })
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    var searchResult = [];
    for(let check of this.data.checkList){
      if(e.detail.value == ''){
        this.setData({
          searchResult: []
        })
        break;
      }
      if(check.user.info.nickName.indexOf(e.detail.value)>=0 && searchResult.includes(check) == false){
        searchResult.push(check)
      }
    }
    this.setData({
      inputVal: e.detail.value,
      searchResult:searchResult
    });
  },
})