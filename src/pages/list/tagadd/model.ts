import services from './service';
import _ from 'lodash';
import { Model, ItemUtils, unitsPrice } from '@/utils'
import { filterCondition, tableRadioCondition } from './config/filterConfig'
import { tableList, tableList2 } from './config/tableFields'
import { formEditConditions } from './config/formFields'
import { base } from '@/config';
import { message } from 'antd'

const initState = {
  filterCondition: filterCondition, // 列表-筛选
  tableRadioGroup: tableRadioCondition, // 列表-统计
  tableList, // 列表-表格
  formEditConditions: _.cloneDeep(formEditConditions), // 列表弹框添加、编辑
  pagination: { // 分页
    ...base.initPage,
  },

  list: [{id: 1}], // 列表-数据
  filterParams: {}, // 筛选条件
  countStatus: '', // 统计状态

  filterCondition2: filterCondition, // 列表筛选2
  tableList2, // 列表2
  list2: [{id: 1, status: 0}, { id: 2, status: 1 }], // 列表-数据
  filterParams2: {channelId: 1}, // 筛选条件
  pagination2: { // 分页
    ...base.initPage,
  },
}

export default Model.extend({
  namespace: 'listTagAdd',
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

        dispatch({ type: 'fetchCount' });
        dispatch({ type: 'fetchList' });

        // dispatch({ type: 'fetchDictionaryConfigs' })
      });
    }
  },
  effects: {
    // 商品类型 下拉菜单
    * fetchDictionaryConfigs({ payload }: any, { update, call, put, select }: any): any {
      const data = yield call(services.dictionaryConfigs, { codes: 10002 });
      if (data) {
        let varietyList: any = [];
        data.map((item: any) => {
          if (item.code === '10002') {
            varietyList.push({
              label: item.value,
              value: item.key,
            })
          }
        })
        yield update({
          varietySourceList: varietyList
        })
        yield put({ type: 'updateFilterConditon' })
      }
    },

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

    // 搜索列表
    * fetchList({ payload }: any, { callWithSpinning, select, update }: any) {
      const {
        pagination: { ps, pn },
        filterParams,
        countStatus,
      } = yield select((_: any) => _.purchaseGoods);

      const searchParams = {
        ps,
        pn,
        status: countStatus, // 统计状态
        ...filterParams,
        ...payload,
      }

      const data = yield callWithSpinning(services.fetchList, searchParams);

      if (data) {
        const { datas, pn, ps, tc } = data;
        yield update({
          list: datas,
          pagination: {
            ps,
            pn,
            total: tc,
            current: pn, // 组件需要
            pageSize: ps, // 组件需要
          },
        });
      }
    },

    // 搜索列表 - 销售标签
    * fetchList2({ payload }: any, { callWithSpinning, select, update }: any) {
      const {
        pagination2: { ps, pn },
        filterParams2,
        countStatus,
      } = yield select((_: any) => _.goodsSell);

      const searchParams = {
        ps,
        pn,
        // status: countStatus, // 统计状态
        ...filterParams2,
        ...payload,
      }

      const data = yield callWithSpinning(services.fetchList2, searchParams);

      if (data) {
        const { datas, pn, ps, tc } = data;
        yield update({
          list2: datas,
          pagination2: {
            ps,
            pn,
            total: tc,
            current: pn, // 组件需要
            pageSize: ps, // 组件需要
          },
        });
      }
    },

  },
  reducers: {
    // 更新筛选条件配置
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
