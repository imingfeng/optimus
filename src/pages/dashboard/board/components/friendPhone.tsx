import React, { FC } from 'react'
import _ from 'lodash'
import moment from 'moment'
import { Spin, Empty } from 'antd'
import { unitsSeparate } from '@/utils'
import { source } from '@/config';
import styles from './../index.less'

import CensusFilter from './../../components/filter'
import ChartBar from './../../components/barTwo'

interface StatisticsProps {

}

const Statistics: FC<StatisticsProps> = (props: any) => {
  const { filterProps, loading, barList, chartBarProps, total } = props

  let data1: any[] = [], data2: any[] = [], xAxisDatas: any[] = [];
  barList.map((item: any) => {
    data1.push(item.phoneCount)
    data2.push(item.noPhoneCount)
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
        <div className={styles.modelTitleBox}>
          <h2 className="commonTit">新增蜂友统计（总计蜂友：{unitsSeparate(total)}）</h2>
          <span className={styles.tips}>包括自主注册与员工采集的蜂友</span>
        </div>
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