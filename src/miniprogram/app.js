//app.js
App({
  globalData: {
    windowWidth: 0, //页面视图宽度
    windowHeight: 0, //视图高度
    imgMargin: 6, //图片边距: 单位px
    imgWidth: 0, //图片宽度: 单位px
  },

  onLaunch: function() {
    var that = this;

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    //获取页面宽高度
    wx.getSystemInfo({
      success: function(res) {
        var windowWidth = res.windowWidth;
        var imgMargin = that.globalData.imgMargin;
        //两列，每列的图片宽度
        var imgWidth = (windowWidth - imgMargin * 3) / 2;
        that.globalData.windowWidth = windowWidth,
        that.globalData.windowHeight = res.windowHeight,
        that.globalData.imgWidth = imgWidth
      }
    })

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
            }
          })
        }
      }
    })

  }
})