// src/pages/cutImage/index.js
const regeneratorRuntime = require('../tool/regenerator-runtime')
import img from '../tool/image'
const screenW = wx.getSystemInfoSync().windowWidth
const screenH = wx.getSystemInfoSync().windowHeight

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // test for canvas & image
    //剪裁框的大小
    widthRpx: 360 * 2,
    heightRpx: 160 * 2, 
    src: null,// 初始图片路径
    width: null,// 图片宽度，剪裁框可移动的宽度范围
    height: null,// 图片高度，剪裁框可移动的高度范围
    coverWidth: null,//剪裁框 宽度px
    coverHeight: null,
    direction: 'vertical',// 图片方向
    w: screenW,//屏幕宽度
    h: screenH, //屏幕高度
    imgInfo: null, //图片信息
    startX: null, // 移动的开始位置
    startY: null, 
    endX: null, // 移动的结束位置
    endY: null,
    cutX: null, // 剪裁的开始位置
    cutY: null,
    ctx: null,
    // 初始位置
    left: null,
    top: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 一般从上级页面传图
    this.setData({
      src: 'https://horizon-mall-test.oss-cn-hzfinance.aliyuncs.com/lottery-mini-test/155126193241566843.jpeg',
      ctx: wx.createCanvasContext('myCanvas'),
    })
  },  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.initCover(() => {
      this.init()
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 初始化 移动即图片展示大小
  init: async function () {
    
    const imgInfo = await img.getInfo(this.data.src)

    // 框宽高
    const isNormal = imgInfo.height > imgInfo.width
    const radio = imgInfo.width / imgInfo.height
    
    const width = isNormal ? this.data.coverWidth  : this.data.w 
    const height = !isNormal ? this.data.w / radio  : this.data.coverWidth / radio 
    console.log((width - this.data.coverWidth) / 2, (height - this.data.coverHeight) / 2 )
    this.setData({
      width,
      height,
      direction: isNormal ? 'vertical' : 'horizontal',
      imgInfo,
      
    })

  },
  move(e) {
    // there we get x, y
  },
  moveEnd(e) {
    this.setData({
      endX: e.changedTouches[0].pageX,
      endY: e.changedTouches[0].pageY
    })
  },
  moveStart(e) {
    this.setData({
      startX: e.changedTouches[0].pageX,
      startY: e.changedTouches[0].pageY
    })
  },
  /**
   * 一般为图片上传，这里为了方便展示选择图片预览
   */
  uploadImage: function () {
    
    // 拿到移动距离
    const moveX = this.data.endX - this.data.startX;
    const moveY = this.data.endY - this.data.startY;
    /**
     * 通过moveX， moveY和cutX，cutY去定位canvas的画图位置
     */
    
    this.initCover(  () => {
      wx.createSelectorQuery().select('.img').boundingClientRect( async ({ height, width, left, top }) => {
        console.log(this.data.left - left, this.data.top - top, left, top, 'init2')
       
        const file = await img.draw({
          imgInfo: this.data.imgInfo,
          startX: this.data.left - left,
          startY: this.data.top - top ,
          width: this.data.width,
          height: this.data.height,
          ctx: this.data.ctx,
          canvasId: 'myCanvas',
          coverWidth: this.data.coverWidth,
          coverHeight: this.data.coverHeight,
          self: this,
          width: this.data.width,
          height: this.data.height
        })
        // const data = await img.upload(file.data)
        // 改成预览
        img.preview(file.data)
      }).exec(0)
      
    })
    
  },
  //更换图片
  chooseImage: async function () {
    const {src} = await img.choose();
    this.setData({
      src: src,
    },() => {
      this.initCover(() => {
        this.init()
      })
      // 
    })
    
  },
  // 初始获取剪裁框的初始数据，宽高位置等
  initCover(cb) {
    wx.createSelectorQuery().select('.cut-cover').boundingClientRect(({height, width,left, top}) => {
      console.log(width, height, left, top,'init')
      this.setData({
        coverWidth: width,
        coverHeight: height,
        left,
        top,
        cutX: (this.data.width - width) / 2,
        cutY: (this.data.height - height) / 2
      }, () => {
        cb && cb()
      })
    }).exec()
  }
})
