import _ from 'lodash';
import moment from 'moment'
import { message } from 'antd'
import { Model, formatTimestamp } from '@/utils'
import services from './service'
import { tableRadioCondition } from './config/filterConfig'
import { tableList } from './config/tableFields'

const initState = {
  counts: tableRadioCondition,
  statisticsCount: {}, // 概览

  gatherBarLoading: false,
  registBarLoading: false,

  swarmLoading: false, // 新增蜂场 loading
  swarmData: [], // 新增蜂场 数据

  friendPhoneLoading: false, // 新增蜂友 loading
  friendPhoneData: [], // 新增蜂友统计 数据

  friendSourceLoading: false, // 注册蜂友统计 loading
  friendSourceData: [], // 注册蜂友统计 数据

  swarmlist: [], // 蜂友所属蜂场分布
  fieldsSwarm: tableList,
}

export default Model.extend({
  namespace: 'homeStatistics',
  state: _.cloneDeep(initState),
  subscriptions: {
    setup({ dispatch, listen }: any) {
      listen('/dashboard/board', () => {
        dispatch({
          type: 'updateState',
          payload: { ..._.cloneDeep(initState) }
        })

        // dispatch({
        //   type: 'fetchCounts',
        // });

        // dispatch({
        //   type: 'fetchStatisticsSwarm',
        //   payload: {
        //     startDate: formatTimestamp(moment().subtract('days', 6), false),
        //     endDate: formatTimestamp(moment(), true),
        //   }
        // });

        // dispatch({
        //   type: 'fetchStatisticsFriendSource',
        //   payload: {
        //     startDate: formatTimestamp(moment().subtract('days', 6), false),
        //     endDate: formatTimestamp(moment(), true),
        //   }
        // });

        // dispatch({
        //   type: 'fetchStatisticsFriendPhone',
        //   payload: {
        //     startDate: formatTimestamp(moment().subtract('days', 6), false),
        //     endDate: formatTimestamp(moment(), true),
        //   }
        // });

        // dispatch({
        //   type: 'fetchBoardFriendSwarm'
        // })
      })
    }
  },
  effects: {
    // 蜂友统计
    * fetchCounts({payload}: any, { callWithSpinning, update, select }:any) {
      let { counts } = yield select((_: any) => _.homeStatistics);
      const statisticsCount = yield callWithSpinning(services.boardCount, {
        ...payload,
      });

      counts.map((item: any) => {
        item.number = statisticsCount[item.key] || 0
      })

      yield update({
        counts,
        statisticsCount,
      })
    },

    // 新增蜂场统计
    * fetchStatisticsSwarm({payload}: any, { callWithLoading, update, select }:any) {
      yield update({
        swarmLoading: true
      })
      const datas = yield callWithLoading(services.boardSwarm, { ...payload })
      if(datas.status === "OK") {
        yield update({
          swarmData: datas.content,
          swarmLoading: false
        })
      } else {
        message.error(datas.errorMsg)
        yield update({
          swarmLoading: false
        })
      }
    },

    // 新增蜂友统计
    * fetchStatisticsFriendPhone({payload}: any, { callWithLoading, update, select }:any) {
      yield update({
        friendPhoneLoading: true
      })
      const datas = yield callWithLoading(services.boardFriendPhone, { ...payload })
      if(datas.status === "OK") {
        yield update({
          friendPhoneData: datas.content,
          friendPhoneLoading: false
        })
      } else {
        message.error(datas.errorMsg)
        yield update({
          friendPhoneLoading: false
        })
      }
    },

    // 注册蜂友统计
    * fetchStatisticsFriendSource({payload}: any, { callWithLoading, update, select }:any) {
      yield update({
        friendSourceLoading: true
      })
      const datas = yield callWithLoading(services.boardFriendSource, { ...payload })
      if(datas.status === "OK") {
        yield update({
          friendSourceData: datas.content,
          friendSourceLoading: false
        })
      } else {
        message.error(datas.errorMsg)
        yield update({
          friendSourceLoading: false
        })
      }
    },

    // 蜂友所属蜂场分布
    * fetchBoardFriendSwarm({ payload }: any, { call, update, select }: any) {
      const datas = yield call(services.boardFriendSwarm, { ...payload })

      yield update({
        swarmlist: datas,
      })
    },
  },
  reducers: {}
})