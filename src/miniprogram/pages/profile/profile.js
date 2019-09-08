// miniprogram/pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekList: [{
        name: "TitleC",
        desc: "Jenn",
        imageUrl: "https://wx1.sinaimg.cn/mw690/006tozhpgy1g5zenmgujyj31900u0e87.jpg",
        id: "AAA",
        location: "Luo Xiu Rd.",
        price: "30",
        date: "2019/9/27",
        provider: "More Club"
      },
      {
        name: "TitleD",
        desc: "Yun",
        imageUrl: "https://wx3.sinaimg.cn/mw690/006tozhpgy1g5zenkcwwzj31900u07wn.jpg",
        id: "BBB",
        location: "Luo Xiu Rd.",
        price: "30",
        date: "2019/9/27",
        provider: "More Club"
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