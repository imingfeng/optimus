import React, { Component, useRef, FC } from 'react'
import _ from 'lodash'
import { Radio, Tooltip, Button } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { unitsSeparate } from '@/utils'

interface StatisticsProps {

}

const Statistics: FC<StatisticsProps> = (props: any) => {
  const { changeTableList, tableRadioGroup } = props;
  return (
    <>
      <div className="radioGroupBox">
        <Radio.Group buttonStyle="solid" onChange={changeTableList} defaultValue={''}>
          {
            tableRadioGroup.map((item: any) => {
              return (
                <Radio.Button className="radioStyle" key={item.value} value={item.value}>
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
                </Radio.Button>
              )
            })
          }
        </Radio.Group>
      </div>
    </>
  );
};

export default Statistics;