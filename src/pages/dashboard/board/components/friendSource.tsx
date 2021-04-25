import React, { FC } from 'react'
import _ from 'lodash'
import moment from 'moment'
import { Spin, Empty } from 'antd'
import { unitsSeparate } from '@/utils'
import { source } from '@/config';

import CensusFilter from './../../components/filter'
import ChartBar from './../../components/barTwo'

interface StatisticsProps {

}

const Statistics: FC<StatisticsProps> = (props: any) => {
  const { filterProps, loading, barList, chartBarProps, total } = props

  let data1: any[] = [], data2: any[] = [], xAxisDatas: any[] = [];
  barList.map((item: any) => {
    data1.push(item.collectionCount)
    data2.push(item.registerCount)
    xAxisDatas.push(moment(item.countDate).format('MM.DD'))
  })

  const barProps = {
    ...chartBarProps,
    data1,
    data2,
    xAxisDatas,
  }

  return (
    <>
      <div className="contentPrimary">
        <h2 className="commonTit">注册蜂友统计（总计注册蜂友：{unitsSeparate(total)}）</h2>
        <CensusFilter {...filterProps} />
        <div>
          <Spin spinning={loading}>
            {
              (!_.isEmpty(data1) || !_.isEmpty(data2)) ? (
                <ChartBar {...barProps} />
              ) : (
                  <div style={{ padding: '40px 0' }}>
                    <Empty image={source.noData} />
                  </div>
                )
            }
          </Spin>
        </div>
      </div>
    </>
  );
};

export default Statistics;