/* global window */
import axios from 'axios';
import lodash from 'lodash';
import qs from 'qs';
import moment from 'moment';
import { message } from 'antd';
import * as _localStorage from './_localStorage';
import router from 'umi/router';
import queryString from 'query-string';
import API from '@/config/api';
import { encodeSearchParams, clearUserLoginToken } from '@/utils';
const { exportExcel: {
  exportProduct,
 } } = API;
// 设置post header
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 10020015:冻结,
const errorCode = ['10010102', '10020018', '10020019', '10020020', '10020015'];
const loginOutCode = ['10020020', '10020015'];
const enterCheckCode = ['10100103'];

//导出
const exportApi: any[] = [
  exportProduct,
]

function click (node: any) {
  try {
    node.dispatchEvent(new MouseEvent('click'))
  } catch (e) {
    var evt = document.createEvent('MouseEvents')
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
      20, false, false, false, false, 0, null)
    node.dispatchEvent(evt)
  }
}
const fetch = (options: any) => {
  let {
    method = 'form',
    data = {},
    url,
  } = options;

  const LoginInfo = {
    // '_tk_': token,
    // '_deviceId_': deviceId,
  };

  const cloneData = qs.stringify(lodash.cloneDeep({ ...data, ...LoginInfo }));
  const freeData = qs.stringify(lodash.cloneDeep({ ...data }));
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData
      });
    case 'getfree':
      return axios({
        url: url + `?` + freeData,
        method: 'get'
      });
    case 'delete':
      return axios.delete(url, {
        data: cloneData
      });
    case 'post':
      return axios({
        url,
        data: { ...data, ...LoginInfo },
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      });
    case 'put':
      return axios.put(url, cloneData);
    case 'patch':
      return axios.patch(url, cloneData);
    case 'form':
      return axios({
        url,
        data: cloneData,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    case 'download':
      return new Promise(function(resolve, reject){
        // saveAs(`${url}?${encodeSearchParams({ ...data, ...LoginInfo })}`, `${fileName}_${new Date().getTime()}.xlsx`, { autoBom: true });
        let a = document.createElement('a');
        a.href = `${url}?${encodeSearchParams({ ...data, ...LoginInfo })}`;
        a.target = '_blank';
        setTimeout(function () { click(a) });
        resolve({data:{status: "OK"}});
      });
    case 'export':
      return axios({
        url: url + `?` + freeData,
        method: 'get',
        responseType: 'arraybuffer',
      })
    default:
      return axios(options);
  }
};

export default function request(options: any, config: any = {}) {
  const { formatResponse = true, closeTips = false } = config;
  const { token, deviceId } = _localStorage.getJson('userToken');

  axios.defaults.headers.common['region'] = 'online'; // 线上服务

  axios.defaults.headers.common['_Token_'] = token || ''; //给网络请求添加全局的头部token
  axios.defaults.headers.common['_Device-Id_'] = deviceId || ''; //给网络请求添加全局的头部token
  axios.defaults.headers.common['Accept-Language'] = 'zh';

  return fetch(options).then((response: any) => {
    const data = response.data;
    const pathname = window.location.pathname;
    if (data.status === 'ERROR') {
      if (errorCode.includes(data.errorCode)) {
        // 如果是登陆信息错误
        if (pathname !== '/login') {
          if (loginOutCode.includes(data.errorCode)) {
            clearUserLoginToken();
          }
          router.push({
            pathname: '/login',
            search: queryString.stringify({
              from: pathname
            })
          });
        }
      }
      if (formatResponse) {
        return Promise.reject({
          success: false,
          message: data.errorMsg
        });
      }

      // 入驻平台校验
      if(enterCheckCode.includes(data.errorCode)) {
        console.log(3);
        console.log(data);
        return Promise.resolve(data);
      }

      return Promise.resolve(data);
    }

    if (exportApi.includes(options.url)) {
      console.log(data);
      if (data.byteLength < 100) {
        // router.push({
        //   pathname: '/login',
        //   search: queryString.stringify({
        //     from: pathname,
        //   }),
        // })

        let errorMsg = '导出异常 !'
        try {
          let enc = new TextDecoder('utf-8')
          let res = JSON.parse(enc.decode(new Uint8Array(data))) //转化成json对象
          errorMsg = res.errorMsg
        } catch (error) {
          
        }

        message.error(errorMsg)
        return
      }
      let newBlob = new Blob([data], { type: 'text/plain;charset=UTF-8' });
      let anchor = document.createElement('a');
      let day = new Date();
      let fileName = options.fileName ? `${options.fileName}_` : ''
      anchor.download = `${fileName}${moment(day.getTime()).format('YYYYMMDD')}.xlsx`

      if("msSaveOrOpenBlob" in navigator) {
        window.navigator.msSaveOrOpenBlob(newBlob, `${fileName}${moment(day.getTime()).format('YYYYMMDD')}.xlsx`);
        return;
      } else {
        anchor.href = window.URL.createObjectURL(newBlob)
        anchor.click()
        return Promise.resolve({ data: { status: "OK" } });
      }
    }

    if (!formatResponse) {
      return Promise.resolve(data);
    }
    return Promise.resolve(data.content);
  }).catch((error) => {
    const { response } = error;
    let msg;
    let statusCode;
    if (response && response instanceof Object) {
      const { data, statusText } = response;
      statusCode = response.status;
      msg = data.message || statusText || '服务器异常，稍后重试！';
    } else {
      statusCode = 600;
      msg = error.message === 'Network Error' ? '网络异常，稍后重试！' : error.message;
    }
    if (closeTips) {
      msg = '';
    }
    console.log('request error', error);

    if (!formatResponse) {
      return Promise.resolve({
        status: 'ERROR',
        errorMsg: msg,
      });
    }

    /* eslint-disable */
    return Promise.reject({ success: false, statusCode, message: msg });
  });
}
