import React, { useState, FC } from 'react';
import { Table } from '@/components';
import { TableUtils } from '@/utils';
import { Modal, Divider, Button, Form } from 'antd';
import { icon } from '@/config'

import FormEditTemp from './formEdit'

const { getColumns } = TableUtils;
const { confirm } = Modal;

interface ListProps {

}

const List: FC<ListProps> = (props: any) => {
  const { spinning, fields, pagination, list, onChange, confirmLoading, actions, formEditConditions }: any = props;

  const [visible, setVisible]: any = useState(false);
  const [title, setTitle]: any = useState('');
  const [form] = Form.useForm()

  const add = () => {
    setTitle('确认开票')
    setVisible(Symbol())
  }
  const edit = () => {
    setTitle('修改开票信息')
    form.setFieldsValue({
      tagname: ['土包子']
    })
    setVisible(Symbol())
  }
  // 弹框参数
  const editModelProps = {
    confirmLoading,
    formConditions: formEditConditions,
    visible,
    title,
    form,
    onSave: (values: any) => {
      // actions.fetchConfirm({
      //   realAmount: unitsPrice(values.realAmount),
      //   confirmDate: formatTimestamp(values.confirmDate),
      // })
    }
  }

  // 删除
  const del = () => {
    Modal.confirm({
      title: '确认删除吗？',
      content: '正文，可以不需要',
      okType: 'danger',
      centered: true,
      onOk() {
        console.log('OK');
      },
    });
  }

  const paginationProps = {
    ...pagination,
    showTotal: (tc: number) => `总共 ${tc} 条`,
  }

  const extraColumns = [
    {
      key: 'operate',
      name: '操作',
      width: 120,
      fixed: 'right',
      render: (text: any, { id, status }: any) => {
        return (
          <>
            <span className="linkBtn" onClick={edit}>编辑</span><Divider type="vertical" />
            <span className="linkBtn" onClick={del}>删除</span>
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
      {/* 弹框组件 */}
      {/* <FormEditTemp {...editModelProps} /> */}
      <h2 className="commonTit" style={{ display: 'inline', lineHeight: '32px' }}>品牌列表</h2>
      <Button type="primary" style={{ float: 'right' }} icon={icon.plus} onClick={add}>添加品牌</Button>
      <Table {...tableProps} />
    </>
  );
};

export default List;
