const regeneratorRuntime = require('./regenerator-runtime')// async await
let img = {};
let uploadServer//上传图片地址
// 选择图片
img.choose = () => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: 1,
      // 选取原图
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const limit = 5 * 1024 * 1024
        // 限制图片大小
        if (res.tempFiles[0].size > limit) {
          wx.showToast({
            icon: 'none',
            title: '图片大小不能超过5M',
          })
          reject('图片过大')
        }else {
          resolve(
            {
              src: res.tempFilePaths[0],
              size: res.tempFiles[0].size
            })
        }
        
      },
      fail: (e) => {
        reject(e)
      }
    })
  })

};


// 读取图片信息
img.getInfo = (src) => {

  return new Promise( (resolve, reject) => {
    wx.getImageInfo({
      src,
      success: (res) => {
        // todo 横屏照片处理
        resolve(res)
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

// 画图生成剪裁图片

img.draw = (options) => {
  return new Promise( (resolve, reject) => {
 
    const { imgInfo,width,height, coverWidth, coverHeight, startX, startY, canvasId, self} = options
    
    let ctx = wx.createCanvasContext(canvasId, self)
    const drawConfig = {
      sx: 0,
      sy: 0,
      sWidth: width ,
      sHeight: height
    }
    console.log(options,  drawConfig)
    ctx.clearRect(0,0,coverWidth, coverHeight)
    

    ctx.drawImage(imgInfo.path, 0,0,width * 2 ,height *2 );
    ctx.draw(true, setTimeout(() =>  {
      // 生成临时路径
      let opt = {
        x: startX * 2 ,
        y: startY * 2,
        width: coverWidth * 2 ,
        height: coverHeight * 2 ,
        destWidth: coverWidth * 2 ,
        destHeight: coverHeight * 2
      }
      console.log(opt, startX,)
      wx.canvasToTempFilePath({
        ...opt,
        quality: 0.8,
        canvasId: canvasId,
        success(res) {
          console.log('临时路径', res)
          resolve({
            data: res.tempFilePath,
            msg: '成功'
          })

        },
        fail() {
          // console.log(3332)
          resolve({
            data: null,
            msg: '导出canvas失败'
          })
        }
      },self)
    }, 200))
    
  })
} 

// rewrite upload api
function uploadFile(filePath) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: uploadServer,
      name: 'file',
      filePath,
      success(res) {
        resolve({
          res,
          msg: '上传成功'
        })
      },
      fail(e) {
        resolve({
          res: null,
          msg: '上传失败'
        })
      }
    })
  })
}

// 图片上传
img.upload = async (src, size=0) => {
  wx.showLoading({
    title: '上传中...',
    mask: true
  })
  let filePath = await img.compress(src, size)
  const fileRes = await uploadFile(filePath)
  wx.hideLoading()
  let data = JSON.parse(fileRes.res.data)
  return data
}

// 生成预览图片 
img.preview = (src) => {
  wx.previewImage({
    urls: [src]
  })
}

img.compress = (src, size) => {
  // 如果图片超过3M压缩多一点
  const quality = size > 3 * 1024 * 1024 ? 50 : 80
  return new Promise((resolve, reject) => {
    wx.compressImage({
      src, // 图片路径
      quality, // 压缩质量,
      success: (res) => {
        // console.log('compress success')
        resolve(res.tempFilePath)
      },
      fail: (e) => {
        // console.log('compress failed')
        resolve(src)
      }

    })
  })
}

export default img;