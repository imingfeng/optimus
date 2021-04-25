import React, { useState, FC, useEffect } from 'react';
import { connect } from 'dva';
import _ from 'lodash'
import router from 'umi/router'
import { locationCode, formatTimestamp, ItemUtils, unitsPrice, dealPicsFormat } from '@/utils'
import { ItemType, CardModule, LoadingModule } from '@/components';
import { Form, Row, Col, Button, Modal, Steps, Tabs } from 'antd';

import Step1Temp from './step1' // 步骤1组件
import Step2Temp from './step2' // 步骤2组件

const { confirm } = Modal;
const { Step } = Steps;
const { TabPane } = Tabs;

interface PageProps {

}

const Page: FC<PageProps> = (props: any) => {
  const {
    actions,
    edit,
    form1,
    form2,
    formStep: {
      goodsConditions, spinning, productId, categoryMenusList, detailInitialValues
    }
  }: any = props;

  const [detail, setDetail]: any = useState({})
  const [currentStep, setCurrentStep]: any = useState(1) // 步骤index
  const [formValue, setFormValue]: any = useState({}) // form填写

  // 编辑回填
  // useEffect(() => {
  //   if (!_.isEmpty(detailInitialValues)) {
  //     form.setFieldsValue(detailInitialValues)
  //   }
  // }, [detailInitialValues])

  // 保存
  const handleSave = () => {
    form2.validateFields().then((values: { [key: string]: any }) => {
      let { productImgUrl, price, label } = values
      let params = {
        ...formValue,
        ...values,
        price: unitsPrice(price), // 价格
        label: label ? label.join(',') : undefined, // 多选菜单
        productImgUrl: productImgUrl ? dealPicsFormat(productImgUrl).join(',') : undefined, // xx图片
      }

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
        // router.push({
        //   pathname,
        // });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  // 下一步
  const nextStep = () => {
    form1.validateFields().then((values: { [key: string]: any }) => {
      setCurrentStep(currentStep + 1)
      setFormValue({
        ...formValue,
        ...values,
      })
    })
  }
  // 上一步
  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }
  

  const styleTab = {
    width: '80%',
    margin: '0 auto',
    minHeight: '68vh',
  }

  return (
    <>
      {
        spinning ? <LoadingModule /> : (
          <>
            <div className="pageBox">
              <CardModule title="">
                <Steps current={currentStep - 1} style={{ width: '50%', margin: '0 auto' }}>
                  <Step title="第一步" description="完善基本资料" />
                  <Step title="第二步" description="详细信息补充" />
                </Steps>

                <Tabs activeKey={`${currentStep}`} animated={true}>
                  <TabPane key="1">
                    <div style={styleTab}>
                      <Step1Temp {...props} />
                    </div>
                  </TabPane>
                  <TabPane key="2">
                    <div style={styleTab}>
                      <Step2Temp {...props} />
                    </div>
                  </TabPane>
                </Tabs>
              </CardModule>
            </div>

            <div className="fromBtnBox">
              <Row gutter={24} justify='end'>
                <Col style={{ float: 'right' }}>
                  <Button onClick={handleCancelForm}>取消</Button>
                  {
                    currentStep !== 1 && <Button className="ml15" onClick={prevStep}>上一步</Button>
                  }

                  {
                    currentStep !== 2 && <Button type="primary" className="ml15" onClick={nextStep}>下一步</Button>
                  }
                  
                  {
                    currentStep === 2 && <Button type="primary" className="ml15" loading={spinning} onClick={handleSave}>提交</Button>
                  }

                </Col>
              </Row>
            </div>
          </>
        )
      }
    </>
  );
};

const mapStateToProps = ({ formStep }: any) => {
  return {
    formStep,
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
