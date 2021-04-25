import React, { useState, FC, useRef, useEffect } from 'react';
import { Form, message, Modal } from 'antd'
import _ from 'lodash'
import { EnhanceModalForm } from '@/components';
import { ItemUtils } from '@/utils'

interface InvoiceProps {}

const Invoice: FC<InvoiceProps> = (props: any) => {
  const { auditApplyConditions, visible, confirmLoading, title, form, onSave }: any = props;

  const _condition = ItemUtils.getItemType(_.cloneDeep(auditApplyConditions)).extend([
    {
      title: 'price',
      componentsConfig: {
        
      }
    }
  ]).values()

  const modalProps: any = {
    form,
    visible,
    // layout: 'vertical',
    confirmLoading,
    title,
    queryCondition: auditApplyConditions,
    onSave: (values: any) => {
      onSave && onSave(values)
    },
  }

  return (
    <>
      <EnhanceModalForm {...modalProps} />
    </>
  );
};

export default Invoice;