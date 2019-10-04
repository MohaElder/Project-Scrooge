Component({
  options:{
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    event: {
      type: Object,
      value: 
      {
        name:"Event Title",
        imageUrl: "https://wx1.sinaimg.cn/mw690/006tozhpgy1g5zenmgujyj31900u0e87.jpg",
        date: "2019/9/27",
        location:"Luoxiu Rd.",
        price: "30.00",
        provider: "More Club",
        _id: "moha88888"
      }
    },

    price: {
      type: Number,
      value: 15
    },

    time: {
      type: String,
      value: "2001/09/27"
    },

    status: {
      type: String,
      value: "Pending"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigate: function (e) {
      this.triggerEvent('customevent', e.currentTarget.dataset.id)
    }
  }

})