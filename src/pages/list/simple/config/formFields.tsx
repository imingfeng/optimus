import _ from 'lodash'
import moment from 'moment'
import { message } from 'antd'
import { reg } from '@/utils'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 24 },
  style: {
    marginBottom: 12
  }
};

const ColConfig = {
  span: 24
}

export const formEditConditions = [
  {
    inputType: 'radio',
    title: 'realAmount',
    label: '单选类型',
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
      options: [
        { label: '苹果', value: 'Apple' },
        { label: '香蕉', value: 'Pear' },
        { label: '草莓', value: 'caomei' },
      ]
    }
  },
  {
    inputType: 'switch',
    title: 'switchkey',
    label: '开关',
    itemConfig: {
      rules: [
        {
          required: true, message: '请选择'
        },
      ]
    },
    formItemLayout,
    ColConfig,
  },
  {
    inputType: 'input',
    title: 'inputname',
    label: '输入框',
    componentsConfig: {
      placeholder: '请输入商品名称',
      maxLength: 20,
    },
    formItemLayout,
    ColConfig,
  },
  {
    inputType: 'tagGroup',
    title: 'tagname',
    label: '标签',
    itemConfig: {
      rules: [],
    },
    componentsConfig: {
      placeholder: '请输入规格',
      max: 5,
      inputMaxLength: 50,
    },
    formItemLayout,
    ColConfig,
  },
  {
    inputType: 'textArea',
    title: 'remark',
    label: '蜂场描述',
    itemConfig: {
      rules: [{
        required: true,
        message: '请填写蜂场描述'
      }]
    },
    componentsConfig: {
      allowClear: true,
      placeholder: '输入最多200字符',
      autoComplete: 'off',
      maxLength: 200,
      autoSize: {
        minRows: 3,
        maxRows: 3,
      },
    },
    formItemLayout,
    ColConfig,
  }
]