import React, { FC } from 'react'
import _ from 'lodash'
import { TableUtils } from '@/utils'
import { Table } from '@/components';

const { getColumns } = TableUtils;

interface StatisticsProps {

}

const Statistics: FC<StatisticsProps> = (props: any) => {
  const { fields, list } = props

  const tableProps = {
    scroll: { x: 1200 },
    rowKey: 'swarmNum',
    columns: getColumns(fields).extend([]).values(),
    loading: false,
    dataSource: list,
    pagination: false,
    style: {
      marginTop: 20,
    },
  };

  return (
    <>
      <div className="contentPrimary">
        <h2 className="commonTit">蜂友所属蜂场分布</h2>
        <Table {...tableProps} />
      </div>
    </>
  );
};

export default Statistics;