import React, { useState, FC, useEffect } from 'react';
import _ from 'lodash'
import { CardModule, DescriptionsBox } from '@/components';

interface OrderProps {

}

const Order: FC<OrderProps> = (props: any) => {
  const { purchaseGoodsDetail: { orderInfoConfig } }: any = props;
  const orderListProps = {
    itemList: orderInfoConfig
  }

  return (
    <>
      <CardModule title="模块名称">
        <DescriptionsBox {...orderListProps} />
      </CardModule>
    </>
  );
};

export default Order;
