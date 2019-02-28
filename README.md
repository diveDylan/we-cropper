这是一个小程序图片剪裁的工具使用方法，copy tool 和 cropper文件夹

采用movable-area + movable-view两个原生组件加上box-shadow实现

![Image text]()
```
<movable-area 
    class="img"
    style="height: {{height}}px; width: {{width}}px; background-image: url({{src}}); background-size: {{width}}px {{height}}px ">
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
