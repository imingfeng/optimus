import React, { useState, FC, useEffect } from 'react';
import { connect } from 'dva';
import _ from 'lodash'
import router from 'umi/router'
import { locationCode, formatTimestamp, ItemUtils, unitsPrice, dealPicsFormat } from '@/utils'
import { ItemType, CardModule, LoadingModule } from '@/components';
import { Form, Row, Col, Button, Modal, Skeleton } from 'antd';

const { confirm } = Modal;

interface PageProps {

}

const Page: FC<PageProps> = (props: any) => {
  const {
    actions,
    edit,
    form,
    supplyGoods: {
      goodsConditions, spinning, productId, categoryMenusList, detailInitialValues
    }
  }: any = props;

  const [visiblePreview, setVisiblePreview]: any = useState(false)
  const [detail, setDetail]: any = useState({})

  // 编辑回填
  useEffect(() => {
    if (!_.isEmpty(detailInitialValues) && edit) {
      form.setFieldsValue(detailInitialValues)
    }
  }, [detailInitialValues])

  const queryCondition = ItemUtils.getItemType(_.cloneDeep(goodsConditions))
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

  const previewProps = {
    visible: visiblePreview,
    detail,
  }

  // 参数处理
  const handleGetParam = (cb: any) => {
    form.validateFields().then((values: { [key: string]: any }) => {
      let { productImgUrl, price, label } = values
      let params = {
        ...values,
        price: unitsPrice(price), // 价格
        label: label ? label.join(',') : undefined, // 多选菜单
        productImgUrl: productImgUrl ? dealPicsFormat(productImgUrl).join(',') : undefined, // xx图片
      }

      cb && cb(params)
    })
  }

  // 保存
  const handleSave = () => {
    handleGetParam((params: any) => {
      if (edit && productId) {
        actions.goodsUpdate(params)
      } else {
        actions.goodsAdd(params)
      }
    })
  }

  // 取消
  const handleCancelForm = () => {
    confirm({
      title: '信息尚未保存，确认返回吗？',
      okType: 'danger',
      onOk() {
        let pathname = '/form/basic'
        if (edit && productId) {
          // pathname = `/form/basic/detail/${productId}` // 跳转到详情页
        }
        router.push({
          pathname,
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  return (
    <>
      {
        spinning ? <LoadingModule /> : (
            <Form {...formProps}>
              <div className="pageBox">
                <CardModule title="商品信息">
                  <Row gutter={24}>
                    <ItemType {...infoProps} />
                  </Row>
                </CardModule>
              </div>
              <div className="fromBtnBox">
                <Row gutter={24} justify='end'>
                  <Col style={{ float: 'right' }}>
                    <Button className="mr15" onClick={handleCancelForm}>返回</Button>
                    <Button type="primary" loading={spinning} onClick={handleSave}>保存</Button>
                  </Col>
                </Row>
              </div>
            </Form>
          )
      }
    </>
  );
};

const mapStateToProps = ({ supplyGoods }: any) => {
  return {
    supplyGoods,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: {
      goodsAdd(payload: any) {
        dispatch({
          type: 'supplyGoods/goodsAdd',
          payload,
        })
      },

      goodsAddOnShelf(payload: any) {
        dispatch({
          type: 'supplyGoods/goodsAddOnShelf',
          payload,
        })
      },

      goodsUpdate(payload: any) {
        dispatch({
          type: 'supplyGoods/goodsUpdate',
          payload,
        })
      },
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page);
