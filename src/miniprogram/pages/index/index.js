//index.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
const util = require('../../utils/util.js');

var openid = "";
var eventList = [];
var userInfo = {};

Page({
  data: {
    gradeIndex: 0,
    gradePicker: ['Class of 2020', 'Class of 2021', 'Class of 2022', 'Class of 2023', 'Class of 2024'],
    isRegistered: true,
    userInfo: {},
    card: false,
    swiperList: [],
    eventList: [],
    isAdmin: false,
    isPrisoner: false,
    isEventLoaded: false
  },

  //页面每次打开运行
  onLoad: function() {
    this.setData({
      imgWidth: app.globalData.imgWidth,
      windowWidth: app.globalData.windowWidth,
      windowHeight: app.globalData.windowHeight, //视图高度
      imgMargin: app.globalData.imgMargin, //图片边距: 单位px
      imgWidth: app.globalData.imgWidth, //图片宽度: 单位px
    })
    this.getOrderList();
    this.onGetOpenid();
    wx.showLoading({
      title: '加载中...',
    })
  },

  onShow: function() {

  },

  toEventDetail: function(id) {
    wx.navigateTo({
      url: './../eventDetail/eventDetail?id=' + id,
    })
  },

  getImageId: function(info) {
    this.toEventDetail(info.currentTarget.dataset.id);
  },

  getImageIdCustom: function(info) {
    this.toEventDetail(info.detail);
  },

  //获取菜谱
  getOrderList: function() {
    var that = this;
    var coverPics = [];
    wx.cloud.callFunction({
        name: 'getDB',
        data: {
          dbName: "event"
        }
      })
      .then(res => {
        eventList = res.result.data;
        app.globalData.eventList = res.result.data;
        for (let event of eventList) {
          coverPics.push({
            fileID: event.coverPic,
            maxAge: 60 * 60, // one hourevent.coverPic)
          })
        }
        wx.cloud.getTempFileURL({
          fileList: coverPics
        }).then(res => {
          // get temp file URL
          for (let i = 0; i < eventList.length; i++) {
            eventList[i].coverPic = res.fileList[i].tempFileURL
          }
          that.setData({
            eventList: eventList,
            isEventLoaded:true
          });
        }).catch(error => {
          // handle error
        })

      })
      .catch(console.error);
  },

  //获取用户openid
  onGetOpenid: function() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        openid = res.result.openid;
        app.globalData.openid = res.result.openid;
        this.sync();
      },
      fail: err => {
        wx.showToast({
          title: '出大问题',
        });
      }
    });
  },

  //获取微信用户信息
  getUserInfo: function(res) {
    wx.showLoading({
      title: 'Validating......',
    })
    userInfo = res.detail.userInfo;
    this.setData({
      isValidated: true
    })
    wx.hideLoading();

  },
  //用户注册
  register: function(res) {
    if (res.detail.value.classRoom != '' && res.detail.value.name != '' && res.detail.value.classRoom > 0 && res.detail.value.classRoom < 12) {
      var that = this;
      db.collection('user').add({
        data: {
          _id: openid,
          info: userInfo,
          name: res.detail.value.name,
          grade: res.detail.value.grade,
          classroom: res.detail.value.classRoom,
          isAdmin: false,
          isAlarmed: false
        }
      });
      app.globalData.user = res.data;
      wx.showToast({
        title: 'Registered!',
      });
      wx.reLaunch({
        url: '../index/index',
      })
    } else {
      wx.showToast({
        title: 'Info Incorrect',
      })
    }
  },

  //从数据库下载用户信息
  sync: function() {
    var that = this;
    db.collection('user').doc(openid).get({ //建立或者更新数据库信息
      success: function(res) {
        app.globalData.user = res.data;
        var now = new Date();
        that.setData({
          weekList: eventList,
          userInfo: res.data.info,
          modalName: null
        });
        // res.data 包含该记录的数据
        wx.showToast({
          title: 'Logged In！',
        });
        that.isAdmin(res.data);
        //that.checkEmergency(res.data);
      },
      fail: function() {
        wx.hideLoading();
        that.setData({
          isRegistered: false
        });
      }
    });

  },

  //下拉刷新
  onPullDownRefresh: function() {
    wx.reLaunch({
      url: 'index',
    })
  },
});