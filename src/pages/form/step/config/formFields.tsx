import moment from 'moment';
import { message } from 'antd';
import { api } from '@/config'
import { reg } from '@/utils'

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
  style: {
    marginBottom: 12
  }
};

const ColConfig = {
  // xs: 24, // <576
  // sm: 24, // >= 576
  // md: 12, // >= 768
  // lg: 12, // >= 992
  // xl: 12, // >= 1200
  // xxl: 8, // >= 1600
  span: 24
}

const ColConfigRow = {
  span: 24
}

const { base } = api

const imgFormat = ['image/jpeg', 'image/jpg', 'image/png']
const imageValidate = (file: any) => {
  if (!imgFormat.includes(file.type)) {
    message.error('图片格式只能为jpeg/jpg/png');
    return Promise.reject('error');
  }
  if (imgFormat.includes(file.type) && (file.size > 1024 * 1024 * 5)) {
    message.error('图片大小不能超过5M');
    return Promise.reject('error');
  }
}

// 步骤1-form配置项
export const step1Conditions = [
  {
    inputType: 'input',
    title: 'name',
    label: '文本输入框',
    itemConfig: {
      rules: [{
        required: true,
        message: '请输入商品名称'
      }]
    },
    componentsConfig: {
      placeholder: '请输入',
      maxLength: 20,
      autoComplete: 'off'
    },
    formItemLayout,
    ColConfig: ColConfigRow,
  },
  {
    inputType: 'select',
    title: 'category',
    label: '接口获取多选（可搜索）',
    itemConfig: {
      rules: [
        {
          required: true, message: '请选择'
        },
      ]
    },
    formItemLayout,
    ColConfig,
    componentsConfig: {
      placeholder: '请选择',
      mode: 'multiple',
    },
    selectCondition: []
  },
  {
    inputType: 'select',
    title: 'simpleSelect',
    label: '单选',
    itemConfig: {
      rules: [
        {
          required: true, message: '请选择'
        },
      ]
    },
    formItemLayout,
    ColConfig,
    componentsConfig: {
      placeholder: '请选择',
    },
    selectCondition: [
      { label: '是', value: 1 },
      { label: '否', value: 0 }
    ]
  },
  {
    inputType: 'countryAddress',
    title: 'location',
    label: '地址选择',
    componentsConfig: {
      placeholder: '请选择商品产地',
      // changeOnSelect: false, // 必须选择最后一级
    },
    formItemLayout,
    ColConfig,
  },
  {
    inputType: 'input',
    title: 'price',
    label: '自定义规则',
    itemConfig: {
      rules: [{
        required: true,
        message: '请输入商品出售价格'
      }, {
        validator: (rule: any, value: any) => {
          if (value && !reg.fiveMaxTwoPoint.test(value)) {
            return Promise.reject('请输入最多五位整数或最多两位小数的数字');
          }
          return Promise.resolve();
        }
      }]
    },
    componentsConfig: {
      placeholder: '请输入',
      maxLength: 8,
      autoComplete: 'off',
      prefix: '¥',
    },
    formItemLayout,
    ColConfig,
  },
]

export const step2Conditions = [
  {
    inputType: 'rangeInput',
    title: 'stHiveNum',
    title2: 'edHiveNum',
    label: '范围',
    componentsConfig: {
      placeholder: '请输入',
      maxLength: 5,
      autoComplete: 'off',
    },
    componentsConfig2: {
      placeholder: '请输入',
      maxLength: 5,
      autoComplete: 'off',
    },
    formItemLayout,
    ColConfig,
  },
  {
    inputType: 'rangePicker',
    title: 'createDate',
    label: '时间范围',
    formItemLayout,
    ColConfig,
    componentsConfig: {
      allowClear: false,
      format: 'YYYY-MM-DD',
      disabledDate: (current: any) => {
        return current && current > moment().endOf('day');
      },
    }
  },
  {
    inputType: 'datePicker',
    title: 'joinDate',
    label: '单个时间',
    componentsConfig: {
      placeholder: '请选择',
    },
    formItemLayout,
    ColConfig,
  },
  {
    inputType: 'picturesWallCrop',
    title: 'productListImgUrl',
    label: '裁剪图',
    itemConfig: {
      rules: [
        {
          required: true,
          message: '请上传照片'
        },
      ]
    },
    componentsConfig: {
      action: base.attachUpload,
      data: {
        type: 19
      },
      limit: 1,
      aspect: 5 / 4
    },
    formItemLayout,
    ColConfig: ColConfigRow,
  },
  {
    inputType: 'picturewall',
    title: 'productParamImgUrl',
    label: '图片上传',
    itemConfig: {
      rules: [
        {
          required: true,
          message: '请上传照片'
        },
      ]
    },
    componentsConfig: {
      action: base.attachUpload,
      data: {
        type: 19
      },
      limit: 4,
      beforeUpload: (file: any) => {
        return imageValidate(file)
      },
    },
    formItemLayout,
    ColConfig: ColConfigRow,
  },
]