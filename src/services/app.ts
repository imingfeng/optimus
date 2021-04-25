import { request } from '@/utils';
import { api } from '@/config'

const { user: {
  smsLogin,
  userDetail,
  userRoles,
  // logout
} } = api;

export default {
  login(data: any) {
    return request({
      url: smsLogin,
      method: 'form',
      data,
    })
  },
  userInfo(data: any) {
    return request({
      url: userDetail,
      data,
    }, {
      closeTips: true
    })
  },
  userRoles(data: any) {
    return request({
      url: userRoles,
      data,
    })
  },
}
