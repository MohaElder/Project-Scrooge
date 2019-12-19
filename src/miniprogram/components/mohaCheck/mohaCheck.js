Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: String,
      value: "MohaElder"
    },

    id: {
      type: String,
      value: "mooa12345"
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