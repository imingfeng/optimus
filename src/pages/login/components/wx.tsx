import React, { useState, FC, Component } from 'react';
// import QRCode from 'qrcode';
import styles from './../style.less';
import { Skeleton } from 'antd';
// import wxCode from '@/assets/login.png';

function addWxScript(jsUrl: string = '') {
  return new Promise((resolve, reject) => {
    let script: any = document.getElementById('wxJsUrl');
    if (!script && jsUrl) {
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = 'wxJsUrl';
      script.src = jsUrl;
      document.body.appendChild(script);
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        reject();
      };
    } else {
      resolve();
    }
  });
}

class Page extends Component<any> {

  state = {
    loading: true,
  }

  componentDidMount() {
    async function init() {
      await addWxScript('https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js');
    }

    init().then(() => {
      let pageUrl = encodeURIComponent(location.href);
      if (window.WxLogin) {
        let obj = new window.WxLogin({
          self_redirect: true,
          id: "js_wx_code",
          appid: "wx0b61437c4ec22ce9", // AppSecret: 645f3767f6f38e9f10e124bec254ac69
          scope: "snsapi_login,snsapi_userinfo,snsapi_base",
          // redirect_uri: encodeURI(location.href),
          redirect_uri: encodeURI(`https://bee.zhuihuazu.com/wx_auth.html?callback=${pageUrl}`),
          href: "https://bee.zhuihuazu.com/wx_auth_style.css"
        });

        setTimeout(() => {
          this.setState({
            loading: false,
          })
        }, 800)
      }
    })
  }

  render() {
    const { loading } = this.state
    const skeletonProps = {
      active: true,
      paragraph: {
        rows: 5,
      }
    }
    return (
      <>
        {
          loading ? (
            <div className={styles.wxCodeLoading}>
              <Skeleton {...skeletonProps}/>
            </div>
          ) : ''
        }
        <div id="js_wx_code" className={styles.wxCode} style={{ display: loading ? 'none' : 'block' }}></div>
      </>
    )
  }
}

export default Page;