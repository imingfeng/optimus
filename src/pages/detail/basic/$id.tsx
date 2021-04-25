import React, { useState, FC } from 'react';
import styles from './style.less';
import { Button, Modal, Skeleton, Empty, Form } from 'antd';
import { EnhanceModalForm, CardModule, EnhanceModal, LoadingModule } from '@/components';
import { connect } from 'dva';
import moment from 'moment'
import _ from 'lodash';
import { unitsPrice, formatTimestamp } from '@/utils'

import OrderTemp from './components/order'
import UserTemp from './components/user'
import RecordTemp from './components/record'

import InvoiceTemp from './components/invoice' // 修改form弹框

const { confirm } = Modal;

interface DetailProps {

}

const Detail: FC<DetailProps> = (props: any) => {
  const {
    actions,
    purchaseGoodsDetail: { auditApplyConditions, spinning, confirmLoading, detailInfo }
  }: any = props;

  const [visible, setVisible]: any = useState(false);
  const [title, setTitle]: any = useState('');
  const [form] = Form.useForm()

  const status = detailInfo.status || '' // 10 待开票，20 已开票

  const add = () => {
    setTitle('确认开票')
    form.setFieldsValue({
      realAmount: unitsPrice(detailInfo.applyAmount, true, false), // 默认可开票金额
    })
    setVisible(Symbol())
  }
  const edit = () => {
    setTitle('修改开票信息')
    form.setFieldsValue({
      confirmDate: moment(detailInfo.confirmTime),
      realAmount: unitsPrice(detailInfo.realAmount, true, false), // 已开票金额
    })
    setVisible(Symbol())
  }

  const invoiceProps = {
    confirmLoading,
    auditApplyConditions,
    visible,
    title,
    form,
    onSave: (values: any) => {
      actions.fetchConfirm({
        status,
        realAmount: unitsPrice(values.realAmount),
        confirmDate: formatTimestamp(values.confirmDate),
      })
    }
  }

  return (
    <>
      <div className={"pageTopBtn"}>
        <Button type="primary" onClick={add}>弹框</Button>
      </div>

      {/* 弹框组件 */}
      <InvoiceTemp {...invoiceProps} />

      <div className="pageBox">
        {
          spinning ? <LoadingModule /> : (
            <>
              <OrderTemp {...props} />
              <UserTemp {...props} />
              <RecordTemp {...props} />
            </>
          )
        }
      </div>
    </>
  );
};

const mapStateToProps = ({ purchaseGoodsDetail }: any) => {
  return {
    purchaseGoodsDetail,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: {
      fetchConfirm(payload: any) {
        dispatch({
          type: 'purchaseGoodsDetail/fetchConfirm',
          payload,
        })
      }
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Detail);

