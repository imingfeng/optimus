import services from './service';
import { Model, ItemUtils } from '@/utils'
import { recordList } from './config/tableFields'
import { orderInfoConfig, userInfoConfig, invoiceInfoConfig } from './config/info'
import { auditApplyConditions } from './config/formFields'
import _ from 'lodash'
import router from 'umi/router';
import moment from 'moment';

export default Model.extend({
  namespace: 'purchaseGoodsDetail',
  state: {
    orderInfoConfig: _.cloneDeep(orderInfoConfig), // 开票信息
    userInfoConfig: _.cloneDeep(userInfoConfig), // 用户信息
    invoiceInfoConfig: _.cloneDeep(invoiceInfoConfig), // 已开票信息
    recordTable: recordList, // 操作记录
    auditApplyConditions: _.cloneDeep(auditApplyConditions), // 关闭申请
    applyId: '', // 申请id
    detailInfo: {}, // 详情数据
    logList: [], // 日志列表
  },
  subscriptions: {
    setup({ dispatch, listen }: any) {
      listen('/finance/invoice/detail/:id', (e: any) => {
        const applyId = e.params[0];

        dispatch({
          type: 'updateState',
          payload: {
            applyId,
          }
        });

        dispatch({ type: 'fetchDetail' });
      });
    }
  },
  effects: {
    * fetchDetail({ payload }: any, { callWithSpinning, select, update, put }: any) {
      let { applyId } = yield select((_: any) => _.financePaymentDetail);
      const data = yield callWithSpinning(services.fetchDetail, {
        applyId,
        ...payload,
      })

      const detailInfo = data.content || {};
      yield update({
        detailInfo
      })

      yield put('updateDetails')
    },

    * fetchConfirm({ payload }: any, { callWithConfirmLoading, put, select }: any) {
      let { applyId } = yield select((_: any) => _.financePaymentDetail);
      let successMsg = '开票成功'
      if (payload.status === 20) {
        successMsg = '修改成功'
      }
      const data = yield callWithConfirmLoading(services.fetchConfirm, { applyId, ...payload }, {
        successMsg,
      });
      yield put('fetchDetail')
    },

  },
  reducers: {
    updateDetails(state: any) {
      const { orderInfoConfig, userInfoConfig, detailInfo } = state;
      const drawerInfo = detailInfo.drawerInfo || {} // 开票人
      const optLogList = detailInfo.optLogList || [] // 操作日志

      let _orderInfoConfig = _.cloneDeep(orderInfoConfig)
      _orderInfoConfig.map((item: any) => {
        item.value = detailInfo[item.key]
      })

      let _userInfoConfig = _.cloneDeep(userInfoConfig)
      _userInfoConfig.map((item: any) => {
        item.value = drawerInfo[item.key]
      })

      return{
        ...state,
        orderInfoConfig: _orderInfoConfig,
        userInfoConfig: _userInfoConfig,
        logList: optLogList,
      }
    }
  }
})
