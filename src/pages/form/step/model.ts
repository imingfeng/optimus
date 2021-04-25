import services from './service';
import _ from 'lodash';
import { Model, ItemUtils, unitsPrice } from '@/utils'
import { step2Conditions, step1Conditions } from './config/formFields'
import router from 'umi/router';

const initState = {
  filterCondition: [],
  tableRadioGroup: [],
  step2Conditions: _.cloneDeep(step2Conditions),
  step1Conditions: _.cloneDeep(step1Conditions), // 步骤1配置
  fields: [],

  categoryMenusList: [], // 商品分类下拉菜单

  productId: null, // 商品id
  detailInitialValues: {}, // 修改表单初始值
}

export default Model.extend({
  namespace: 'formStep',
  state: _.cloneDeep(initState),
  subscriptions: {
    setup({ dispatch, listen }: any) {
      listen('/supply/goods/add', ({ params }: any) => {
        dispatch({
          type: 'updateState',
          payload: {
            ..._.cloneDeep(initState),
          }
        })

        dispatch({ type: 'fetchConfig' })
      })

      listen('/form/basic/edit/:id', ({ params }: any) => {
        const productId = Number(params[0])

        dispatch({
          type: 'updateState',
          payload: {
            ..._.cloneDeep(initState),
            productId,
          }
        })

        // dispatch({ type: 'fetchConfig' })
        dispatch({ type: 'fetchDetail' });
      })
    }
  },
  effects: {
    // 获取详情
    * fetchDetail({ payload }: any, { callWithSpinning, select, update, put }: any) {
      let { productId } = yield select((_: any) => _.supplyGoods);
      // const detailInfo = yield callWithSpinning(services.goodsDetail, {
      //   productId,
      //   ...payload,
      // })

      const detailInfo = {
        name: '可了解对方',
        category: [1, 0],
        price: 12323,
        productListImgUrl: ['https://zyp-farm-2.oss-ap-southeast-1.aliyuncs.com/data/fc-bee/attach/trade/product/1601175572084.jpg'],
      }

      yield update({
        detailInfo
      })

      yield put('updateDetails')
    },

    // 商品分类、商品标签 下拉菜单
    * fetchConfig({ payload }: any, { call, update }: any) {
      let categoryMenusList: any = []

      const list = yield call(services.fetchConfig, { codes: '30001,30002', ...payload });
      list.map(({ code, key, value }: any) => {
        let item = {
          value: key,
          label: value,
        }
        if (code === '30001') {
          categoryMenusList.push(item)
        }
      })

      yield update({
        categoryMenusList,
      })
    },

    // 添加商品
    * goodsAdd({ payload }: any, { callWithSpinning, select, put }: any) {
      const data = yield callWithSpinning(services.goodsAdd, { ...payload }, {
        successMsg: '添加成功'
      });
      router.push({
        pathname: `/supply/goods/detail/${data.id}`,
      });
    },

    // 编辑商品
    * goodsUpdate({ payload }: any, { callWithSpinning, select, put }: any) {
      let { productId } = yield select((_: any) => _.supplyGoods);
      const data = yield callWithSpinning(services.goodsUpdate, { id: productId, ...payload }, {
        successMsg: '修改成功'
      });
      router.push({
        pathname: `/supply/goods/detail/${productId}`,
      });
    },
  },
  reducers: {
    updateDetails(state: any) {
      const { detailInfo } = state;
      const { 
        name, title, brand, category, supplierId, 
        label, price, sortNo, productListImgUrl, productImgUrl,
      } = detailInfo

      // 商品标签
      let labelInit: any = []
      !_.isEmpty(label) && label.map(({ value }: any) => {
        labelInit.push(value)
      })

      // 列表图
      let productListImgUrlInit: any = []
      !_.isEmpty(productListImgUrl) && productListImgUrl.map((url: string) => {
        productListImgUrlInit.push({
          uid: `${(new Date()).getTime()}_${Math.random()}`,
          status: 'done',
          url,
        })
      })

      // 产品图片
      let productImgUrlInit: any = []
      !_.isEmpty(productImgUrl) && productImgUrl.map((url: string) => {
        productImgUrlInit.push({
          uid: `${(new Date()).getTime()}_${Math.random()}`,
          status: 'done',
          url,
        })
      })


      let detailInitialValues = {
        name,
        category,
        supplierId,
        label: labelInit,
        price: unitsPrice(price, true, false),
        sortNo,
        productListImgUrl: productListImgUrlInit,
        productImgUrl: productImgUrlInit,
      }

      return {
        ...state,
        detailInitialValues,
      }
    }
  }
})
