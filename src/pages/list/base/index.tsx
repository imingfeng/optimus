import React, { useState, FC } from 'react'
import { connect } from 'dva'
import { formatTimestamp, locationCode } from '@/utils'
import { Statistics } from '@/components';

import FilterTemp from './components/filter'
import ListTemp from './components/list'


interface PageProps {

}

const Page: FC<PageProps> = (props: any) => {
  const {
    actions,
    listSimpleBase: { 
      filterCondition, spinning, tableRadioGroup, fields, 
      pagination, list
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
    fields,
    pagination,
    list,
    onChange: (page: any, filter: any) => {
      const { current, pageSize } = page

      let payload: any = {
        pn: current,
        ps: pageSize,
      }

      actions.fetchList(payload)
    },
  }

  return (
    <>
      <div className="pageTitle">简单列表</div>
      <div className="pageBox">
        <div className="contentPrimary">
          <h2 className="commonTit">统计概览</h2>
          <Statistics {...statisticsProps} />
          <FilterTemp {...filterProps} />
        </div>
        <div className="contentPrimary">
          <h2 className="commonTit" style={{ display: 'inline', lineHeight: '32px' }}>商品列表</h2>
          <ListTemp {...listProps} />
        </div>
      </div>
    </>
  );
};

// 配置model
const mapStateToProps = ({ listSimpleBase }: any) => {
  return {
    listSimpleBase,
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
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page)
