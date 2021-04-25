import React from 'react';
import ItemType from '@/components/ItemType';
import { Row, Col, Button, Form } from 'antd';
import styles from './index.less';
import _ from 'lodash';

interface IProps {
  queryCondition: [];
  onSave: any;
  onCancel: any;
  saveText?: string;
  footerText?: string[];
  isValidateOnCancel?: boolean;
  containerStyle?: any;
  isShowButton?: boolean;
  buttonStyle?: any;
  formInitialValues?: any;
  formRef?: any
}

const FormItem: React.FC<IProps> = (props) => {
  const {
    isValidateOnCancel,
    queryCondition,
    onSave,
    saveText,
    onCancel,
    containerStyle,
    isShowButton = true,
    footerText = ['保存', '取消'],
    formInitialValues,
    formRef,
  } = props;

  const [form] = Form.useForm();

  const { getFieldsValue, validateFields } = form;
  const { rowStyle, colStyle } = props.buttonStyle;
  const handlerSave = () => {
    validateFields()
      .then(values => {
        // 保存
        const data = getFieldsValue();
        const { time } = data;
        if (time && time.length) {
          data.startDate = time[0].format('YYYY-MM-DD');
          data.endDate = time[1].format('YYYY-MM-DD');
        }
        _.isFunction(onSave) && onSave(data);
      })
      .catch(errorInfo => {
        console.log(`${errorInfo}验证不通过!`);
      });

  };
  // 取消
  const handlerCancel = () => {
    validateFields()
      .then(values => {
        // 保存
        _.isFunction(onCancel) && onCancel(getFieldsValue());
      })
      .catch(errorInfo => {
        _.isFunction(onCancel) && onCancel(getFieldsValue());
      });
  };
  return (
    <>
      <div className={styles.container} style={containerStyle} id="js_filter_box">
        <Form
          form={form}
          ref={formRef}
          onFinish={handlerSave}
          layout={'horizontal'}
          initialValues={formInitialValues}
        >
          <Row gutter={24} justify="start">
            <ItemType
              {...{
                queryCondition,
                form,
              }}
            />
          </Row>
          {isShowButton ? (
            <div style={{ marginTop: '20px' }}>
              <Row {...rowStyle}>
                <Col {...colStyle[0]}>
                  <Button className="btn-diy-size" type="primary" htmlType="submit">
                    {saveText ? saveText : footerText[0]}
                  </Button>
                </Col>
                <Col {...colStyle[1]}>
                  <Button className="btn-diy-size" onClick={handlerCancel}>
                    {footerText[1]}
                  </Button>
                </Col>
              </Row>
            </div>
          ) : null}
        </Form>
      </div>
    </>
  );
};

FormItem.defaultProps = {
  isShowButton: true,
  buttonStyle: {
    rowStyle: { gutter: 24, type: 'flex', justify: 'center' },
    colStyle: [
      {
        style: {
          paddingRight: '13px',
          float: 'right',
        },
      },
      {
        style: {
          paddingRight: '13px',
          float: 'right',
        },
      },
    ],
  },
  footerText: ['保存', '取消'],
};

export default FormItem;
