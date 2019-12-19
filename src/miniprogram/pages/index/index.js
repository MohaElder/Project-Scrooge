//index.js
const md5 = require('../../utils/md5.js');
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
const util = require('../../utils/util.js');

var openid = "";
var eventList = [];
var count = 1;
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
    dataList: [], //数据源
    windowWidth: 0, //页面视图宽度
    windowHeight: 0, //视图高度
    imgMargin: 6, //图片边距: 单位px
    imgWidth: 0, //图片宽度: 单位px
    topArr: [0, 0], //存储每列的累积top
  },

  //页面每次打开运行
  onLoad: function() {
    var that = this;
    //获取页面宽高度
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        var windowWidth = res.windowWidth;
        var imgMargin = that.data.imgMargin;
        //两列，每列的图片宽度
        var imgWidth = (windowWidth - imgMargin * 3) / 2;
        that.setData({
          windowWidth: windowWidth,
          windowHeight: res.windowHeight,
          imgWidth: imgWidth
        })
      }
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

  //加载图片
  loadImage: function(e) {
    var that = this;
    var coverPics = [];
    var index = e.currentTarget.dataset.index; //图片所在索引
    var imgW = e.detail.width,
      imgH = e.detail.height; //图片实际宽度和高度
    var imgWidth = this.data.imgWidth; //图片宽度,计算图片应该显示的高度
    var imgScaleH = (imgWidth / imgW * imgH);
    var dataList = this.data.eventList;
    var margin = this.data.imgMargin; //图片间距
    //第一列的累积top，和第二列的累积top
    var firtColH = this.data.topArr[0],
      secondColH = this.data.topArr[1];
    var obj = dataList[index];
    obj.height = imgScaleH;
    if (firtColH < secondColH) { //表示新图片应该放到第一列
      obj.left = margin;
      obj.top = firtColH + margin;
      firtColH += margin + obj.height;
    } else { //放到第二列
      obj.left = margin * 2 + imgWidth;
      obj.top = secondColH + margin;
      secondColH += margin + obj.height;
    }
    this.setData({
      eventList: dataList,
      topArr: [firtColH, secondColH],
    });
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
        console.log(res)
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
            eventList: eventList
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
          title: '您已登录！',
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

  },
});