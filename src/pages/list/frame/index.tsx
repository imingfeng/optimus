import React, { useState, FC } from 'react'
import { connect } from 'dva'
import { Button } from 'antd'
import { icon } from '@/config'
import { formatTimestamp, locationCode } from '@/utils'
import { CardModule } from '@/components';

interface PageProps {

}

const Page: FC<PageProps> = (props: any) => {
  const {
    actions,
    listEmpty: { spinning, pagination }
  }: any = props;

  return (
    <>
      <div className="pageTitle">商品管理</div>
      <div className="pageBox">
        <div className="contentPrimary">
          <h2 className="commonTit">统计概览</h2>
        </div>
        <CardModule title="模块名称">
          <div>模块</div>
        </CardModule>
      </div>
    </>
  );
};

const mapStateToProps = ({ listEmpty }: any) => {
  return {
    listEmpty,
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
      },
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page)
