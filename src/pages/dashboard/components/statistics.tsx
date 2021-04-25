import React, { Component, useRef, FC } from 'react'
import _ from 'lodash'
import { Radio, Tooltip, Button } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { unitsSeparate } from '@/utils'

interface StatisticsProps {

}

const Statistics: FC<StatisticsProps> = (props: any) => {
  const { counts } = props

  return (
    <>
      <div className="contentPrimary">
        <h2 className="commonTit">统计概览</h2>
        <div className="radioGroupBox" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          {
            counts.map((item: any, index: number) => {
              return (
                <Button className="radioStyle" key={index} value={item.value} style={{ paddingTop: '5px' }}>
                  {item.title}
                  {
                    item.tips ? (
                      <Tooltip title={() => {
                        return (
                          <p>{item.tips}</p>
                        )
                      }
                      }>
                        <QuestionCircleOutlined style={{ fontSize: '14px', marginLeft: '5px', pointerEvents: 'auto' }} />
                      </Tooltip>
                    ) : ''
                  }
                  <p className="num">{unitsSeparate(item.number)}{item.unit}</p>
                </Button>
              )
            })
          }
        </div>
      </div>
    </>
  );
};

export default Statistics;