import { request } from '@/utils';
import { api } from '@/config';

const {
  dashboard: {
    invoiceApplyConfirm,
    invoiceApplyDetail,
  },
} = api;
const fetch = {
  fetchDetail(data: any) {
    return request({
      url: invoiceApplyDetail,
      data
    }, {
      formatResponse: false,
    });
  },

  fetchConfirm(data: any) {
    return request({
      url: invoiceApplyConfirm,
      data
    });
  },
};
export default fetch;
