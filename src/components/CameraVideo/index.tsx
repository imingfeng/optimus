import React, { Component } from 'react'
import { EnhanceModal } from '@/components';
import ezuikit from 'ezuikit'

interface IProps {
  videos: any;
  visible: boolean;
  onOk: () => void;
}

interface IState {

}

export default class CameraVideo extends Component<IProps, IState> {

  UNSAFE_componentWillReceiveProps({ videos }: any) {
    if (videos !== this.props.videos) {
      setTimeout(() => {
        if (document.getElementById('myPlayer')) {
          const player = new ezuikit('myPlayer');
          player.on('error', function () {
            console.log('error');
          });
          player.on('play', function () {
            console.log('play');
          });
          player.on('pause', function () {
            console.log('pause');
          });
        }
      }, 0)
    }
  }

  render() {

    const { props } = this;
    const { videos = {} } = props;

    const modalProps = {
      form: '',
      footer: null,
      width: 800,
      maskClosable: false,
      centered: true,
      closable: true,
      bodyStyle: { padding: 0, paddingTop: '50px' },
      ...props,
    }

    const videoProps = {
      controls: true,
      playsInline: true,
      'webkit-playsinline': 'true',
      autoPlay: true,
    }

    return <>
      <EnhanceModal {...modalProps}>
        <div>
          <video id="myPlayer" width="800px" controls poster={videos.captureImg} height="450px" {...videoProps} style={{ display: 'block' }} >
            <source src={videos.rtmpDistinctBroadcastAddress} type="" />
            <source src={videos.hdBroadcastAddress} type="application/x-mpegURL" />
          </video>
        </div>
      </EnhanceModal>
    </>
  }
}
