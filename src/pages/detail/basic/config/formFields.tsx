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

export const auditApplyConditions = [
  {
    inputType: 'datePicker',
    title: 'confirmDate',
    label: '开票日期',
    itemConfig: {
      rules: [
        {
          required: true, message: '请选择开票日期'
        },
      ]
    },
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
    inputType: 'input',
    title: 'realAmount',
    label: '开票金额',
    itemConfig: {
      rules: [
        {
          required: true, message: '请输入开票金额'
        },
        {
          validator: (rule: any, value: any) => {
            if (value && !reg.sevenMaxTwoPoint.test(value)) {
              return Promise.reject('请输入最多七位整数或最多两位小数的数字');
            }
            return Promise.resolve();
          }
        }
      ]
    },
    formItemLayout,
    ColConfig,
    componentsConfig: {
      placeholder: '请输入',
      maxLength: 9,
      prefix: '¥',
      autoComplete: 'off'
    }
  },
]