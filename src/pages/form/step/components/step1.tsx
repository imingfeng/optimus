import React, { useState, FC, useEffect } from 'react';
import { connect } from 'dva';
import _ from 'lodash'
import router from 'umi/router'
import { locationCode, formatTimestamp, ItemUtils, unitsPrice, dealPicsFormat } from '@/utils'
import { ItemType, CardModule, LoadingModule } from '@/components';
import { Form, Row, Col, Button, Modal, Steps } from 'antd';

interface PageProps {

}

const Page: FC<PageProps> = (props: any) => {
  const {
    form1,
    formStep: {
      step1Conditions, detailInitialValues
    }
  }: any = props;

  const form = form1

  useEffect(() => {
    if (!_.isEmpty(detailInitialValues)) {
      form.setFieldsValue(detailInitialValues)
    }
  }, [detailInitialValues])

  const queryCondition = ItemUtils.getItemType(_.cloneDeep(step1Conditions))
    .extend([
      {
        title: 'category',
        selectCondition: [
          { label: '张三', value: 1 },
          { label: '里斯', value: 0 },
          { label: '王武', value: 12 },
          { label: '找绷', value: 13 },
        ],
      }
    ]).values()

  const infoProps = {
    form,
    queryCondition,
  }
  const formProps = {
    form,
  }

  return (
    <>
      <Form {...formProps}>
        <Row gutter={24}>
          <ItemType {...infoProps} />
        </Row>
      </Form>
    </>
  );
};

export default Page