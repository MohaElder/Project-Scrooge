//index.js
const md5 = require('../../utils/md5.js');
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
const util = require('../../utils/util.js');

var currentFoodIndex = 0; //食物列表位置

//表单参数 Todo：更改为Form形式
var openid = "";
var eventList = [];
var count = 1;
var gradeChosen = 'Class of 2020';
var classChosen = 0;
var codeChosen = '';
var sayingChosen = '';
var validationChosen = '';


Page({
  data: {
    gradeIndex: 0,
    gradePicker: ['Class of 2020', 'Class of 2021', 'Class of 2022', 'Class of 2023', 'Class of 2024'],
    userInfo: {},
    card: false,
    swiperList: [],
    orderList: [],
    isAdmin: false,
    isPrisoner: false
  },

  //页面每次打开运行
  onLoad: function () {
    wx.showLoading({
      title: '调制猪排冰淇淋',
    })
    //this.getOrderList();
    this.onGetOpenid();
    //this.getSwiperPics();
  },

  //获取菜谱
  getOrderList: function () {
    wx.cloud.callFunction({
      name: 'getDB',
      data: {
        dbName: "event"
      }
    })
      .then(res => {
        eventList = res.result.data;
        app.globalData.eventList = res.result.data;
      })
      .catch(console.error);
  },


  //获取封面图片
  getSwiperPics: function () {
    var that = this;
    wx.cloud.callFunction({
      name: 'getDB',
      data: {
        dbName: "coverPages"
      }
    })
      .then(res => {
        that.setData({
          swiperList: res.result.data,
        })
        wx.hideLoading()
      })
      .catch(console.error);
  },

  //获取用户openid
  onGetOpenid: function () {
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

  //用户注册
  register: function (res) {
    var secretCode = '11-1=2';
    if (classChosen != '' && codeChosen != '' && validationChosen == secretCode && classChosen > 0 && classChosen < 11 && codeChosen.substr(0, 1) == 'G') {
      var that = this;
      var userInfo = res.detail.userInfo;
      app.globalData.user = userInfo;
      db.collection('user').add({
        data: {
          _id: openid,
          info: userInfo,
          orderID: [],
          isOrdered: false,
          grade: gradeChosen,
          classroom: classChosen,
          code: codeChosen,
          isPrisoner: false,
          isAdmin: false,
          isAlarmed: false
        }
      });
      app.globalData.user = res.data;
      wx.showToast({
        title: '您已注册！',
      });
      that.sync();
    } else {
      wx.showToast({
        title: '别想混过去',
      })
    }

  },

  //以下为表单函数
  //获取班级
  getClass: function (e) {
    classChosen = e.detail.value;
  },

  //获取学号
  getCode: function (e) {
    codeChosen = e.detail.value;
  },

  //获取校验码
  getValidation: function (e) {
    validationChosen = e.detail.value;
  },

  //获取年级
  PickerChange(e) {
    this.setData({
      gradeIndex: e.detail.value
    })
    gradeChosen = this.data.gradePicker[e.detail.value];
  },
  //以上为表单函数

  //判断是否是Admin=>是否显示Admin按钮
  isAdmin: function (user) {
    var that = this;
    if (user.isAdmin == true) {
      that.setData({
        isAdmin: true
      });
    } else {
      that.isPrisoner(user);
    }
  },

  //从数据库下载用户信息
  sync: function () {
    var that = this;
    db.collection('user').doc(openid).get({ //建立或者更新数据库信息
      success: function (res) {
        app.globalData.user = res.data;
        var now = new Date();
          that.setData({
            eventList: eventList,
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
      fail: function () {
        wx.hideLoading();
        that.setData({
          modalName: "registerModal"
        });
      }
    });

  },

  //跳转至给定参数界面
  navigate: function (options) {
    var pageName = options.currentTarget.dataset.pagename
    var link = "../" + pageName + "/" + pageName;
    wx.navigateTo({
      url: link,
    });
  },

  //随机选择贴心语句
  roll: function () {
    count += 1;
    if (count == 3) {
      count = 0;
      this.showAxiom();
    }
  },

  //确认触发购买函数
  confirmPurchase: function () {
    this.updateOrder(currentFoodIndex);
    this.setData({
      modalName: null
    })
  },

  //更新数据库菜谱（仓库）信息
  updateOrder: function (index) {
    var that = this;
    var orderTemp = orderList[index];

    wx.showLoading({
      title: '正在调制孟婆汤',
    })
    wx.cloud.callFunction({
      name: 'updateDB',
      data: {
        dbName: "order",
        id: orderTemp._id,
        stock: orderTemp.stock - 1
      }
    }).then(res => {
      that.updateUser(orderTemp);
      that.updateCheck(orderTemp);
      that.updateLocal();
      wx.hideLoading();
    }).catch(console.error);
  },

  //更新数据库用户信息
  updateUser: function (order) {
    var that = this;
    var orderTemp = that.data.order;

    db.collection('user').doc(openid).update({
      data: {
        orderID: _.push(order._id),
        isOrdered: true
      }
    });
    // res.data 包含该记录的数据
  },

  //更新数据库订单信息
  updateCheck: function (order) {
    var that = this;
    var checkID = "moha";
    for (var i = 0; i < 6; i++) {
      checkID += Number.parseInt(Math.random() * 10);
    }
    var time = util.formatTime(new Date());
    db.collection("check").add({
      data: {
        _id: checkID,
        user: app.globalData.user,
        order: order,
        time: time,
        isFinished: false,
        isRated: false
      }
    });
    // res.data 包含该记录的数据
  },

  //刷新本地渲染信息
  updateLocal: function () {
    var that = this;
    that.setData({
      isOrdered: true,
      modalName: "purchaseDone"
    });
    app.globalData.isOrdered = true;
  },

  //显示购买弹窗
  purchase: function (options) {
    var that = this;
    var now = new Date();
    if (this.data.isAdmin == true) {
      currentFoodIndex = options.currentTarget.dataset.index;
      this.setData({
        modalName: "purchase"
      })
    } else if (now.getHours() < 8 || now.getHours() > 12) {
      wx.showModal({
        title: '很难受,你点不了餐了',
        content: '你点餐的时候超过服务时间了，难受吗？',
      })
      this.setData({
        outOfTime: true
      })
    } else {
      currentFoodIndex = options.currentTarget.dataset.index;
      this.setData({
        modalName: "purchase"
      })
    }

  },

  //隐藏弹窗
  hideModal(value) {
    this.setData({
      modalName: null,
      isBlur: false,
    });
  },

  //跳转至个人中心
  toSelf: function () {
    this.setData({
      modalName: null
    })
    wx.navigateTo({
      url: '../self/self',
    });
  },

  //下拉刷新
  onPullDownRefresh: function () {
    wx.reLaunch({
      url: '../index/index',
    })
  },

  payMoney: function(name,price,order_id){
    wx.navigateToMiniProgram({
      appId: 'wxd02fe3fa8e320487',
      path: 'pages/index/index',
      extraData: {
        'aid': '5985',
        'name': name,
        'pay_type': 'jsapi',
        'price': price,
        'order_id': order_id,
        'notify_url': 'https://abc.com/notify',
        'sign': md5.md5(name + 'jsapi' + price + order_id + 'https://abc.com/notify' + '12438e8779c241079b651babc2139760'),
      },
      fail(res) {
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
        });
      },
      success(res) {
        wx.showToast({
          title: '跳转成功',
          icon: 'none',
        });
      },
    });
  },
  pay2: function(){
    var name = "MohaElder169"
    var appSecret = "12438e8779c241079b651babc2139760";
    var price = '0.2';
    var order_id = "esesvesvsvwdadwdvevesaevavavawvwac";
    wx.request({
      url: 'https://xorpay.com/api/cashier/5985',
      data:{
        name:name,
        pay_type: 'jsapi',
        price: price,
        order_id: order_id,
        notify_url: 'https://abc.com/notify',
        sign: md5.md5(name + 'jsapi' + price + order_id + 'https://abc.com/notify' + '12438e8779c241079b651babc2139760'),
      },
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },  
      success(res) {
        console.log(res)
      },
      fail(res){
        console.log("Failed!")
        console.log(res)
      }
    })
  }


});