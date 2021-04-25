import React, { useState, useEffect, useRef } from 'react'
import { Modal, message } from 'antd'
import { source } from '@/config'
import classNames from 'classnames';
import _ from 'lodash'
import { customSizeImg } from '@/utils'
import styles from './index.less'


/**
 * const galleryProps = {
    imgData: [
      url: 'http://zyp-farm-2.oss-ap-southeast-1.aliyuncs.com/data/fc-bee/attach/1596006612722.jpg', //必传
      title: '道路图',   //不传时为空
      tag: '标签'       //不传时为空
    ], // 需要预览的图片数组
    showIndex?: number, // 默认显示第几张
  }
 * <PreviewImg {...previewProps} />
 * **/

interface Iprops {
  imgData: any[]
  showVisible: any
  showIndex?: number
}
//获取默认图片方法
const getCurrent = (imgUrls: any[], currentIndex = 0, type = 'src') => {
  let current = '';
  if (imgUrls && imgUrls.length) {
    let currentImgArr = imgUrls.filter((item: any, index: number) => (index === currentIndex))
    currentImgArr.map((item, index) => {
      switch (type) {
        case 'tag':
          current = item.tag || ''
          break;
        case 'title':
          current = item.title || ''
          break;
        default:
          current = item.url
          break;
      }
    })
  }
  return current;
}

const PhotoGallery = (props: Iprops) => {

  const imgRef: any = useRef();
  const imgSlideBox: any = useRef();
  const thumbnailRef: any = useRef();

  const { imgData, showIndex, showVisible } = props;

  const [previewImgsArr, setPreviewImgsArr]: any = useState([])
  const [ currentImg, setCurrentImg] = useState('');//当前图片
  const [ currentTagName, setCurrentTagName] = useState('');
  const [ currentTitle, setCurrentTitle] = useState('');
  const [currentIndex, setCurrentIndex]:any = useState(0);//当前图片索引
  const [visible, setVisible]: any = useState(false);
  const [rotate, setRotate] = useState(0)
  const [SS, setSS] = useState(1);
  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);


  const defaultImg = getCurrent(imgData, showIndex);
  const defaultTag = getCurrent(imgData, showIndex, 'tag');
  const defaultTit = getCurrent(imgData, showIndex, 'title');

  useEffect(() => {
    showVisible && setVisible(Symbol(''))
  }, [showVisible])

  useEffect(() => {
    // 清除上次的地址
    if (!visible) {
      setCurrentImg('');
    } else {
      setCurrentImg(defaultImg);
      setCurrentTitle(defaultTit)
      setCurrentTagName(defaultTag)
      setCurrentIndex(showIndex || 0)
      if (previewImgsArr && previewImgsArr.length) {
        previewImgsArr.map((item: any, index: number) => {
          item.selected = false
          if (index === showIndex) {
            item.selected = true
          }
        })
        setPreviewImgsArr(_.cloneDeep(previewImgsArr))
      }
    }
  }, [visible]);

  useEffect(() => {
    imgData.map((item: any, index: number) => {
      item.selected = false
      if (index === showIndex) {
        item.selected = true
      }
    })
    setPreviewImgsArr(_.cloneDeep(imgData))
  }, [imgData])

  useEffect(() => {
    setCurrentImg(defaultImg)
    setCurrentTagName(defaultTag)
    setCurrentTitle(defaultTit)
    setCurrentIndex(showIndex || 0)
  }, [])

  // 监听键盘左右切换和esc
  document.onkeydown = (e) => {
    let event = e || window.event;
    if (event.keyCode === 27) {
      handleHideShow()
    }
    if (visible) {
      if (event.keyCode === 37) {
        handleSlideImg(1)
      }
      if (event.keyCode === 39) {
        handleSlideImg(2)
      }
    }
  }
  //图片预览弹窗隐藏
  const handleHideShow = () => {
    setVisible(false)
    setCurrentTitle('')
    resetRotate('')
  }

  //图片拖拽
  const handleMoveImg = (ev: any) => {
    ev.preventDefault()
    //获取拖拽坐标点并赋值
    let disx = ev.pageX - X

    let disy = ev.pageY - Y

    document.onmousemove = (ev: any) => {
      setX(ev.pageX - disx)
      setY(ev.pageY - disy)
    }
    //事件解绑
    document.onmouseup = () => {

      document.onmousemove = null

      document.onmousedown = null

    }
  }

  //图片放大
  const handleEnlarge = () => {
    if (SS < 10) {
      setSS(SS + 0.25);
      imgRef.current.style.transform = 'rotate(' + rotate + 'deg) scale(' + (SS + 0.25) + ',' + (SS + 0.25) + ')'
    } else {
      message.warning('不能再放大了！');
    }
  }

  //图片缩小
  const handleShrink = () => {
    if (SS > 1) {
      setSS(SS - 0.25);
      imgRef.current.style.transform = 'rotate(' + rotate + 'deg) scale(' + (SS - 0.25) + ',' + (SS - 0.25) + ')'
    } else {
      message.warning('不能再缩小了！');
    }
  }

  // 旋转图片
  const handleRotate = (type: number) => {
    if (type === 1) {
      setRotate((rotate - 90) % 360)
      imgRef.current.style.transform = 'rotate(' + (rotate - 90) + 'deg) scale(' + SS + ',' + SS + ')'
    } else {
      setRotate((rotate + 90) % 360)
      imgRef.current.style.transform = 'rotate(' + (rotate + 90) + 'deg) scale(' + SS + ',' + SS + ')'
    }
  }

  // 重置旋转角度
  const resetRotate = (imgSrc: any) => {
    setRotate(0)
    setSS(1)
    setX(0)
    setY(0)
    imgRef.current.src = imgSrc;
    imgRef.current.style.transform = `rotate(0) scale(1,1)`
  }
  //左右切换
  const handleSlideImg = (type: number) => {

    if ((currentIndex === 0 && type === 1) || (currentIndex === previewImgsArr.length - 1 && type === 2)) {
      return
    }
    resetRotate('')

    let _previewImgs = previewImgsArr.map((item: any) => {
      return {
        ...item,
        selected: false
      }
    })
    if (type === 1) {
      let i = currentIndex > 0 ? (currentIndex - 1) : 0
      setCurrentIndex(i)
      setCurrentImg(_previewImgs[i].url)
      _previewImgs[i].selected = true
      setCurrentTitle(_previewImgs[i].title || '')
      setCurrentTagName(_previewImgs[i].tag || '')
    } else {
      let i = (currentIndex + 1 < _previewImgs.length) ? (currentIndex + 1) : (_previewImgs.length - 1)
      setCurrentIndex(i)
      setCurrentImg(_previewImgs[i].url)
      _previewImgs[i].selected = true
      setCurrentTitle(_previewImgs[i].title || '')
      setCurrentTagName(_previewImgs[i].tag || '')
    }

    setPreviewImgsArr(_.cloneDeep(_previewImgs))
  }

  const handleClickThumbnail = (item: any) => {
    if (currentImg === item.url) {
      return
    }

    const _previewImgs = _.cloneDeep(previewImgsArr)

    resetRotate('')
    setCurrentTagName(item.tag || '')
    setCurrentImg(item.url)
    setCurrentTitle(item.title || '')

    _previewImgs.map((img: any) => {
      img.selected = false
      if (img.url === item.url && img.title === item.title) {
        img.selected = true
      }
    })
    let index = _.findIndex(_previewImgs, function (item: any) { return item.selected === true })
    setCurrentIndex(index)
    setPreviewImgsArr(_.cloneDeep(_previewImgs))
  }


  const modalProps = {
    wrapClassName: 'photoGalleryBox',
    visible,
    width: '100%',
    onCancel: handleHideShow,
    centered: true,
    footer: null
  }
  const footerNode = (
    <div className={styles.imgOperation}>

    </div>
  )

  return (
    <>
        <Modal {...modalProps}>
          <div className="modalBox">
            <div className="box">
              <img className="close" src={source.imgClose} onClick={handleHideShow} />
              <div className="imgBox">
                <img
                  id="previewImg"
                  ref={imgRef}
                  className="previewImg"
                  src={currentImg}
                  onMouseDown={(e) => handleMoveImg(e)}
                  alt=""
                  style={{ left: X + 'px', top: Y + 'px', position: 'relative', cursor: 'move' }}
                />
                <div className="top">
                  <p className="name">
                    {currentTagName !=='' && <p className="tagName">{currentTagName}</p>}
                    {currentTitle}
                  </p>
                  <p className="oper">
                    <span className="enlarge">
                      <img className="enlarge icon" src={source.iconEnlarge} onClick={() => handleEnlarge()} />
                    </span>
                    <span className="proportion"> {(SS * 100) + '%'} </span>
                    <span className="shrink">
                      <img className="narrow icon" src={source.iconShrink} onClick={() => handleShrink()} />
                    </span>
                    <span className="redo">
                      <img className="undo icon" src={source.iconUndo} onClick={() => handleRotate(1)} />
                    </span>
                    <span className="undo">
                      <img className="redo icon" src={source.iconRedo} onClick={() => handleRotate(2)} />
                    </span>
                    <span className="reset">
                      <img className="reset icon" src={source.iconReset} onClick={() => resetRotate(currentImg)} />
                    </span>
                  </p>
                </div>
              </div>
              {
                previewImgsArr && previewImgsArr.length > 0 &&
                (
                  <>
                    <img className="dercIcon left" src={source.arrowLeft} onClick={() => handleSlideImg(1)} />
                    <img className="dercIcon right" src={source.arrowRight} onClick={() => handleSlideImg(2)} />
                  </>
                )
              }
              {
                previewImgsArr && previewImgsArr.length > 0 && (
                  <div className="imgOperation" ref={imgSlideBox}>
                    <div className="thumbnailBox" ref={thumbnailRef}>
                      {
                        previewImgsArr.map((item: any, index: number) => {
                          return (
                            <div
                              className={classNames("imgSection", { selected: index === currentIndex ? true : false })}
                              style={{ backgroundImage: `url(${item.notCustomSize ? item.url : customSizeImg(item.url, 'w_90')})` }}
                              onClick={() => handleClickThumbnail(item)}
                              key={index}
                            >
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </Modal>
    </>
  )
}

export default PhotoGallery;
