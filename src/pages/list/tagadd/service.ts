import { request } from '@/utils';
import { api } from '@/config';

const {
  dashboard: {
    boardCount
  },
} = api;
const fetch = {
  fetchCount(data: any) {
    return request({
      url: boardCount,
      data
    });
  },

  fetchList(data: any) {
    return request({
      url: boardCount,
      data
    });
  },

  fetchList2(data: any) {
    return request({
      url: boardCount,
      data
    });
  },

  dictionaryConfigs(data: any) {
    return request({
      url: boardCount,
      data
    });
  }
};
export default fetch;