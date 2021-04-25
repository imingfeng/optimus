import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

import LoadIcon from './LoadIcon';

import styles from './ImageClipper.less';

export default class ImageClipper extends Component {
  state = {
    actionType: null,
    mouseStartX: 0,
    mouseStartY: 0,
    initMoveX: 0,
    initMoveY: 0,
    moveX: 0,
    moveY: 0,
    maxX: 0,
    maxY: 0,
    initClipWidth: this.props.initClipWidth,
    initClipHeight: this.props.initClipHeight,
    clipWidth: this.props.initClipWidth,
    clipHeight: this.props.initClipHeight,
    w_h: this.props.w_h || this.props.initClipWidth / this.props.initClipHeight,
    containerWidth: 0,
    containerHeight: 0,
    imgWidth: 0,
    imgHeight: 0,
    src: `${this.props.src}?x-oss-process=image/auto-orient,${this.props.auto_orient}`,
    initZoomX: 1,
    initZoomY: 1,
    zoomX: 1,
    zoomY: 1,
    target: null,
    clipSrc: '',
    clipData: '',
  };

  // componentWillReceiveProps (nextProps) {
  //   if (this.state.src !== nextProps.src) {
  //     this.setState({
  //       src: this.props.src,
  //     }, () => {
  //       this.setClipViewBoxImg()
  //     })
  //
  //   }
  // }

  componentDidMount() {
    window.addEventListener('resize', this.setClipViewBoxImg);
    window.addEventListener('mousemove', this.move.onMouseMove);
    window.addEventListener('mouseup', this.move.onMouseUp);
    // 加载图片
    const img = new Image();

    img.src = this.state.src;

    img.onload = loader => {
      // 加载的图片
      const target = loader.target || loader.path[0];
      // console.log(target)
      this.setState(
        {
          target,
        },
        () => {
          this.setClipViewBoxImg();
        }
      );
    };

    img.onerror = () => {
      this.props.onError();
    };
  }

  componentWillUnmount() {
    this.removeEvent();
  }
  // 重置裁剪位置
  onReset = () => {
    this.setClipViewBoxImg();
  };
  // 设置裁剪框配置
  setClipViewBoxImg = () => {
    const { imgContainer, clipBox, clipperContainer } = this;
    let {
      target,
      clipWidth,
      clipHeight,
      zoomX,
      zoomY,
      moveX,
      moveY,
      w_h,
      initClipWidth,
      initClipHeight,
      initZoomX,
      initZoomY,
    } = this.state;
    // console.log('xxxx' + clipBox)
    // console.log(clipWidth, clipHeight, zoomX, zoomY, moveX, moveY, w_h, initClipWidth, initClipHeight)
    // 图片本身宽高
    const naturalWidth = target.naturalWidth;
    const naturalHeight = target.naturalHeight;
    const imgNaturlWH = naturalWidth / naturalHeight;

    let { width } = imgContainer.getBoundingClientRect();
    let { height } = clipperContainer.getBoundingClientRect();
    let imgWidth = width;
    let imgHeight = width / imgNaturlWH;

    if (height < imgHeight) {
      // 图片不在放大
      (imgHeight = height), (imgWidth = imgHeight * imgNaturlWH);
      // 保持图片居中
      imgContainer.style.maxWidth = imgWidth + 'px';
    }

    if (initClipWidth === 'auto' && initClipHeight === 'auto') {
      if (imgNaturlWH < w_h) {
        clipWidth = (naturalWidth * 2) / 3;
        clipHeight = clipWidth / w_h;
      } else {
        clipHeight = (naturalHeight * 2) / 3;
        clipWidth = clipHeight * w_h;
      }
    } else {
      w_h = initClipWidth / initClipHeight;
    }
    // console.log(clipWidth, clipHeight)

    moveX = (naturalWidth - clipWidth) / 2;
    moveY = (naturalHeight - clipHeight) / 2;

    clipBox.style.marginLeft = imgContainer.offsetLeft + 'px';
    clipBox.style.marginTop = imgContainer.offsetTop + 'px';

    zoomX = naturalWidth / imgWidth;
    zoomY = naturalHeight / imgHeight;

    this.setState(
      {
        containerWidth: width,
        containerHeight: height,
        zoomX: zoomX,
        zoomY: zoomY,
        clipWidth: (clipWidth * initZoomX) / zoomX,
        clipHeight: (clipHeight * initZoomY) / zoomY,
        moveX: (moveX * initZoomX) / zoomX,
        moveY: (moveY * initZoomY) / zoomY,
        imgWidth,
        imgHeight,
        w_h: w_h,
      },
      () => {
        this.getClipData();
      }
    );
  };

  setClipRect = ({
    clipWidth = this.state.clipWidth,
    clipHeight = this.state.clipHeight,
    moveX = this.state.moveX,
    moveY = this.state.moveY,
    mouseStartX = this.state.mouseStartX,
    mouseStartY = this.state.mouseStartY,
  }) => {
    const { imgWidth, imgHeight } = this.state;
    const maxX = imgWidth - clipWidth;
    const maxY = imgHeight - clipHeight;

    if (moveY < 0) {
      moveY = 0;
    }
    if (moveX < 0) {
      moveX = 0;
    }
    if (moveY > maxY) {
      moveY = maxY;
    }
    if (moveX > maxX) {
      moveX = maxX;
    }
    if (clipWidth > imgWidth || clipHeight > imgHeight) {
      return;
    }

    this.setState(
      {
        clipWidth: Math.abs(clipWidth),
        clipHeight: Math.abs(clipHeight),
        moveX,
        moveY,
        mouseStartX,
        mouseStartY,
      },
      () => {
        this.getClipData();
      }
    );
  };

  // 计算坐标系
  computerCoordinate = ({ clientY, clientX, mouseStartX, mouseStartY }) => {
    const { moveY, moveX, actionType } = this.state;
    let y;
    let x;
    switch (actionType) {
      case 'ACTION_ALl':
        // 移动激活
        y = clientY - mouseStartY + moveY;
        x = clientX - mouseStartX + moveX;
        break;
      default:
        y = clientY - mouseStartY;
        x = clientX - mouseStartX;
        break;
    }
    return {
      x,
      y,
    };
  };

  // 操作移动事件
  move = {
    onMouseDown: (e, actionType) => {
      // 允许移动
      const { clientX, clientY } = e;
      this.setState({
        actionType: actionType,
        mouseStartX: clientX,
        mouseStartY: clientY,
      });
    },
    onMouseMove: e => {
      const {
        actionType,
        mouseStartX,
        mouseStartY,
        clipWidth,
        clipHeight,
        moveY,
        moveX,
        w_h,
      } = this.state;
      const { clientX, clientY } = e;
      const coordinate = this.computerCoordinate({ clientX, clientY, mouseStartX, mouseStartY });
      const x = coordinate.x;
      const y = coordinate.y;
      let width, height, _y, _x;
      _y = (x * 1) / w_h;
      _x = y * w_h;

      switch (actionType) {
        case 'ACTION_ALl': // 移动
          this.setClipRect({
            mouseStartX: clientX,
            mouseStartY: clientY,
            moveY: y,
            moveX: x,
          });
          break;
        case 'ACTION_EAST': // 左边
          width = clipWidth + x;
          height = (width * 1) / w_h;
          this.setClipRect({
            mouseStartX: clientX,
            mouseStartY: clientY,
            moveY: moveY - _y / 2,
            clipWidth: width,
            clipHeight: height,
          });
          break;
        case 'ACTION_WEST': // 右边
          width = clipWidth - x;
          height = (width * 1) / w_h;

          this.setClipRect({
            mouseStartX: clientX,
            mouseStartY: clientY,
            moveY: moveY + _y / 2,
            moveX: moveX + x,
            clipWidth: width,
            clipHeight: height,
          });
          break;
        case 'ACTION_SOUTH': // 下边
          height = clipHeight + y;
          width = height * w_h;
          this.setClipRect({
            mouseStartX: clientX,
            mouseStartY: clientY,
            moveX: moveX - _x / 2,
            clipWidth: width,
            clipHeight: height,
          });
          break;
        case 'ACTION_NORTH': // 上
          height = clipHeight - y;
          width = height * w_h;
          this.setClipRect({
            mouseStartX: clientX,
            mouseStartY: clientY,
            moveX: moveX + _x / 2,
            moveY: moveY + y,
            clipWidth: width,
            clipHeight: height,
          });
          break;
        case 'ACTION_NORTH_EAST': // 左上
          if (Math.abs(x) > Math.abs(y)) {
            width = clipWidth + x;
            height = (width * 1) / w_h;
            this.setClipRect({
              mouseStartX: clientX,
              mouseStartY: clientY,
              moveY: moveY - x / 2,
              clipWidth: width,
              clipHeight: height,
            });
          } else {
            height = clipHeight - y;
            width = height * w_h;
            this.setClipRect({
              mouseStartX: clientX,
              mouseStartY: clientY,
              moveY: moveY + y,
              clipWidth: width,
              clipHeight: height,
            });
          }

          break;
        case 'ACTION_NORTH_WEST': // 右上
          if (Math.abs(x) > Math.abs(y)) {
            width = clipWidth - x;
            height = (width * 1) / w_h;
            this.setClipRect({
              mouseStartX: clientX,
              mouseStartY: clientY,
              moveY: moveY + _y,
              moveX: moveX + x,
              clipWidth: width,
              clipHeight: height,
            });
          } else {
            height = clipHeight - y;
            width = height * w_h;
            this.setClipRect({
              mouseStartX: clientX,
              mouseStartY: clientY,
              moveY: moveY + y,
              moveX: moveX + _x,
              clipWidth: width,
              clipHeight: height,
            });
          }
          break;
        case 'ACTION_SOUTH_WEST': // 左下
          if (Math.abs(x) > Math.abs(y)) {
            width = clipWidth - x;
            height = (width * 1) / w_h;
            this.setClipRect({
              mouseStartX: clientX,
              mouseStartY: clientY,
              moveX: moveX + x,
              clipWidth: width,
              clipHeight: height,
            });
          } else {
            height = clipHeight + y;
            width = height * w_h;
            this.setClipRect({
              mouseStartX: clientX,
              mouseStartY: clientY,
              moveX: moveX - _x,
              clipWidth: width,
              clipHeight: height,
            });
          }
          break;
        case 'ACTION_SOUTH_EAST': // 右下
          if (Math.abs(x) > Math.abs(y)) {
            width = clipWidth + x;
            height = (width * 1) / w_h;
            this.setClipRect({
              mouseStartX: clientX,
              mouseStartY: clientY,
              clipWidth: width,
              clipHeight: height,
            });
          } else {
            height = clipHeight + y;
            width = height * w_h;
            this.setClipRect({
              mouseStartX: clientX,
              mouseStartY: clientY,
              clipWidth: width,
              clipHeight: height,
            });
          }
          break;
        default:
          break;
      }
    },
    onMouseUp: () => {
      // 关闭移动
      this.setState({ actionType: null });
    },
  };

  // 获取裁剪数据
  getClipData = () => {
    const { src, moveX, moveY, clipWidth, clipHeight, zoomX, zoomY } = this.state;
    const x = parseInt(moveX * zoomX, 10);
    const y = parseInt(moveY * zoomY, 10);
    const width = parseInt(clipWidth * zoomX, 10);
    const height = parseInt(clipHeight * zoomY, 10);
    this.setState({
      clipSrc: `${src}/crop,x_${x},y_${y},w_${width},h_${height}`,
      clipData: {
        x,
        y,
        width,
        height,
      },
    });
  };

  // 移除时间
  removeEvent = () => {
    window.removeEventListener('resize', this.setClipViewBoxImg);
    window.removeEventListener('mousemove', this.move.onMouseMove);
    window.removeEventListener('mouseup', this.move.onMouseUp);
  };

  // 关闭
  onClose = () => {
    this.removeEvent();
    this.props.onCancel();
  };

  // 确认
  onOk = () => {
    this.removeEvent();
    const { clipSrc, clipData, src } = this.state;
    this.props.onOk({ clipData, clipSrc, src });
  };

  render() {
    const { moveX, moveY, clipWidth, clipHeight, src, imgWidth, imgHeight, target } = this.state;
    const { okText, resetText } = this.props;

    return (
      <div ref={node => (this.clipperContainer = node)} className={styles.ImageClipperContainer}>
        {target ? (
          <div>
            <div ref={node => (this.imgContainer = node)} className={styles.imgContainer}>
              <img
                style={{
                  width: imgWidth + 'px',
                  height: imgHeight + 'px',
                }}
                alt="clippic"
                src={src}
              />
            </div>
            <div className={styles.mark}></div>
            <div className={styles.clipBoxContainer}>
              <div
                ref={node => (this.clipBox = node)}
                style={{
                  transform: `translate(${moveX}px, ${moveY}px)`,
                  width: `${clipWidth}px`,
                  height: `${clipHeight}px`,
                }}
                className={styles.clipBox}
              >
                <div className={styles.clipViewBox}>
                  <img
                    style={{
                      transform: `translate(${-moveX}px, ${-moveY}px)`,
                      width: imgWidth + 'px',
                      height: imgHeight + 'px',
                    }}
                    alt="clippic"
                    src={src}
                  />
                </div>
                <div className={styles.clipDashedH}></div>
                <div className={styles.clipDashedV}></div>
                <div
                  onMouseDown={e => {
                    e.persist();
                    this.move.onMouseDown(e, 'ACTION_ALl');
                  }}
                  className={styles.clipMove}
                ></div>
                <div
                  onMouseDown={e => {
                    e.persist();
                    this.move.onMouseDown(e, 'ACTION_EAST');
                  }}
                  className={styles.clipLineE}
                ></div>
                <div
                  onMouseDown={e => {
                    e.persist();
                    this.move.onMouseDown(e, 'ACTION_NORTH');
                  }}
                  className={styles.clipLineN}
                ></div>
                <div
                  onMouseDown={e => {
                    e.persist();
                    this.move.onMouseDown(e, 'ACTION_WEST');
                  }}
                  className={styles.clipLineW}
                ></div>
                <div
                  onMouseDown={e => {
                    e.persist();
                    this.move.onMouseDown(e, 'ACTION_SOUTH');
                  }}
                  className={styles.clipLineS}
                ></div>
                <div
                  onMouseDown={e => {
                    e.persist();
                    this.move.onMouseDown(e, 'ACTION_EAST');
                  }}
                  className={styles.clipPointE}
                ></div>
                <div
                  onMouseDown={e => {
                    e.persist();
                    this.move.onMouseDown(e, 'ACTION_NORTH');
                  }}
                  className={styles.clipPointN}
                ></div>
                <div
                  onMouseDown={e => {
                    e.persist();
                    this.move.onMouseDown(e, 'ACTION_WEST');
                  }}
                  className={styles.clipPointW}
                ></div>
                <div
                  onMouseDown={e => {
                    e.persist();
                    this.move.onMouseDown(e, 'ACTION_SOUTH');
                  }}
                  className={styles.clipPointS}
                ></div>
                <div
                  onMouseDown={e => {
                    e.persist();
                    this.move.onMouseDown(e, 'ACTION_NORTH_EAST');
                  }}
                  className={styles.clipPointNE}
                ></div>
                <div
                  onMouseDown={e => {
                    e.persist();
                    this.move.onMouseDown(e, 'ACTION_NORTH_WEST');
                  }}
                  className={styles.clipPointNW}
                ></div>
                <div
                  onMouseDown={e => {
                    e.persist();
                    this.move.onMouseDown(e, 'ACTION_SOUTH_WEST');
                  }}
                  className={styles.clipPointSW}
                ></div>
                <div
                  onMouseDown={e => {
                    e.persist();
                    this.move.onMouseDown(e, 'ACTION_SOUTH_EAST');
                  }}
                  className={styles.clipPointSE}
                ></div>
              </div>
            </div>
            <div className={styles.btnGroup}>
              <Button onClick={this.onReset} size="large">
                {resetText}
              </Button>
              <Button onClick={this.onOk} size="large" type="primary">
                {okText}
              </Button>
              {/* <div onClick={this.onReset} className={styles.clipBtn}>
              重置
            </div>
            <div onClick={this.onOk} className={styles.clipBtn}>
              确认
            </div> */}
            </div>
          </div>
        ) : (
          <LoadIcon />
        )}
        <div onClick={this.onClose} className={styles.closeBtn}></div>
      </div>
    );
  }
}

ImageClipper.defaultProps = {
  src: 'http://zyp-farm-2.oss-ap-southeast-1.aliyuncs.com/data/farm/head/1533032455399.jpg',
  initClipWidth: 'auto',
  initClipHeight: 'auto',
  auto_orient: 1,
  w_h: 16 / 9,
  onCancel: () => {
    console.log('onCancel');
  },
  onOk: () => {
    console.log('onOk');
  },
  onError: () => {
    // 图片加载失败
    console.log('图片加载失败');
  },
};

ImageClipper.propTypes = {
  src: PropTypes.string.isRequired,
  auto_orient: PropTypes.number,
  initClipWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
  initClipHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
  w_h: PropTypes.number,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  onError: PropTypes.func,
};
