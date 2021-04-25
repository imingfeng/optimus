import React, { useState, FC, useEffect } from 'react';
import _ from 'lodash'
import { Descriptions, Typography, Tooltip } from 'antd';
import styles from './style.less';
import { unitsPrice, formatDate } from '@/utils'

const { Paragraph, Text } = Typography;

/**
 * @props 
 * { 
 *  itemList: [
 *  {
 *    key: 必填，如果为empty则当展位处理，例如想换行处理
 *    label: 显示的标题
 *    type: 'text' 类型 默认text，price 价格分、date 日期、datetime 日期+时间
 *    span: 1 
 *    value: 显示的内容，如果没有或空，则显示 -
 *    toolTips: boolean，如果true则tooltip气泡提醒
 *    render：funtion，(当前value，整个item值)，自定义value显示，例如绑定事件、显示照片等
 *  }
 * ], 
 * toolTipsClassName: tooTips的className，默认 width 350px
 * toolTipsStyle： 可自定义tooTips的style
 * }
 */

interface DescriptionsBoxProps {

}

const DescriptionsBox: FC<DescriptionsBoxProps> = (props: any) => {
  const {
    itemList = [],
    toolTipsClassName = styles.strInterception,
    toolTipsStyle = {},
  }: any = props

  const renderValue = (value: any, type: string = 'text') => {
    let valueStr = value
    switch (type) {
      case 'price':
        valueStr = `¥${unitsPrice(value, true)}`
        break;

      case 'date':
        valueStr = `${formatDate(value, false)}`
        break;

      case 'datetime':
          valueStr = `${formatDate(value)}`
          break;
    
      default:
        break;
    }

    return valueStr
  }

  return (
    <>
      <Descriptions className="descriptionsBox">
        {[...itemList].map((item: any, index: any) => (
          <Descriptions.Item key={`D_${index}`} label={item.label} span={item.span || 1}>
            {
              _.isUndefined(item.value) ? '-' : (
                item.value !== '' ? (
                  item.render ? (item.render(item.value, item)) :
                    (
                      item.toolTips && item.value && item.value != '-' ? (
                        <Tooltip placement="topLeft" title={item.value}>
                          {/* <Paragraph className={item.toolTipsClassName || styles.strInterception} style={item.toolTipsStyle || {}} ellipsis={{ rows: 1 }}>{item.value}</Paragraph> */}
                          <Text className={item.toolTipsClassName || styles.strInterception} style={item.toolTipsStyle || {}} ellipsis={true}>{item.value}</Text>
                          {/* <span className={item.toolTipsClassName || styles.strInterception} style={item.toolTipsStyle || {}}>{item.value}</span> */}
                        </Tooltip>
                      ) : renderValue(item.value, item.type)
                    )
                ) : (
                    item.key === 'empty' ? '' : '-'
                  )
              )
            }
          </Descriptions.Item>
        ))}
      </Descriptions>
    </>
  );
};

export default DescriptionsBox;
