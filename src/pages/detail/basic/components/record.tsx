import React, { useState, FC } from 'react';
import { CardModule, Table } from '@/components';
import { TableUtils } from '@/utils'

const { getColumns } = TableUtils

interface RecordProps {

}

const Record: FC<RecordProps> = (props: any) => {
  const { purchaseGoodsDetail: { spinning, logList, recordTable }} :any = props;


  const tableProps = {
    // scroll: { x: 1200 },
    rowKey: 'id',
    columns: getColumns(recordTable).values(),
    loading: spinning,
    dataSource: logList,
    pagination: false,
    style: {
      marginTop: 20,
    },
  };

  return (
    <>
      <CardModule title="操作记录">
        <Table {...tableProps} />
      </CardModule>
    </>
  );
};

export default Record;