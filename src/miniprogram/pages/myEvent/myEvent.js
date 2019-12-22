// miniprogram/pages/myEvents/myEvents.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
const util = require('../../utils/util.js');
var items = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    event: {},
    checkList: [],
    selectedCheck: {},
    isImage: false,
    inputShowed: false,
    inputVal: "",
    isTrue: false,
    editEvent: false,
    isEventLoaded:false
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
        event: res.data[0],
        isEventLoaded: true
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
      if ((check.user.name.indexOf(e.detail.value) >= 0 || check._id.indexOf(e.detail.value)) && searchResult.includes(check) == false) {
        searchResult.push(check)
      }
    }
    this.setData({
      inputVal: e.detail.value,
      searchResult: searchResult
    });
  },

  openDialog: function(e) {
    for (let item of this.data.checkList) {
      if (item._id == e.currentTarget.dataset.id) {
        this.setData({
          isTrue: true,
          selectedCheck: item,
        })
      }
    }
  },

  openEditEvent: function() {
    this.setData({
      editEvent: true,
      date: this.data.event.date
    })
  },

  closeEditEvent: function() {
    this.setData({
      editEvent: false
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
          id: this.data.selectedCheck._id
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
          id: this.data.selectedCheck._id,
          status: e.currentTarget.dataset.status
        }
      })
      .then(res => {
        wx.cloud.callFunction({
            name: 'sendMessage',
            data: {
              openid: this.data.selectedCheck._openid,
              checkID: this.data.selectedCheck._id,
              eventName: this.data.selectedCheck.event.name,
              status: e.currentTarget.dataset.status,
              time: this.data.selectedCheck.time,
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
  addItemNote: function(e) {
    this.setData({
      note: e.detail.value
    })
  },

  editEvent: function(res) {
    wx.showLoading({
      title: 'Uploading...',
    })

    /*
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
    */
    console.log(res.detail.value);
    var name = res.detail.value.eventName,
      provider = res.detail.value.eventProvider,
      location = res.detail.value.eventLocation,
      desc = res.detail.value.eventDesc;
    var date = this.data.date; // + " " + this.data.time;
    var dataPackage = {
      //bigPic: this.data.pics.bigPic,
      //coverPic: this.data.pics.coverPic,
      //contentPic: this.data.pics.contentPic,
      //paymentPic: this.data.pics.paymentPic,
      name: name,
      desc: desc,
      location: location,
      date: date,
      provider: provider,
      note: this.data.note
    }
    var paymentPic = res.fileID;
    db.collection('event').where({
      _id: this.data.event._id
    }).update({
      data: {
        name: dataPackage.name,
        desc: dataPackage.desc,
        location: dataPackage.location,
        date: dataPackage.date,
        provider: dataPackage.provider,
        note: dataPackage.note
      },
      success: function(res) {
        wx.hideLoading();
        wx.reLaunch({
          url: '../index/index',
        })
      }
    })
  },

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  //下拉刷新
  onPullDownRefresh: function() {
    wx.reLaunch({
      url: 'myEvent',
    })
  },
})