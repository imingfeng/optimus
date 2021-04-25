import React, { useState, FC } from 'react';
import { Form } from 'antd';

import EditFarm from '../components/editForm'

export default () => {
  const [form] = Form.useForm();

  const goodsProps = {
    form,
  }

  return (
    <>
      <div className="pageTopTit">新增商品</div>
      <EditFarm {...goodsProps} />
    </>
  )
}