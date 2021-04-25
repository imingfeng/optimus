import React, { useState, FC } from 'react';
import { Table } from '@/components';
import { TableUtils } from '@/utils';
import { Modal, Divider } from 'antd';

const { getColumns } = TableUtils;
const { confirm } = Modal;

interface ListProps {

}

const List: FC<ListProps> = (props: any) => {
  const { spinning, fields, pagination, list, onChange }: any = props;

  const paginationProps = {
    ...pagination,
    showTotal: (tc: number) => `总共 ${tc} 条`,
  }

  const extraColumns = [
    {
      key: 'operate',
      name: '操作',
      width: 70,
      fixed: 'right',
      render: (text: any, { id, status }: any) => {
        return (
          <>
            <a href="/details">查看</a>
          </>
        )
      }
    }
  ]

  const tableProps = {
    scroll: { x: 1200 },
    rowKey: 'id',
    columns: getColumns(fields).extend(extraColumns).values(),
    loading: spinning,
    dataSource: list,
    pagination: paginationProps,
    style: {
      marginTop: 20,
    },
    onChange,
  };

  return (
    <>
      <Table {...tableProps} />
    </>
  );
};

export default List;
