# 这是一个极简的小程序图片剪裁工具
### 使用方法：copy tool 和 cropper文件夹下的内容
### 关于background-image 支持本地临时图片的问题：[小程序官方架构不支持](https://developers.weixin.qq.com/community/develop/doc/000ca400300ff8169ea7bb4005b800)
> background-iamge目前支持情况：android和模拟器都支持，ios不支持
### 线上预览
> 代码片段地址[https://developers.weixin.qq.com/s/ROawJwmr706s](https://developers.weixin.qq.com/s/ROawJwmr706s)
> 搜索小程序：链上抽奖，进入新建素材部分

### 实现思路
采用movable-area + movable-view两个原生组件加上box-shadow实现

![Image text](https://horizon-mall-test.oss-cn-hzfinance.aliyuncs.com/lottery-mini-test/155133658370951558.png)
```
  <!-- @important fixed ios background-image不支持临时图片路径 -->
  <image src="{{src}}"  style="height: {{height}}px; width: {{width}}px;" wx:if="{{src}}"></image>
  <movable-area 
  class="img"
  style="height: {{height}}px; width: {{width}}px;">
  <!-- 剪裁框 -->
    <movable-view
      class="cut-cover"
      direction="all"
      damping="40"
      friction="0.1"
      style="width: {{widthRpx}}rpx; height: {{heightRpx}}rpx"
      bindchange="move"
      bindtouchend='moveEnd'
      bindtouchstart='moveStart'
    >
    
    </movable-view>
    
  </movable-area>
```



