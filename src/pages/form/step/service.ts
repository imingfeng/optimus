import { request } from '@/utils';
import { api } from '@/config';

const {
  base: {
    dictionaryConfigs,
  },
  demoapi: {
    goodsAdd,
    goodsAddOnShelf,
    goodsUpdate,
    goodsDetail,
  }
} = api;
const fetch = {

  goodsDetail(data: any) {
    return request({
      url: goodsDetail,
      data
    });
  },

  fetchConfig(data: any) {
    return request({
      url: dictionaryConfigs,
      data
    });
  },

  goodsAdd(data: any) {
    return request({
      url: goodsAdd,
      data
    });
  },

  goodsAddOnShelf(data: any) {
    return request({
      url: goodsAddOnShelf,
      data
    });
  },

  goodsUpdate(data: any) {
    return request({
      url: goodsUpdate,
      data
    });
  },
};
export default fetch;