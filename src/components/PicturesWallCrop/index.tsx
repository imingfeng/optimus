import React, { Component } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PreviewImg } from '@/components'
import ImgCrop from 'antd-img-crop';

import 'antd/es/modal/style';
import 'antd/es/slider/style';

/**
 * 照片裁剪：https://github.com/nanxiaobei/antd-img-crop/blob/master/README.zh-CN.md
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
  fileList: any;
  uploadButtonStyle: object;
  uploadText: string;
  onRemove: any;
  tips?: any,
}

interface IState {
  previewVisible: boolean;
  previewImage: string;
  fileList: any;
  limit: number;
}

type C = {
  fileList: [];
};

export default class PicturesWall extends Component<IProps, IState> {
  state: IState = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    limit: 1,
  };

  static defaultProps = {
    isPreview: false,
    limit: 1,
    fileList: [],
    uploadText: '上传',
  };

  constructor(props: any) {
    super(props);
    this.state.limit = props.limit;
  }

  UNSAFE_componentWillReceiveProps({ fileList }: C) {
    if (fileList !== this.props.fileList) {
      this.setState({
        fileList,
      });
    }
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file: any) => {
    this.setState({
      previewImage: file.url || file.response.content || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }: C) => {
    this.setState({ fileList });
  };

  render() {
    const {
      isPreview = false,
      limit = 1,
      fileList = [],
      uploadButtonStyle,
      uploadText = '上传',
      onRemove,
      tips = ''
    } = this.props;
    const { previewVisible, previewImage } = this.state;
    const uploadButton = (
      <div style={uploadButtonStyle}>
        <PlusOutlined />
        <div className="ant-upload-text"> {uploadText} </div>
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

    const imgFormat = ['image/jpeg', 'image/jpg', 'image/png']
    const imageValidate = (file: any) => {
      if (!imgFormat.includes(file.type)) {
        message.error('图片格式只能为jpeg/jpg/png');
        return false
      }
      if (imgFormat.includes(file.type) && (file.size > 1024 * 1024 * 5)) {
        message.error('图片大小不能超过5M');
        return false
      }

      return true
    }

    const imgCropProps = {
      rotate: true,
      // modalWidth: 800,
      // aspect: 5 / 4,
      beforeCrop: imageValidate,
      ...this.props,
    }

    return (
      <div className="clearfix">
        <ImgCrop {...imgCropProps}>
          <Upload
            listType="picture-card"
            fileList={fileList}
            showUploadList={
              isPreview
                ? { showPreviewIcon: true, showRemoveIcon: false }
                : { showPreviewIcon: true, showRemoveIcon: true }
            }
            onPreview={this.handlePreview}
            onRemove={onRemove && onRemove()}
            {...this.props}
          >
            {(fileList && fileList.length >= limit) || isPreview ? null : uploadButton}
          </Upload>
          {tips && <p style={{ padding: '5px 0', fontSize: '12px', color: '#666' }}>{tips}</p>}
        </ImgCrop>
        <PreviewImg {...previewProps} />
      </div>
    );
  }
}
