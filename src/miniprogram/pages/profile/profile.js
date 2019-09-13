// miniprogram/pages/profile/profile.js
var checkList = [];
const app = getApp();
var wxbarcode = require('../../utils/index.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,
    weekList: [{
        name: "Arctic Trip",
      imageUrl: "https://mohaelder.oss-cn-beijing.aliyuncs.com/contentPic.jpg",
        id: "AAA",
        location: "Norway",
        price: "20",
        date: "2019/9/27",
        provider: "MohaElder169"
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '正在打发土地爷',
    });
    checkList = [];
    var that = this;
    wx.cloud.callFunction({
      name: 'getDB',
      data: {
        dbName: "check"
      }
    })
      .then(res => {
        for (var i = 0; i < res.result.data.length; i++) {
          if (res.result.data[i].user._openid == app.globalData.openid) {
            checkList.push(res.result.data[i]);
          }
        }
        checkList.reverse();
        that.setData({
          user: app.globalData.user,
          checkList: checkList
        });
        wx.hideLoading();
      })
      .catch(console.error);
  },

  closeDialog: function () {
    wxbarcode.qrcode('qrcode', 'FreedomIsNotFree', 0, 0);
    this.setData({
      istrue: false
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

  openDialog: function(options) {
    console.log();
    wxbarcode.qrcode('qrcode', options.currentTarget.dataset.id, 420, 420);
    this.setData({
      istrue:true,
      currentID: options.currentTarget.dataset.id
    })
  }

})