import React from 'react';

export const recordList = [
  {
    title: '操作时间',
    key: 'createTime',
    type: 'datetime',
    width: 200,
  },
  {
    title: '类型',
    key: 'operateTypeStr',
    width: 200,
  },
  {
    title: '内容',
    key: 'content',
  },
  {
    title: '操作人',
    key: 'userName',
    width: 200,
    render: (text: any, { operatorName, operatorPhone }: any) => {
      return (
        <>
          <div>{operatorName || '-'}{operatorPhone ? `（${operatorPhone.slice(-4)}）` : ''}</div>
        </>
      )
    }
  },
]

