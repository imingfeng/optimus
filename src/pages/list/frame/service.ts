import { request } from '@/utils';
import { api } from '@/config';

const {
  dashboard: {
    goodsCount,
  },
} = api;
const fetch = {
  fetchCount(data: any) {
    return request({
      url: goodsCount,
      data
    });
  },
};
export default fetch;