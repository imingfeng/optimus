import { request } from '@/utils';
import { api } from '@/config';

const {
  user: {
    smsLogin,
    getLoginCode,
    permissionCheck,
    autoLogin,
    wxLogin,
  },
  base: {
    accountExist,
  }
} = api;
const fetch = {
  // 登录
  fetchLogin(data: any) {
    return request({
      url: smsLogin,
      data,
    }, {
      formatResponse: false,
    });
  },

  // 微信登录
  fetchWxLogin(data: any) {
    return request({
      url: wxLogin,
      data,
    }, {
      formatResponse: false,
    });
  },

  // 校验手机号是否存在
  fetchMobileCheck(data: any) {
    return request({
      url: accountExist,
      data,
    })
  },

  // 获取验证码
  fetchCode(data: any) {
    return request({
      url: getLoginCode,
      data,
    }, {
      formatResponse: false,
    });
  },

  // 获取权限
  fetchCheck(data: any) {
    return request({
      url: permissionCheck,
      data,
    }, {
      formatResponse: false,
    })
  },

  // 自动登录
  fetchAutoLogin(data: any) {
    return request({
      url: autoLogin,
      data,
    }, {
      formatResponse: false,
    })
  },
};
export default fetch;
