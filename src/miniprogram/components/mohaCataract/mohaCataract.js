// components/mohaCataract/mohaCataract.js
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    windowHeight: {
      type: Number,
      value: 0
    },
    eventList: {
      type: Object,
      value: [
        {
          coverPic: "https://7363-scrooge-169-1300052845.tcb.qcloud.la/eventPics/moha426713coverPic.png"
        },
        {
          coverPic: "https://7363-scrooge-169-1300052845.tcb.qcloud.la/eventPics/moha426713coverPic.png"
        },
        {
          coverPic: "https://7363-scrooge-169-1300052845.tcb.qcloud.la/eventPics/moha426713coverPic.png"
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
  }
})