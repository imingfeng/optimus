import React, { useState, FC } from 'react'
import { connect } from 'dva'
import { Button } from 'antd'
import { icon } from '@/config'
import { formatTimestamp, locationCode } from '@/utils'
import { Statistics } from '@/components';

import FilterTemp from './components/filter'
import ListTemp from './components/list'


interface PageProps {

}

const Page: FC<PageProps> = (props: any) => {
  const {
    actions,
    purchaseGoods: { filterCondition, spinning, tableRadioGroup, fields, pagination, list, sorterParams }
  }: any = props;

  const statisticsProps = {
    tableRadioGroup,
    changeTableList: ({ target }: any) => {
      actions.changeCount({
        countStatus: target.value,
      })
    }
  }

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
    onExport: () => {
      actions.fetchExportList()
    }
  }

  const listProps = {
    actions,
    spinning,
    fields,
    pagination,
    list,
    createSortApply: sorterParams.ctOrderType ? sorterParams.ctOrderType === 'ASC' ? 'ascend' : 'descend' : undefined, // 创建时间排序
    onChange: (page: any, filter: any, sorter: any) => {
      const { current, pageSize } = page
      const { field, order } = sorter

      let payload: any = {
        pn: current,
        ps: pageSize,
      }

      let sort: any = {
        'ascend': 'ASC',
        'descend': 'DESC',
      }

      if (field === 'createTime' && order) {
        payload['ctOrderType'] = sort[order]
      }

      actions.fetchList(payload)
    },
  }

  return (
    <>
      <div className="pageTitle">商品管理</div>
      <div className="pageBox">
        <div className="contentPrimary">
          <h2 className="commonTit">统计概览</h2>
          <Statistics {...statisticsProps} />
          <FilterTemp {...filterProps} />
        </div>
        <div className="contentPrimary">
          <h2 className="commonTit" style={{ display: 'inline', lineHeight: '32px' }}>商品列表</h2>
          <a href="/add">
            <Button type="primary" style={{ float: 'right' }} icon={icon.plus}>添加商品</Button>
          </a>
          <ListTemp {...listProps} />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ purchaseGoods }: any) => {
  return {
    purchaseGoods,
  };
}

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
      fetchExportList(payload: any) {
        dispatch({
          type: 'purchaseGoods/fetchExportList',
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
