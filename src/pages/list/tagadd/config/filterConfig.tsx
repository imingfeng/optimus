import moment from 'moment';
import { BLACK_ENUM } from './enum';
import { COOPERATION_ENUM } from '@/config/enum';

const formItemLayout = {
  labelCol: { span: 8 }, // 左侧 label 宽度
  wrapperCol: { span: 16 }, // 右侧 控件 宽度
  style: {
    marginBottom: 24
  }
};

// 一行显示个数
const ColConfig = {
  xs: 24, // <576
  sm: 24, // >= 576
  md: 24, // >= 768
  lg: 12, // >= 992
  xl: 8, // >= 1200
  xxl: 6, // >= 1600
}

export const tableRadioCondition = [
  {
    title: '全部',
    number: 0,
    value: '',
    unit: '条',
    key: 'totalNum'
  },
  {
    title: '待审核',
    number: 0,
    value: '10',
    unit: '条',
    key: 'reviewedNum'
  },
  {
    title: '待质检',
    number: 0,
    value: '20',
    unit: '条',
    key: 'qualityNum'
  },
]

export const filterCondition = [
  {
    inputType: 'input',
    title: 'name',
    label: '商品名称很长收',
    componentsConfig: {
      placeholder: '请输入商品名称',
      maxLength: 20,
      autoComplete: 'off'
    },
    formItemLayout,
    ColConfig,
  },
  {
    inputType: 'select',
    title: 'status',
    label: '商品状态',
    isAll: true,
    componentsConfig: {
      placeholder: '请选择',
      allowClear: false,
    },
    selectCondition: BLACK_ENUM,
    formItemLayout,
    ColConfig,
  },
  {
    inputType: 'countryAddress',
    title: 'location',
    label: '商品产地',
    componentsConfig: {
      placeholder: '请选择商品产地',
    },
    formItemLayout,
    ColConfig,
  },
  {
    inputType: 'rangePicker',
    title: 'createDate',
    label: '上线时间',
    itemConfig: {
      initialvalue: []
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
]
