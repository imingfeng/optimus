import moment from 'moment';
import _ from 'lodash'
import { unitsPrice } from '@/utils'

const defaultValue = '-';

/*
 * column类型定义
 */
const fieldTypes = {
  normal: (value: any) => _.isUndefined(value) ? defaultValue : value,
  text: (value: any) => _.isUndefined(value) ? defaultValue : value,
  textarea: (value: any) => _.isUndefined(value) ? defaultValue : value,
  number: (value: any) => _.isUndefined(value) ? defaultValue : value,
  boolean: (value: any) => {
    return value === 'true' || value === true ? '是' : '否';
  },
  price: (value: any) => {
    return _.isUndefined(value) ? defaultValue : `¥${unitsPrice(value, true)}`
  },
  date: (value: any) => {
    return value ? moment(new Date(parseInt(value, 10))).format('YYYY-MM-DD') : defaultValue;
  },
  datetime: (value: any) => {
    return value ? moment(new Date(parseInt(value, 10))).format('YYYY-MM-DD HH:mm') : defaultValue;
  },
  time: (value: any) => {
    return value ? moment(new Date(parseInt(value, 10))).format('HH:mm:ss') : defaultValue;
  },
  month: (value: any) => {
    return value ? moment(new Date(parseInt(value, 10))).format('YYYY-MM') : defaultValue;
  },
  dateRange: (value: any) => {
    const start = value ? moment(new Date(parseInt(value, 10))).format('YYYY-MM-DD') : defaultValue;
    const end = value ? moment(new Date(parseInt(value, 10))).format('YYYY-MM-DD') : defaultValue;
    return `${start} - ${end}`;
  },
  datetimeRange: (value: any) => {
    const start = value ? moment(new Date(parseInt(value, 10))).format('YYYY-MM-DD HH:mm') : defaultValue;
    const end = value ? moment(new Date(parseInt(value, 10))).format('YYYY-MM-DD HH:mm') : defaultValue;
    return `${start} - ${end}`;
  },
  enum: (value: any, { enums }: any) => {
    let enumValue = '';
    if (value && !Array.isArray(enums)) {
      enumValue = value;
    } else if (Array.isArray(enums)) {
      const enumsFilter = enums.find((x) => x.value == value) || {};
      enumValue = enumsFilter.label || value;
    }
    return enumValue;
  },
  enumGroup: (value: any, { options }: any) => {
    let enumGroup: any[];
    if (!Array.isArray(value)) {
      enumGroup = [value];
    } else if (Array.isArray(options)) {
      enumGroup = value.map((v) => (options.find((x) => x.value == v) || {}).label);
    } else {
      enumGroup = value.map((v) => options[v]);
    }
    return enumGroup.filter((v) => v !== undefined && v !== '').join(',');
  },
  cascader: (value: any, { options }: any) => {
    let cascader: any[];
    if (!Array.isArray(value)) {
      cascader = [value];
    } else if (!options) {
      cascader = value;
    } else {
      cascader = [];
      let opts = options;
      for (let index = 0; index < value.length; index++) {
        const opt = opts.find((x: any) => x.value === value[index]);
        if (!opt) {
          cascader = [];
          break;
        }
        cascader.push(opt.label);
        opts = opt.children;
      }
    }
    return cascader.filter((v) => v !== undefined && v !== '').join('/');
  },
};

/*
 * 扩展column类型定义
 */
export const combineTypes = (types: any) => {
  Object.assign(fieldTypes, types);
};

export default fieldTypes;
