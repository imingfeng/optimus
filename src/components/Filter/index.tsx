/* global document */
import React, { useImperativeHandle, useState } from 'react';
import { Button, Col, Row, Form } from 'antd';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { icon } from '@/config';
import ItemType from '@/components/ItemType';
import styles from './Filter.less';
import _ from 'lodash';
import { trimValues } from '@/utils';

interface IProps {
  queryCondition: any;
  onSearch: any;
  onReset: any;
  spinning: boolean;
  form?: any;
  filterId?: string;
  ColProps?: any;
  onExport?: any;
  formInitialValues?: any;
  floatFlag?: any;
  filterText?: any;
  formRef?: any;
  noIcon?: boolean;
  layout?: any;
}

const formItemLayout = {
  labelCol: {
    xs: 4,
    sm: 4,
    md: 10,
    xl: 7,
    xxl: 7,
  },
  wrapperCol: { span: 16 },
  style: {
    marginBottom: 0,
  },
};

const ColProps = {
  xs: 24,
  sm: 12,
  md: 4,
  xl: 4,
  xxl: 4,
  style: {
    marginBottom: 20,
  },
  size: 'small',
};

const Filter = (props: IProps) => {
  let [form] = Form.useForm();
  const {
    ColProps,
    queryCondition,
    onSearch,
    onReset,
    filterId,
    spinning,
    noIcon,
    onExport,
    formInitialValues,
    floatFlag,
    filterText,
    formRef,
    layout = 'horizontal', // horizontal | vertical | inline
  } = props;
  const { getFieldsValue, resetFields } = form;
  let userIsMember = localStorage.getItem('userIsMember')
  const handlerSearch = () => {
    // 当字符串超过200 做截取处理
    let len = 200;
    const fields = trimValues(getFieldsValue());
    const data = Object.keys(fields).reduce((obj, key, index) => {
      if (fields[key] !== undefined && fields[key] !== null && fields[key] !== '') {
        obj[key] =
          _.isString(fields[key]) && fields[key].length > len
            ? fields[key].slice(0, 200)
            : fields[key];
      }
      return obj;
    }, {});
    onSearch(data);
  };
  const handlerReset = () => {
    resetFields();
    onReset && onReset();
  };

  const handlerExport = () => {
    onExport && onExport();
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  }

  let resetDom: any = '';

  if (onReset) {
    resetDom = (
      <Col style={{ float: 'right', padding: '0' }}>
        <Button className="btn-diy-size" onClick={handlerReset} icon={!noIcon ? <RedoOutlined /> : ''}>
          重置
        </Button>
      </Col>
    );
  }

  let exportDom: any = '';

  if(onExport && userIsMember && userIsMember === 'true') {
    exportDom = (
      <a className={styles.exportContainer} onClick={handlerExport}>
        导出
      </a>
    )
  }

  return (
    <div className={styles.fiterContainer} id={filterId}>
      <Form
        form={form}
        ref={formRef}
        onFinish={handlerSearch}
        onFinishFailed={onFinishFailed}
        layout={layout}
        initialValues={formInitialValues}
      >
        <Row gutter={24} style={{ margin: '0' }}>
            <ItemType
              {...{
                ColProps,
                queryCondition,
                filterId,
                formItemLayout,
                form,
              }}
            />
          <Col flex="auto">
              <Col style={{ padding: '0 8px 0 0', float: floatFlag ? 'left' : 'right' }}>
                <Button
                  style={{ marginRight: '10px', marginLeft: '44px' }}
                  loading={spinning}
                  className="btn-diy-size"
                  type="primary"
                  htmlType="submit"
                >
                  {!spinning && !noIcon ? icon.search : null}查询
                </Button>
              {exportDom}
              {resetDom}
              </Col>
              {
                filterText && <Col style={{ float: 'right', lineHeight: '48px' }}>{filterText}</Col>
              }
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Filter;

Filter.defaultProps = {
  filterId: 'js_filter_box',
  spinning: false,
  ColProps: {
    xs: 24,
    sm: 12,
    md: 4,
    xl: 4,
    xxl: 4,
    style: {
      marginBottom: 20,
    },
    size: 'small',
    noIcon: false
  }
}
