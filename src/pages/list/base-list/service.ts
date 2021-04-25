import { request } from '@/utils';
import { api } from '@/config';

const {
  dashboard: {
    goodsCount,
    goodsList,
  },
  exportExcel: { exportProduct }
} = api;
const fetch = {
  fetchCount(data: any) {
    return request({
      url: goodsCount,
      data
    });
  },

  fetchList(data: any) {
    return request({
      url: goodsList,
      data
    });
  },

  exportList: (data = {}) => {
    return request({
      url: exportProduct,
      method: 'export',
      data,
      fileName: '收购商品导出'
    })
  },
};
export default fetch;