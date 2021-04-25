import React, { useState, FC } from 'react';
import { unitsPrice } from '@/utils'

// 订单信息
export const orderInfoConfig = [
  {
    key: 'applyNo',
    label: '单据编号',
    value: '',
  },
  {
    key: 'orderNo',
    label: '关联订单编号',
    value: '',
    render: (text: any, { id }: any) => {
      let url = `/purchase/order/detail/${text}`
      return (
        <>
          <a href={url} target="_blank">{text}</a>
        </>
      )
    }
  },
  {
    key: 'typeStr',
    label: '发票类型',
    value: '',
  },
  {
    key: 'statusStr',
    label: '状态',
    value: ''
  },
  {
    key: 'createTime',
    label: '申请时间',
    value: '',
  },
  {
    key: 'applyAmount',
    label: '可开票金额',
    value: '',
    type: 'price'
  },
];

// 用户信息
export const userInfoConfig = [
  {
    key: 'drawerName',
    label: '蜂友姓名',
    value: '',
    toolTips: true,
  },
  {
    key: 'idCardNo',
    label: '身份证',
    value: '图片',
  },
];

// 已开票信息
export const invoiceInfoConfig = [
  {
    key: 'confirmTime',
    label: '开票时间',
    value: '',
    type: 'date'
  },
  {
    key: 'realAmount',
    label: '开票金额',
    value: '',
    type: 'price'
  },
]
