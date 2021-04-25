import React, {useState, useEffect} from 'react';
import ItemType from '@/components/ItemType';
import { Row, Col, Button, Form, Modal } from 'antd';
import styles from './index.less';
import { trimValues } from '@/utils'
import _ from 'lodash';

interface IProps {
  queryCondition: [];
  onSave: any;
  onCancel: any;
  footerText?: string[];
  isValidateOnCancel?: boolean;
  confirmLoading?: boolean,
  closable?: boolean,
  visible?: boolean,
  onCustomCancel?: any,
  saveText?: string;
  containerStyle?: any;
  isShowButton?: boolean;
  buttonStyle?: any;
  formInitialValues?: any;
  canCelFlag?: boolean
}

const EnhanceModalForm: React.FC<IProps> = (props: any) => {
  let {
    isValidateOnCancel,
    queryCondition,
    onSave,
    formRef,
    saveText,
    onCancel,
    canCelFlag = true,
    containerStyle,
    isShowButton = true,
    footerText = ['保存', '取消'],
    confirmLoading=false,
    closable = true,
    formInitialValues,
    layout = 'horizontal',
    maxBodyHeight = 0,
  } = props;

  let [visible, setVisible] = useState(props.visible)

  let [form] = Form.useForm();
  if (props.form) {
    form = props.form;
  }
  const { getFieldsValue, validateFields, resetFields } = form;

  useEffect(() => {
    if (props.confirmLoading && props.confirmLoading.done === true) {
      setVisible(false)
      resetFields()
    }
  }, [props.confirmLoading])

  useEffect(() => {
    setVisible(props.visible);
  }, [props.visible])

  const handlerSave = () => {
    // 如果没有设置confirmLoading,则直接关闭窗口
    const hideModal = () => {
      if (confirmLoading === undefined) {
        handlerCancel()
      }
    }
    if(onSave && form) {
      validateFields().then(values => {
        // 保存
        const data = getFieldsValue();
        const { time } = data;
        if (time && time.length) {
          data.startDate = time[0].format('YYYY-MM-DD');
          data.endDate = time[1].format('YYYY-MM-DD');
        }
        _.isFunction(onSave) && onSave(trimValues(data));

        hideModal()
        // handlerCancel()
        // resetFields()
      })
      .catch(errorInfo => {
        console.log(`${errorInfo}验证不通过!`);
      });
    } else {
      onSave && onSave();
      hideModal();
    }
  };

  // 取消
  const handlerCancel = () => {
    if (props.onCustomCancel) {
      props.onCustomCancel();
    }
    if (props.onCancel) {
      props.onCancel();
    }
    setVisible(false)
    resetFields()
  };

  const modalProps = {
    centered: true,
    maskClosable: false,
    getContainer: false,
    ...props,
    confirmLoading,
    closable,
    visible,
    footer: null,
    onCancel: handlerCancel,
    wrapClassName: 'commonDialog',
    bodyStyle: { padding: 0 }
  };

  if (confirmLoading !== undefined) {
    confirmLoading = confirmLoading.valueOf();
  }

  const formProps = {
    form,
    ref: formRef,
    layout,
    onFinish: handlerSave,
    initialValues: formInitialValues,
  }

  let bodayBodyStyle = {}
  if (maxBodyHeight) {
    bodayBodyStyle = {
      maxHeight: maxBodyHeight,
      overflowY: 'auto',
    }
  }

  return (
    <>
      <Modal {...modalProps}>
        <div className={styles.modalBody}>
          {props.children}
        </div>
        <div style={containerStyle} id="js_filter_box">
          <Form {...formProps}>
           <div className={styles.modalBody} style={bodayBodyStyle}>
            <Row gutter={24} justify="start">
                <ItemType
                  {...{
                    queryCondition,
                    form,
                  }}
                />
            </Row>
              {
                props.footTipsNode && (
                  props.footTipsNode
                )
              }
           </div>
            {isShowButton ? (
              <div className={styles.operationBtns}>
                {
                  canCelFlag ?
                  <Button className="btn-diy-size" onClick={handlerCancel} style={{marginRight: '12px'}}>
                    {footerText[1]}
                  </Button> : ''
                }
                <Button className="btn-diy-size" type="primary" loading={confirmLoading} htmlType="submit">
                  {saveText ? saveText : footerText[0]}
                </Button>
              </div>
            ) : null}
          </Form>
        </div>
      </Modal>
    </>
  );
};

EnhanceModalForm.defaultProps = {
  isShowButton: true,
  canCelFlag: true,
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

export default EnhanceModalForm;
