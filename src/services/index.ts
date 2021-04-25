import { request } from 'utils';
import { api } from 'config';

const {
  user: {
    login,
    userDetail,
  },
} = api;

export default {
  login(data: any) {
    return request({
      url: login,
      data,
    });
  },

  userDetail(data: any) {
    return request(
      {
        url: userDetail,
        data,
      },
      {
        closeTips: true,
      }
    );
  },
};
