import services from './service';
import _ from 'lodash';
import { Model, ItemUtils, unitsPrice } from '@/utils'
import { tableList } from './config/tableFields'
import { base } from '@/config';
import { message } from 'antd'

const initState = {
  fields: tableList, // 列表-表格
  pagination: { // 分页
    ...base.initPage,
  },
}

export default Model.extend({
  namespace: 'listEmpty',
  state: _.cloneDeep(initState),
  subscriptions: {
    setup({ dispatch, listen }: any) {
      listen('/supply/goods', () => {
        dispatch({
          type: 'updateState',
          payload: {
            ..._.cloneDeep(initState),
          }
        })

        // dispatch({ type: 'fetchCount' });
      });
    }
  },
  effects: {
    // 统计
    * fetchCount({ payload }: any, { call, select, update }: any) {
      let { tableRadioGroup } = yield select((_: any) => _.purchaseGoods);
      const statisticsCount = yield call(services.fetchCount, {
        ...payload,
      })

      tableRadioGroup.map((item: any) => {
        item.number = statisticsCount[item.key]
      })

      yield update({
        tableRadioGroup
      })
    },
  },
  reducers: {
    updateFilterConditon(state: any, {payload}: any) {
      const {
        filterCondition,
        varietySourceList,
      } = state;

      const _filterCondition = ItemUtils.getItemType(_.cloneDeep(filterCondition))
        .extend([
          {
            title: 'variety',
            selectCondition: varietySourceList,
          },
        ]).values()

      return {
        ...state,
        filterCondition: _filterCondition
      }
    },
  }
})
