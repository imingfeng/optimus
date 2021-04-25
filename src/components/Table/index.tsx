import { Table } from 'antd';
import React from 'react';
import styles from './index.less';
import { source } from '@/config';

export interface COMtableProps {
  dataSource?: any[]
  emptyText?: string
}

const COMTable: React.FC<COMtableProps> = (props) => {
  const { dataSource, emptyText } = props

  const tableProps = {
    // bordered: true,
    ...props,
  }

  return (
    <div className={styles.commTable}>
      <Table {...tableProps} />
      {dataSource && !dataSource.length && (
        <div className={styles.noList}>
          <img src={source.noData} alt="No data" />
          <p>{emptyText || '暂无数据'}</p>
        </div>
      )
      }
    </div>
  )
}

export default COMTable
