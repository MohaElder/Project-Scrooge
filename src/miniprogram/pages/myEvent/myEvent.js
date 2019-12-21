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
    checkList: [],
    isImage: false,
    inputShowed: false,
    inputVal: "",
    isTrue: false,
    selectedIndex: 99999,

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

  kindToggle: function(e) {
    var id = e.currentTarget.id,
      list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },

  calcRevenue: function(checks) {
    let revenue = 0;
    for (let check of checks) {
      revenue += check.totalPrice;
    }
    this.setData({
      revenue: revenue
    })
  },

  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    var searchResult = [];
    for (let check of this.data.checkList) {
      if (e.detail.value == '') {
        this.setData({
          searchResult: []
        })
        break;
      }
      if (check.user.name.indexOf(e.detail.value) >= 0 && searchResult.includes(check) == false) {
        searchResult.push(check)
      }
    }
    this.setData({
      inputVal: e.detail.value,
      searchResult: searchResult
    });
  },

  openDialog: function(e) {
    this.setData({
      isTrue: true,
      selectedIndex: e.currentTarget.dataset.index
    })
  },

  closeDialog: function() {
    this.setData({
      isTrue: false
    })
  },

  deleteCheck: function() {
    wx.showLoading({
      title: 'Deleting...',
    })
    wx.cloud.callFunction({
        name: 'deleteDB',
        data: {
          dbName: "check",
          id: this.data.checkList[this.data.selectedIndex]._id
        }
      })
      .then(res => {
        wx.hideLoading();
        wx.showToast({
          title: 'Deleted',
        })
      })
      .catch(console.error);
  },

  changeStatus: function(e) {
    wx.showLoading({
      title: 'Updating...',
    })
    wx.cloud.callFunction({
        name: 'updateStatus',
        data: {
          id: this.data.checkList[this.data.selectedIndex]._id,
          status: e.currentTarget.dataset.status
        }
      })
      .then(res => {
        console.log(this.data.checkList[this.data.selectedIndex].status)
        wx.cloud.callFunction({
            name: 'sendMessage',
            data: {
              openid: this.data.checkList[this.data.selectedIndex]._openid,
              checkID: this.data.checkList[this.data.selectedIndex]._id,
              eventName: this.data.checkList[this.data.selectedIndex].event.name,
              status: e.currentTarget.dataset.status,
              time: this.data.checkList[this.data.selectedIndex].time,
            }
          })
          .then(res => {
            wx.hideLoading();
            wx.showToast({
              title: 'Updated',
            })
          })
          .catch(console.error);
      })
      .catch(console.error);
  },

})