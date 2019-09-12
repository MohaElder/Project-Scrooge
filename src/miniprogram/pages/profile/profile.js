// miniprogram/pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  getImageIdCustom: function(info) {
    console.log(info.detail);
    this.toEventDetail();
  },

  toEventDetail: function() {
    wx.navigateTo({
      url: './../eventDetail/eventDetail?',
    })
  }

})