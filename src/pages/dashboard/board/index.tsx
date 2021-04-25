import React, { Component, useRef } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import moment from 'moment'
import { formatTimestamp } from '@/utils'

import StatisticsTemp from './../components/statistics'
// import SwarmBarTemp from './components/swarmBar'
// import FriendSourceTemp from './components/friendSource'
// import FriendPhoneTemp from './components/friendPhone'
// import SwarmTemp from './components/swarmList'

interface IProps {
  homeStatistics: any,
  gatherDatas: any,
  dispatch: ({ }) => void,
}

class Statistics extends Component<IProps> {
  state = {
    gather: {},
    regist: {},
  }

  render() {
    const {
      homeStatistics: {
        counts,
        statisticsCount,

        swarmLoading,
        swarmData,

        friendSourceLoading,
        friendSourceData,

        friendPhoneLoading,
        friendPhoneData,

        swarmlist,
        fieldsSwarm,
      },
      actions,
    }: any = this.props
    const statisProps = {
      counts
    }
    // 新增蜂场
    const swarmBarProps = {
      filterProps: {
        name: 'swarmBarFilter',
        handleClickRadio: (v: any) => {
          actions.fetchStatisticsSwarm(v)
        },
        handleDateChange: (v: any) => {
          actions.fetchStatisticsSwarm(v)
        },
        handleResetForm: () => {
          actions.fetchStatisticsSwarm([moment().subtract('days', 6), moment()])
        }
      },
      total: statisticsCount.swarmNum,
      loading: swarmLoading,
      barList: swarmData,
      chartBarProps: {
        id: 'swarmBar',
        legend: ['新增蜂友的蜂场', '存量蜂友的蜂场', '新增无手机号的蜂场']
      }
    }
    // 新增蜂友
    const friendPhoneProps = {
      filterProps: {
        name: 'phoneFilter',
        handleClickRadio: (v: any) => {
          actions.fetchStatisticsFriendPhone(v)
        },
        handleDateChange: (v: any) => {
          actions.fetchStatisticsFriendPhone(v)
        },
        handleResetForm: () => {
          actions.fetchStatisticsFriendPhone([moment().subtract('days', 6), moment()])
        }
      },
      total: statisticsCount.friendNum,
      loading: friendPhoneLoading,
      barList: friendPhoneData,
      chartBarProps: {
        id: 'phoneBar',
        legend: ['有手机号蜂友', '无手机号蜂友']
      }
    }
    // 注册蜂友
    const friendSourceProps = {
      filterProps: {
        name: 'sourceFilter',
        handleClickRadio: (v: any) => {
          actions.fetchStatisticsFriendSource(v)
        },
        handleDateChange: (v: any) => {
          actions.fetchStatisticsFriendSource(v)
        },
        handleResetForm: () => {
          actions.fetchStatisticsFriendSource([moment().subtract('days', 6), moment()])
        }
      },
      total: statisticsCount.rgFriendNum,
      loading: friendSourceLoading,
      barList: friendSourceData,
      chartBarProps: {
        id: 'sourceBar',
        legend: ['员工采集', '蜂友自主注册']
      }
    }

    const swarmProps = {
      list: swarmlist,
      fields: fieldsSwarm,
    }

    return (
      <>
        <div className="pageTitle">首页看板</div>
        <div className="pageBox">
          <StatisticsTemp {...statisProps} />
          {/* <SwarmBarTemp {...swarmBarProps} />
          <FriendPhoneTemp {...friendPhoneProps} />
          <FriendSourceTemp {...friendSourceProps} />
          <SwarmTemp {...swarmProps} /> */}
        </div>
      </>
    )
  }
}

const stateToProps = ({ homeStatistics }: any) => {
  return {
    homeStatistics,
  };
}

const dispatchToProps = (dispatch: any) => {
  return {
    actions: {

      fetchStatisticsSwarm(v: [any, any]) {
        dispatch({ type: 'homeStatistics/fetchStatisticsSwarm', payload: {
          startDate: formatTimestamp(v[0], false),
          endDate: formatTimestamp(v[1], true)
        }});
      },

      fetchStatisticsFriendSource(v: [any, any]) {
        dispatch({ type: 'homeStatistics/fetchStatisticsFriendSource', payload: {
          startDate: formatTimestamp(v[0], false),
          endDate: formatTimestamp(v[1], true)
        }});
      },

      fetchStatisticsFriendPhone(v: [any, any]) {
        dispatch({ type: 'homeStatistics/fetchStatisticsFriendPhone', payload: {
          startDate: formatTimestamp(v[0], false),
          endDate: formatTimestamp(v[1], true)
        }});
      },
    }
  }
}

export default connect(
  stateToProps,
  dispatchToProps
)(Statistics);