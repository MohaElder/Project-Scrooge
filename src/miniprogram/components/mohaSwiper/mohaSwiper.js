Component({
  /**
   * 组件的属性列表
   */
  options:{
    multipleSlots:true
  },
  properties: {
    isMini:{
      type: Boolean,
      value: false
    },

    eventList: {
      type: Array,
      value: [
        {
          name:"TitleA",
          provider:"Jenn",
          coverPic:"https://wx1.sinaimg.cn/mw690/006tozhpgy1g5zenmgujyj31900u0e87.jpg",
          _id:"AAA",
          },
          {
            name:"TitleB",
            provider:"Yun",
            coverPic: "https://wx3.sinaimg.cn/mw690/006tozhpgy1g5zenkcwwzj31900u07wn.jpg",
            _id:"BBB"
          }
          ]
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
    navigate: function(e){
      this.triggerEvent('customevent', e.currentTarget.dataset.id)
    }
  }

})