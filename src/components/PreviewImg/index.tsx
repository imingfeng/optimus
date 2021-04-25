import React, { useState, useEffect, useRef } from 'react'
import { Modal, message } from 'antd'
import { UndoOutlined, RedoOutlined } from '@ant-design/icons';
import { source }  from '@/config'
import classNames from 'classnames';
import _ from 'lodash'
import { customSizeImg } from '@/utils'
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons"
import ImageMagnifier from "@/components/ImageMagnifier/index";
import styles from './index.less'

/**
 * const previewProps = {
    previewImage: string, // 图片地址
    previewVisible: boolean, // 是否显示大图
    handleHidePreview: Function // 隐藏大图的方法
  }
 * <PreviewImg {...previewProps} />
 * **/

// let rotate = 0  // 旋转角度

interface Iprops {
  previewTitle: string
  previewImgs: any[]
  previewVisible: boolean
  previewImage: string
  handleHidePreview: (val: boolean) => void;
  imgSrc?: string
  tag?: string
}

const PreviewImg = (props: Iprops) => {
  const imgRef: any = useRef();
  const imgSlideBox: any = useRef();
  const thumbnailRef: any = useRef();
  const { previewImage, previewVisible, handleHidePreview, previewImgs, previewTitle, tag } = props
  const [imgTitle, setImgTitle] = useState(props.previewTitle)
  const [imgSrc, setImgSrc] = useState('');
  const [tagName, setTagName] = useState(props.tag)
  const [previewImgsArr, setPreviewImgsArr]:any = useState([])
  const [visible, setVisible] = useState(false);
  const [rotate, setRotate] = useState(0)
  const [SS, setSS] = useState(1);
  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);
  const [preSelectedNum, setPreSelectedNum] = useState(0);

  useEffect(() => {
    setVisible(previewVisible);
    // 清除上次的地址
    if (!previewVisible) {
      setImgSrc('');
    } else {
      setImgSrc(previewImage);
      setImgTitle(previewTitle)
      setTagName(tag)
      if (previewImgsArr && previewImgsArr.length) {
        previewImgsArr.map((item: any) => {
          item.selected = false
          if(item.title === previewTitle) {
            item.selected = true
          }
        })
        setPreviewImgsArr(previewImgsArr)
      }
    }
  }, [previewVisible]);

  useEffect(() => {
    previewVisible && setTimeout(() => {
      scrollCurrentSlide(previewImgsArr)
    }, 0)
  }, [previewImgsArr])

  useEffect(() => {
    setPreviewImgsArr(previewImgs)
  }, [previewImgs])

  useEffect(() => {
    setImgTitle(previewTitle)
  }, [previewTitle])

  // 监听键盘左右切换和esc
  document.onkeydown = (e) => {
    let event = e || window.event;
    if (event.keyCode === 27) {
      handleCloseImg()
    }
    if(previewVisible) {
      if(event.keyCode === 37) {
        handleSlideImg(1)
      }
      if(event.keyCode === 39) {
        handleSlideImg(2)
      }
    }
  }
  //图片跟随滚动条滚动
  const scrollCurrentSlide = (imgArr: any) => {
    const indexNum = _.findIndex(imgArr, function (o: any) { return o.selected === true; });
    const result = preSelectedNum - indexNum;
    //可视区域内不滚动
    // if (result < 7  && result > 0 && result !== 1 ) return;
    const x = 108 * indexNum;
    const thumbnailWidth = imgArr.length * 108;
    if (! thumbnailRef.current) return;

    thumbnailRef.current.style.width = thumbnailWidth + 'px';
    if (!imgSlideBox.current.scrollTo) {
      imgSlideBox.current.scrollLeft = x;
    }
    else{
      imgSlideBox.current.scrollTo(x, 0);
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

  //图片放大
  const handleEnlarge = () => {
    if(SS < 10) {
      setSS(SS + 0.25);
      imgRef.current.style.transform = 'rotate(' + rotate + 'deg) scale(' + (SS + 0.25) + ',' + (SS + 0.25) + ')'
    }else{
      message.warning('不能再放大了！');
    }
  }
  //图片缩小
  const handleShrink = () => {
    if(SS > 1) {
      setSS(SS - 0.25);
      imgRef.current.style.transform = 'rotate(' + rotate + 'deg) scale(' + (SS - 0.25) + ',' + (SS - 0.25) + ')'
    }else{
      message.warning('不能再缩小了！');
    }
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

  const handlePreview = () => {
    handleHidePreview(false)
    setTimeout(() => {
      setRotate(0)
      imgRef.current.style.transform = `rotate(0)`
    }, 500)
  }

  const handleCloseImg = () => {
    handleHidePreview(false)
    setImgTitle('')
    resetRotate('')
    setPreSelectedNum(0)
  }

  const handleClickThumbnail = (item: any) => {
    if (imgSrc === item.url) {
      return
    }

    const _previewImgs = _.cloneDeep(previewImgsArr)

    resetRotate('')
    setTagName(item.tag)
    setImgSrc(item.url)
    setImgTitle(item.title)
    let index = _.findIndex(previewImgsArr, function (item: any) { return item.selected === true })
    //储存上一次选中的图片index
    setPreSelectedNum(index)
    _previewImgs.map((img: any) => {
      img.selected = false
      if (img.url === item.url && img.title === item.title) {
        img.selected = true
      }
    })
    setPreviewImgsArr(_.cloneDeep(_previewImgs))
  }

  const handleSlideImg = (type: number) => {

    let index = _.findIndex(previewImgsArr, function(item: any) { return item.selected === true })

    if ((index === 0 && type === 1) || (index === previewImgsArr.length - 1 && type === 2)) {
      return
    }
    resetRotate('')
    //储存上一次选中的图片index
    setPreSelectedNum(index)
    let _previewImgs = previewImgsArr.map((item: any) => {
      return {
        ...item,
        selected: false
      }
    })
    if(type === 1) {
      let i = index > 0 ? (index - 1) : 0
      setImgSrc(_previewImgs[i].url)
      _previewImgs[i].selected = true
      setImgTitle(_previewImgs[i].title)
      setTagName(_previewImgs[i].tag)
    } else {
      let i = (index + 1 < _previewImgs.length) ? (index + 1) : (_previewImgs.length - 1)
      setImgSrc(_previewImgs[i].url)
      _previewImgs[i].selected = true
      setImgTitle(_previewImgs[i].title)
      setTagName(_previewImgs[i].tag)
    }

    setPreviewImgsArr(_.cloneDeep(_previewImgs))
  }

  const footerNode = (
    <div className={styles.imgOperation}>

    </div>
  )

  const modalProps = {
    wrapClassName: 'previewImgBox',
    visible,
    width: '100%',
    onCancel: handlePreview,
    centered: true,
    footer: null
  }

  return (
    <Modal {...modalProps}>
      <div className="modalBox">
        <div className="box">
          <img className="close" src={source.imgClose} onClick={handleCloseImg} />
          <div className="imgBox">
            {/* <ImageMagnifier ref={imgRef} minImg={imgSrc} maxImg={imgSrc} /> */}
            <img
              id="previewImg"
              ref={imgRef}
              className="previewImg"
              src={imgSrc}
              onMouseDown={(e) => handleMoveImg(e)}
              alt=""
              style={{ left: X + 'px', top: Y + 'px', position: 'relative', cursor: 'move' }}
            />
            <div className="top">
              <p className="name">
              { tagName && <p className="tagName">{tagName}</p> }
                {imgTitle}
              </p>
              <p className="oper">
                <span className="enlarge">
                  <img className="enlarge icon" src={source.iconEnlarge} onClick={() => handleEnlarge()} />
                </span>
                <span className="proportion"> {(SS * 100)+ '%'} </span>
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
                  <img className="reset icon" src={source.iconReset} onClick={() => resetRotate(imgSrc)} />
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
                          className={classNames("imgSection", { selected: item.selected })}
                          style={{ backgroundImage: `url(${item.notCustomSize ? item.url : customSizeImg(item.url, 'w_90')})` }}
                          onClick={() => handleClickThumbnail(item)}
                          key={index}
                        >
                          {/* <img src={customSizeImg(item.url, 'h_80')} alt={item.bizTypeStr} onClick={() => handleClickThumbnail(item)} /> */}
                        </div>
                      )
                    })
                  }
                </div>
                {/* <span className="thumbnailPrev">
                  <img className="thumIcon thumLeft" src={source.iconThumLeft} onClick={() => handleSlideImg(1)} />
                </span>
                <span className="thumbnailNext">
                  <img className="thumIcon thumRight" src={source.iconThumRight} onClick={() => handleSlideImg(1)} />
                </span> */}
              </div>
            )
          }
        </div>
      </div>
    </Modal>
  )
}

export default PreviewImg;
