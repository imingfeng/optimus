import React, { Component } from 'react'
import { Upload, Modal, message } from 'antd';
// import ImageClipper from 'react-image-clipper';
import { ImageClipper, PreviewImg } from '@/components';
import _ from 'lodash';
import { icon } from '@/config';
/**
 * 照片墙组件
 * @props action 接口api
 * @props limit 允许上传数量
 * @props fileList
 * 回显数据格式： [{
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }]
 * @props other config in antd  https://ant.design/components/upload-cn/
 */
interface IProps {
  isPreview: boolean;
  limit: number;
  fileList: [];
  uploadButtonStyle: object;
  uploadText: string;
  onRemove: any;
}

interface IState {
  previewVisible: boolean;
  previewImage: string;
  fileList: any;
  clipSrc: any;
  clipVisible: boolean;
  limit: number;
  activeFile: any;
}

type C = {
  fileList: [];
};

export default class PicturesWallClipper extends Component<IProps, IState> {
  state: IState = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    limit: 1,
    clipSrc: null,
    clipVisible: false,
    activeFile: null,
  };

  constructor(props: any) {
    super(props);
    this.state.limit = props.limit;
    this.state.fileList = props.fileList;
  }

  UNSAFE_componentWillReceiveProps({ fileList }: C) {
    if (fileList !== this.props.fileList) {
      this.setState({
        fileList
      })
    }
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file: any) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = (options: any) => {
    const { fileList, file, event } = options

    if (file.status === 'done') {
      if (typeof file.response.content !== 'string') {
        file.response.content = file.response.content.url;
        const index = _.findIndex(fileList, (o) => {
          return o.uid === file.uid;
        })
        fileList[index].response.content = file.response.content;
        fileList[index].thumbUrl = file.response.content;
      }
      this.setState({
        fileList: [...fileList],
        clipVisible: true,
        clipSrc: file.response.content,
        activeFile: file
      })

      // this.props.onChange && this.props.onChange(options);

    }
    this.setState({ fileList: [...fileList] });
    this.props.onChange && this.props.onChange(options);

  }
  handleImageClipperOk = (options: any) => {
    const { activeFile, fileList } = this.state
    const index = _.findIndex(fileList, (o: any) => {
      return o.response.content === activeFile.response.content;
    })
    fileList[index].response.content = options.clipSrc;
    fileList[index].thumbUrl = options.clipSrc;
    this.setState({
      clipVisible: false,
      fileList: [...fileList],
    }, () => {
      console.log(this.state.fileList)
      // this.upLoad.onChange(this.state.fileList[0])
    })

  }

  handleImageClipperCancel = () => {
    const { activeFile, fileList } = this.state

    this.setState({
      clipVisible: false,
      fileList: _.remove(fileList, (o: any) => {
        return o.response.content === activeFile.response.content;
      })
    }, () => {
      console.log(this.upLoad)
    })
    this.upLoad.handleManualRemove(activeFile)
  }

  render() {
    const { isPreview = false, limit = 1, uploadButtonStyle, uploadText = '上传', onRemove } = this.props;
    const { previewVisible, previewImage, fileList, clipVisible, clipSrc } = this.state;
    const uploadButton = (
      <div style={uploadButtonStyle} >
        {icon.plus}
        <div className="ant-upload-text" > {uploadText} </div>
      </div>
    );

    const previewProps: any = {
      previewImage,
      previewVisible,
      handleHidePreview: () => {
        this.setState({
          previewVisible: false
        })
      }
    }

    const imgCliperProps = {
      visible: clipVisible,
      src: clipSrc,
      w_h: 1,
      auto_orient: 1,
      onOk: this.handleImageClipperOk,
      onCancel: this.handleImageClipperCancel,

      // initClipWidth: 200,
      // initClipHeight: 100,
    }

    return (
      <div className="clearfix" >
        <Upload
          ref={node => this.upLoad = node}
          {...this.props}
          listType="picture-card"
          fileList={fileList}
          showUploadList={isPreview ? { showPreviewIcon: true, showRemoveIcon: false } : { showPreviewIcon: true, showRemoveIcon: true }
          }
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={onRemove && onRemove()
          }
        >
          {(fileList && fileList.length >= limit || isPreview) ? null : uploadButton}
        </Upload>
        <PreviewImg {...previewProps} />
        {/* < Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal> */}
        {
          this.state.clipSrc && <ImageClipper {...imgCliperProps} />}
      </div>
    );
  }
}

