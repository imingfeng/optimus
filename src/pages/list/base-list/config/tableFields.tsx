import React from 'react';
import Link from 'umi/link';
import { BLACK_ENUM } from './enum';
import { unitsSeparate, unitsPrice, locationStr } from '@/utils'
import _ from 'lodash'

export const tableList = [
  {
    title: '商品名称',
    key: 'name',
    width: 180,
  },
  {
    title: '所属位置',
    key: 'site',
    width: 180,
    render: (text: any, record: any) => {
      return (
        <>
          {locationStr(record) || '-'}
        </>
      )
    }
  },
  {
    title: '时间排序',
    key: 'sales',
    width: 120,
    sorter: {
      compare: (a: any, b: any) => a.lastLocation - b.lastLocation
    },
    render: (text: number) => {
      return (
        <div>{_.isUndefined(text) ? '-' : unitsSeparate(text)}</div>
      )
    }
  },
  {
    title: '上线时间',
    key: 'onShelfTime',
    type: 'datetime',
    width: 200,
  },
  {
    title: '是否黑名单',
    key: 'isBlack',
    width: 100,
    enums: BLACK_ENUM
  },
  {
    title: '价格',
    key: 'price',
    width: 150,
    type: 'price'
  },
]

