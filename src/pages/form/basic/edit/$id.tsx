import React, { useState, FC } from 'react';
import { Form } from 'antd';

import EditFarm from '../components/editForm'

export default () => {
  const [form] = Form.useForm();

  const goodsProps = {
    edit: true,
    form,
  }

  return (
    <>
      <div className="pageTopTit">修改商品</div>
      <EditFarm {...goodsProps} />
    </>
  )
}