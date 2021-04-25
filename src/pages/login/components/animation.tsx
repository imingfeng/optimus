import React, { useState, FC, Component } from 'react';
// import QRCode from 'qrcode';
import styles from './animation.less';
import _ from 'lodash';
// import wxCode from '@/assets/login.png';

const beeImg = [
  'https://dnkj-family-farm-prd.oss-cn-huhehaote.aliyuncs.com/data/ms-kbms/activity/img/1588213571238.png',
  'https://dnkj-family-farm-prd.oss-cn-huhehaote.aliyuncs.com/data/ms-kbms/activity/img/1588225977551.png',
  'https://dnkj-family-farm-prd.oss-cn-huhehaote.aliyuncs.com/data/ms-kbms/activity/img/1588213562419.png',
];
const cssBee = ['img1', 'img2'];

let beeTime: any = null;

class Page extends Component<any> {

  state = {
    crowdBee: [],
  }

  componentDidMount() {
    let crowdBee: any = [];

    for (let i = 0, len = 100; i < len; i++) {
      crowdBee.push({
        url: beeImg[Math.floor(Math.random() * 3)],
        style: {
          width: `${Math.floor(Math.random() * 30 + 10)}px`,
          transition: `${Math.floor(Math.random() * 5 + 2)}s all linear`,
          opacity: Math.random(),
          transform: `translate(-${Math.floor(Math.random() * 100 + 0)}vw, ${Math.floor(Math.random() * 100 + 0)}vh)`,
        },
        cssName: cssBee[Math.floor(Math.random() * 2)]
      })
    }

    this.setState({
      crowdBee,
    })

    // beeTime = setInterval(() => {
    //   crowdBee.map((item: any) => {
    //     item.style = {
    //       ...item.style,
    //       opacity: Math.random(),
    //       transform: `translate(-${Math.floor(Math.random() * 100 + 0)}vw, ${Math.floor(Math.random() * 100 + 0)}vh)`,
    //     }
    //   })
    //   this.setState({
    //     crowdBee,
    //   })
    // }, 4000);
  }

  // componentWillUnmount() {
  //   clearInterval(beeTime);
  // }

  render() {
    const { crowdBee } = this.state;
    return (
      <>
        <div className={styles.beeGif}>
          <img src="https://dnkj-family-farm-prd.oss-cn-huhehaote.aliyuncs.com/data/ms-kbms/activity/img/1587026557199.gif	" alt="" />
        </div>
        <div className={styles.beeBox}>
          {
            crowdBee.map((item: any, index: number) => {
              let style = {
                ...item.style,
              }
              return <img src={item.url} key={index} alt="" className={styles[item.cssName]} style={style} />
            })
          }
        </div>
      </>
    )
  }
}

export default Page;