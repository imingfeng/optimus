import React, { useState, FC } from 'react';
import { Form } from 'antd';

import EditFarm from '../components/editForm'

export default () => {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();

  const goodsProps = {
    form1,
    form2,
  }

  return (
    <>
      <div className="pageTopTit">分步表单</div>
      <EditFarm {...goodsProps} />
    </>
  )
}