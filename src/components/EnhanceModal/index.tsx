import React, { Component } from 'react'
import { Modal, Button } from 'antd'
import { trimValues } from '@/utils'
import styles from './index.less'

type CReceiveProps = {
  visible: any,
  confirmLoading: any
}

interface IProps {
  visible: boolean;
  form: any;
  onOk: Function;
  onCancel?: Function;
  closable?: boolean;
  confirmLoading?: boolean;
  onCustomCancel?: any;
  okText?: string;
  cancleText?: string;
  cancleFlag?: boolean;
  okFlag?: boolean;
  footer?: any;
}

interface IState {
  visible: boolean,
}

export default class EnhanceModal extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    const { visible } = this.props;
    this.state = {
      visible: Boolean(visible),
    };
  }

  UNSAFE_componentWillReceiveProps({ visible, confirmLoading } : CReceiveProps) {
    if (visible === false) {
      return this.setState({ visible });
    }
    if (visible && visible !== this.props.visible) {
      return this.setState({ visible: true });
    }
    if (
      confirmLoading !== undefined &&
      confirmLoading.valueOf() === false &&
      this.props.confirmLoading &&
      this.props.confirmLoading.valueOf()
    ) {
      if (!confirmLoading.hasOwnProperty('done') || confirmLoading.done) {
        this.setState({
          visible: false,
        });
      }
    }
  }

  handleCancel = ():void => {
    if (this.props.onCustomCancel) {
      this.props.onCustomCancel();
      // return false;
    }
    if (this.props.onCancel) {
      this.props.onCancel();
    }

    this.setState({
      visible: false,
    });
  };

  handleOk = () => {
    const { confirmLoading, form, onOk } = this.props;
    const hideModal = () => {
      // 如果没有设置confirmLoading,则直接关闭窗口
      if (confirmLoading === undefined) {
        this.handleCancel();
      }
    };

    if (onOk && form) {
      const { validateFields } = form;
      validateFields()
        .then((values: any) => {
          // 保存
          onOk(trimValues(values));
          hideModal();
        })
        .catch((errorInfo: any) => {
          console.log(`${errorInfo}验证不通过!`);
        });
      // validateFields((errors: any, values: any) => {
      //   if (errors) {
      //     console.log('errors');
      //   } else {
      //     // onOk(values);
      //     onOk(trimValues(values));
      //     hideModal();
      //   }
      // });
    } else {
      onOk && onOk();
      hideModal();
    }
  };

  render() {
    let { 
      confirmLoading = false, closable = true, 
      okText = '确认', cancleText = '取消', 
      cancleFlag = true, footer, wrapClassName = 'commonDialog', bodyStyle = {} 
    }: any = this.props;

    if (confirmLoading !== undefined) {
      confirmLoading = confirmLoading.valueOf();
    }
    const footerNode = (
      <div className={styles.operationBtns}>
        {cancleFlag && <Button onClick={this.handleCancel}>{cancleText}</Button>}
        <Button type="primary" loading={confirmLoading} onClick={this.handleOk}>{okText}</Button>
      </div>
    )
    const modalProps = {
      centered: true,
      maskClosable: false,
      getContainer: false,
      footer: footerNode,
      ...this.props,
      confirmLoading,
      closable,
      visible: true,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
      wrapClassName,
      bodyStyle: { padding: '0 24px', ...bodyStyle }
    };
    return <div>{this.state.visible && <Modal {...modalProps}>{this.props.children}</Modal>}</div>;
  }
}
