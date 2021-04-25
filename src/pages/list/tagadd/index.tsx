import React, { useState, FC } from 'react'
import { connect } from 'dva'
import { formatTimestamp, locationCode } from '@/utils'
import { Statistics } from '@/components';
import { Tabs } from 'antd';

import FilterTemp from './components/filter'
import ListTemp from './components/list'
import List2Temp from './components/list2'

const { TabPane } = Tabs;

interface PageProps {

}

const Page: FC<PageProps> = (props: any) => {
  const {
    actions,
    listTagAdd: {
      filterCondition, spinning, tableRadioGroup, tableList,
      pagination, list, confirmLoading, formEditConditions,
      filterCondition2, list2, formEdit2Conditions, tableList2, pagination2
    }
  }: any = props;

  // 统计组件参数
  const statisticsProps = {
    tableRadioGroup,
    changeTableList: ({ target }: any) => {
      actions.changeCount({
        countStatus: target.value,
      })
    }
  }

  // 筛选组件参数
  const filterProps = {
    spinning,
    filterCondition,
    onSearch: (payload: any) => {
      // 地址 服务器需要的code【省-市-区】
      let siteParams = locationCode(payload.location)
      delete payload.location

      // 时间范围
      let timeParams = {}
      if (payload.createDate) {
        timeParams = {
          onShelfTimeStart: formatTimestamp(payload.createDate[0]),
          onShelfTimeEnd: formatTimestamp(payload.createDate[1], true),
        }
        delete payload.createDate
      }

      actions.handleSearch({
        ...payload,
        ...timeParams,
        ...siteParams,
      })
    },
    onReset: () => {
      actions.handleSearch({})
    },
  }

  const listProps = {
    actions,
    spinning,
    fields: tableList,
    pagination,
    list,
    confirmLoading,
    formEditConditions,
    onChange: (page: any, filter: any) => {
      const { current, pageSize } = page

      let payload: any = {
        pn: current,
        ps: pageSize,
      }

      actions.fetchList(payload)
    },
  }

  const list2Props = {
    actions,
    spinning,
    fields: tableList2,
    pagination: pagination2,
    list: list2,
    confirmLoading,
    formEditConditions: formEdit2Conditions,
    onChange: (page: any, filter: any) => {
      const { current, pageSize } = page

      let payload: any = {
        pn: current,
        ps: pageSize,
      }

      actions.fetchList2(payload)
    },
  }

  return (
    <>
      <div className="pageTitle">标签操作列表</div>
      <div className="pageBox">
        <div className="contentPrimary">
          <h2 className="commonTit">统计概览</h2>
          <Statistics {...statisticsProps} />
        </div>
        <div className="contentPrimary">
          <Tabs defaultActiveKey="1" size="large">
            <TabPane tab="族类管理" key="1">
              <FilterTemp {...filterProps} />
              <ListTemp {...listProps} />
            </TabPane>
            <TabPane tab="品牌管理" key="2">
              <List2Temp {...list2Props} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};

// 配置model
const mapStateToProps = ({ listTagAdd }: any) => {
  return {
    listTagAdd,
  };
}

// 处理状态
const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: {
      handleSearch(payload: any) {
        dispatch({
          type: 'purchaseGoods/updateState',
          payload: {
            filterParams: payload,
          }
        })
        dispatch({
          type: 'purchaseGoods/fetchList',
          payload: {
            ...payload,
            pn: 1,
            ps: 10,
          },
        })
      },
      changeCount(payload: any) {
        dispatch({
          type: 'purchaseGoods/updateState',
          payload,
        })
        dispatch({
          type: 'purchaseGoods/fetchList',
          payload: {
            pn: 1,
            ps: 10,
          },
        })
      },
      fetchList(payload: any) {
        dispatch({
          type: 'purchaseGoods/fetchList',
          payload,
        })
      },

      handleSearch2(payload: any) {
        dispatch({
          type: 'goodsSell/updateState',
          payload: {
            filterParams2: payload,
          }
        })
        dispatch({
          type: 'goodsSell/fetchList2',
          payload: {
            ...payload,
            pn: 1,
            ps: 10,
          },
        })
      },
      fetchList2(payload: any) {
        dispatch({
          type: 'goodsSell/fetchList2',
          payload,
        })
      },
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page)
