// miniprogram/pages/profile/profile.js
var checkList = [];
var myList = [];
const app = getApp();
var wxbarcode = require('../../utils/index.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,
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
        for (var i = 0; i < checkList.length; i++) {
          if (checkList[i].status == "Pending") {
            wx.showModal({
              title: 'Warning',
              content: 'You still have pending check',
            })
            i = 999;
          }
        }
      })
      .catch(console.error);
    wx.cloud.callFunction({
        name: 'getDB',
        data: {
          dbName: "event"
        }
      })
      .then(res => {
        for (var i = 0; i < res.result.data.length; i++) {
          if (res.result.data[i].createdBy == app.globalData.openid) {
            myList.push(res.result.data[i]);
          }
        }
        that.setData({
          myList: myList
        });
        wx.hideLoading();
      })
      .catch(console.error);
  },

  saveID: function() {
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

  scanCode: function(options) {
    var that = this;
    wx.cloud.downloadFile({
      fileID: options.currentTarget.dataset.src,
      success: function(res) {
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res) {
            that.setData({
              isImage: false
            })
            wx.showModal({
              title: 'Image Saved!',
              content: 'Use Scan Code in WeChat and scan the payment image. Remember to type in the copied ticket ID in the side note.',
            })
          },
        })
      }
    })
  },

  closeDialog: function() {
    wxbarcode.qrcode('qrcode', 'FreedomIsNotFree', 0, 0);
    this.setData({
      istrue: false
    })
  },

  closeImage: function() {
    this.setData({
      isImage: false
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
    console.log(options);
    if (options.currentTarget.dataset.status == "Pending") {
      wx.setClipboardData({
        data: options.currentTarget.dataset.id,
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
        currentPaymentPic: options.currentTarget.dataset.paymentpic,
        checkID: options.currentTarget.dataset.id
      })
    } else {
      wxbarcode.qrcode('qrcode', options.currentTarget.dataset.id, 420, 420);
      this.setData({
        istrue: true,
        currentID: options.currentTarget.dataset.id
      })
    }
  },

  toNewEvent: function() {
    wx.navigateTo({
      url: '../newEvent/newEvent',
    })
  },

  openEvent: function(options) {
    wx.navigateTo({
      url: '../myEvent/myEvent?id=' + options.currentTarget.dataset.id,
    })
  }

})