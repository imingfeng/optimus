/* global window */
import _ from 'lodash';
import moment from 'moment';
import request from './request';
import Model from './model.js';
import TableUtils from './tableUtils';
import * as localStorage from './_localStorage';
import ItemUtils from './itemUtils';
import { MonthDate } from './date';
import { Map, mapkey } from './map'
// import mapSource from '@/config/map'
import { Modal } from 'antd';

export { request, Model, TableUtils, localStorage, ItemUtils, Map, mapkey, MonthDate };

const mapSource = Map;

// trim obj
export const trimValues = (values: any) => {
  return Object.keys(values).reduce((obj: any, key) => {
    const value = values[key];
    if (values[key] && typeof value === 'string') {
      obj[key] = value.trim();
    } else {
      obj[key] = value;
    }
    return obj;
  }, {});
};

/**
 * 拼接对象为请求字符串
 * @param {Object} obj - 待拼接的对象
 * @returns {string} - 拼接成的请求字符串
 */
export function encodeSearchParams(obj: any) {
  let params:any = [];

  Object.keys(obj).forEach(key => {
    let value = obj[key];
    // 如果值为undefined我们将其置空
    if (typeof value === 'undefined') {
      value = '';
    }
    // 对于需要编码的文本（比如说中文）我们要进行编码
    params.push([key, encodeURIComponent(value)].join('='));
  });

  return params.join('&');
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
export function queryArray(array: [], key: any, keyAlias = 'key') {
  if (!(array instanceof Array)) {
    return null;
  }
  const item = array.filter(_ => _[keyAlias] === key);
  if (item.length) {
    return item[0];
  }
  return null;
}

// 返回最近7天的两个日期
// d number天数
// startKey string 开始日期key
// endKey string 结束日期key
// return object {moment,moment}
export const recentlyDate = (props = { d: 6, startKey: 'start', endKey: 'end' }) => {
  let r:any = {};
  const { d, startKey, endKey } = props;
  const now = moment();
  r[startKey] = moment(now).subtract(d, 'days');
  r[endKey] = now;
  return r;
};

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
export function arrayToTree(array: any, id = 'id', pid = 'pid', children = 'children') {
  let data = _.cloneDeep(array);

  let result: any;
  result = [];

  let hash: any;
  hash = {};
  data.forEach((item: any, index: number) => {
    hash[data[index][id]] = data[index];
  });

  data.forEach((item: any) => {
    let hashVP = hash[item[pid]];
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = []);
      hashVP[children].push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}

export const treeToArray = (data: any) => {
  let result:any = [];
  const changefunc = (tree: any, pkey: any) => {
    tree.forEach((item: any) => {
      if (item.children) {
        changefunc(item.children, item.key);
      }
      result.push({
        pkey: pkey,
        title: item.title,
        key: item.key
      });
    });
  };
  changefunc(data, null);
  return result;
};

/**
 *
 * 删除对象中为空/undefined/null的字段
 * @param {Object} obj - 需要删除字段的对象
 */
export function checkInvalidFileds(obj: any) {
  if(!(typeof obj === 'object')) return;
  let arr = [null, 'undefined', '', '[]']
  for(let key in obj) {
    if(obj.hasOwnProperty(key) && (obj[key] == null || obj[key] == 'undefined' || obj[key] === '' || obj[key] === '[]' || obj[key].length === 0)) {
      delete obj[key]
    }
  }
  return obj
}

/**
 *
 * 删除数组对象中为空/undefined/null的字段
 * @param {Object} obj - 需要删除字段的对象
 */
export function checkInvalidFiledsArr(obj: any) {
  if (!(typeof obj === 'object')) return;
  const _newObj = obj.map((item:any,index:number) => {
    for (let key in item) {
      if (item.hasOwnProperty(key) && (item[key] == null || item[key] == 'undefined' || item[key] === '' || item[key] === '[]' || item[key].length === 0)) {
        delete item[key]
      }
    }
    return item
  })
  return _newObj
}

 /**
   * 日期转时间戳
   * @param {String|moment|Date} date 日期
   * @param {Boolean} isEnd 是否结束时间
   * @param {String} timeFmt 需要补充的HH:MM:SS
   * @return {String} 返回时间戳
   */
export function formatTimestamp(date: any, isEnd: boolean = false, timeFmt: string = ''): any {
  let time = timeFmt || '00:00:00';
  date = date || new Date();
  if (isEnd) {
    time = '23:59:59';
  }
  return moment(moment(moment(date).format('YYYY-MM-DD') + ' ' + time)).valueOf();
}

/**
 * 时间转日期字符串
*/
export function formatDate(date: any, isTime: boolean = true, format: string = '') {
  let formatStr = 'YYYY-MM-DD'
  if (format) {
    formatStr = format
  } else {
    if (isTime) {
      formatStr += ' HH:mm'
    }
  }
  return moment(date).format(formatStr)
}

/**
 * 入参code
 * return string 省/市/区
*/
export function locationStrCity (site: any) {
  return site ? mapkey[site] : undefined
}

/**
 * 入参 array ['省', '市', '区']
 * return object 省-市-区 {province, city, county}
*/
export function locationCode(site: any) {
  let province: string = '';
  let city: string = '';
  let county: string = '';

  if (site && !_.isEmpty(site)) {
    province = site[0];
    if (site.length >= 2) {
      city = site[1];
      if (site.length >= 3) {
        county = site[2];
      }
    }
  }

  return {
    province,
    city,
    county,
  }
}

/**
 * 入参 object {province, city, county}，
 * return string 省-市-区
*/
export function locationStr(site: any) {
  if (!site) {
    return '-'
  }
  const { province, city, county } = site;
  let siteArr = [];
  if (mapkey[province]) {
    siteArr.push(mapkey[province]);
  }

  if (mapkey[city]) {
    siteArr.push(mapkey[city]);
  }

  if (mapkey[county]) {
    siteArr.push(mapkey[county]);
  }

  return siteArr.join('-');
}

// 数组转字符串
export function arrayToString (arr: [], text?: string) {
  if (!_.isEmpty(arr)) {
    if (text) {
      let labelStr: any[] = []
      arr.map((item: any) => {
        labelStr.push(item[text])
      })
      return labelStr.join('，')
    } else {
      return arr.join('，')
    }
  }
}

/**
 * 传入省、市、区名称返回对应code
 * 入参 object {province, city, county}，中文格式
 * return obj { province, city, county }，code码
*/
export function mapNameToCode(obj: any) {
  const { province, city, county } = obj
  let data = {
    province,
    city,
    county
  }
  if(province !== '台湾省') {
    mapSource.map((pitem: any) => {
      if(pitem.label === province) {
        data.province = Number(pitem.id)
        if (city && city.length > 0) {
          if(province !== city) {
            pitem.children.map((citem: any) => {
              if(citem.label === city) {
                data.city = Number(citem.id)
                if(city === county) {
                  data.county = ''
                } else {
                  citem.children.map((item: any) => {
                    if(item.label === county) {
                      data.county = Number(item.id)
                    }
                  })
                }
              }
            })
          } else {
            let arr = ['香港特别行政区', '澳门特别行政区']
            if(arr.includes(city) || arr.includes(province)) {
              pitem.children.map((item: any) => {
                if(item.label === county) {
                  data.county = Number(item.id)
                }
              })
              data.city = Number(pitem.id)
            } else {
              let arr = ['北京市', '上海市', '天津市', '重庆市']
              if(city.includes('重庆')) {
                const arr = ['城口县', '丰都县', '垫江县', '忠县', '云阳县', '奉节县', '巫山县', '巫溪县', '石柱土家族自治县', '秀山土家族苗族自治县',
                    '酉阳土家族苗族自治县', '彭水苗族土家族自治县'];
                if(arr.includes(county)) {
                  data.city = Number(pitem.children[1].id)
                  pitem.children[1].children.map((item: any) => {
                    data.city = Number(pitem.children[1].id)
                    if(item.label === county) {
                      data.county = Number(item.id)
                    }
                  })
                } else {
                  data.city = Number(pitem.children[0].id)
                  pitem.children[0].children.map((item: any) => {
                    data.city = Number(pitem.children[0].id)
                    if(item.label === county) {
                      data.county = Number(item.id)
                    }
                  })
                }
              } else {
                pitem.children[0].children.map((item: any) => {
                  if(arr.includes(city)) {
                    data.city = Number(pitem.children[0].id)
                    if(item.label === county) {
                      data.county = Number(item.id)
                    }
                  } else { // 如海南五指山等无区县的城市
                    pitem.children.map((citem: any) => {
                      if(citem.label === county) {
                        data.city = Number(citem.id)
                        data.county = Number(citem.id)
                      }
                      if(citem.children.length) {
                        citem.children.map((item: any) => {
                          if(item.label === county) {
                            data.county = Number(item.id)
                          }
                        })
                      }
                    })
                  }
                })
              }
            }
          }
        }
        if((!city || city.length === 0) && county) {
          pitem.children.map((item: any) => {
            if(item.label === county) {
              data.city = Number(item.id)
            }
          })
          data.county = ''
        }
      }
    })
  } else {
    mapSource.map((pitem: any) => {
      if(pitem.label === province) {
        data.province = Number(pitem.id)
        data.city = Number(pitem.id)
        data.county = Number(pitem.id)
      }
    })
  }
  return data
}

// 删除二次弹框 - 删除
export function confirmDelete(opt: any) {
  Modal.confirm({
    ...opt,
    okType: 'danger',
    centered: true,
    okText: '删除',
    cancelText: '取消',
  });
}

/**
 * 清除登录信息
*/
export function clearUserLoginToken(opt?: any) {
  localStorage.removeLocalItem('lastLoginTime')
  localStorage.removeLocalItem('userRemember')
  localStorage.removeLocalItem('userToken')
  localStorage.removeLocalItem('userInfo')
}

/**
 * 处理图片格式为字符串
*/
export function dealPicsFormat(arr: [] = [], bizType?: number, name?: string, id?: number) {
  let images: {}[] = []
  arr.map((item: any) => {
    if (item.status === 'done' || item.uid) {
      images.push(item.response ? item.response.content : item.url)
    }
  })
  return images
}

/**
 * 自定义阿里图片大小
*/
export function customSizeImg(imgUrl: string = '', resize: string = '', isLimit = false) {
  let splitUrl = '?';
  let img = '';
  let limit = 'limit_0';

  // if (imgUrl === 'head') {
  //   return require('assets/head.png'); // 默认头像
  // } else if (imgUrl === 'img') {
  //   return require('assets/img_default.png'); // 默认图片
  // }

  if (
    imgUrl.indexOf('//') < 0 ||
    imgUrl.indexOf('data:image') === 0 ||
    imgUrl.indexOf('aliyuncs.com') < 0
  ) {
    return imgUrl;
  }

  if (isLimit) {
    limit = 'limit_1';
  }

  if (imgUrl.indexOf('?') > 0) {
    splitUrl = ',';
  }
  img = imgUrl + splitUrl + 'x-oss-process=image/resize,' + resize + ',' + limit;

  return img;
}

// 数字单位以","号分隔
export function unitsSeparate(number: any) {
  if (!number) {
    return '0'
  }
  number += '';
  let numberSplit = number.split('.');
  let integer = numberSplit[0].replace(/\B(?=(?:\d{3})+\b)/g, ',');
  if (integer.slice(-1) === ',') {
    integer = integer.slice(0, -1);
  }

  if (numberSplit.length === 2) {
    integer += '.' + numberSplit[1];
  }

  return integer;
}

// 地区层级，用于table展开数据
export function provinceExpandable(datas: any) {
  if (_.isEmpty(datas)) {
    return []
  } else {
    return datas.map((allItem: any, allIndex: number) => {
      allItem.key = `a_${allIndex}`;
      allItem.placeCode = ''
      if (allItem.subsetList) {
        allItem.children = allItem.subsetList;
        delete allItem.subsetList;

        allItem.children.map((item: any, index: number) => {
          item.key = index;
          item.placeCode = item.provinceId;
          if (item.subsetList) {
            item.children = item.subsetList;
            delete item.subsetList;
            //遍历市级
            item.children.map((childItem: any, sIndex: any) => {
              childItem.key = `s_${sIndex}`;
              childItem.placeCode = childItem.cityId;
              if (childItem.subsetList) {
                childItem.children = childItem.subsetList;
                delete childItem.subsetList;
                //遍历县或者区
                childItem.children.map(( grandChildrenItem: any, gIndex: any ) => {
                  grandChildrenItem.key = `g_${gIndex}`;
                  grandChildrenItem.placeCode = grandChildrenItem.countyId;
                  return grandChildrenItem;
                })
              }
              return childItem
            })
          }
        })
      }

      return allItem;
    });
  }
}

// 正则
export const reg = {
  code: /^\d{6}$/, // 短信验证码
  userName: /^(?:[\u4e00-\u9fa5·]{2,16})$/, // 姓名校验
  idCard:/(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,//身份证号校验（1代（15位） && 2代（18位））
  phone: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[0-9]))\d{8}$/, // 手机号
  email: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, // 邮箱
  _letterNo: /^[a-zA-Z0-9_\s]+([0-9a-zA-Z0-9_])\S+$/,  //  数字/字母/下划线/空格
  isEmoji: /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g, // 表情
  unZeroPositiveInt: /^\+?[1-9]\d*$/,  // 非零正整数
  zeroPositiveInt: /^\+?[0-9]\d*$/, // 含0正整数
  positiveInt: /^-?[1-9]\d*$/, // 匹配整数
  letterNum: /^[A-Za-z0-9]+$/,  // 数字或字母
  maxTwoPoint: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,  // 最多两位小数
  chEnNumber: /^[a-z0-9\u4e00-\u9fa5]+$/i,  // 只允许中文/英文/数字
  oneToHundred: /^([1-9]\d?|100)$/, // 1-100的整数
  sevenMaxTwoPoint: /^(0|[1-9]\d{0,6})(\.\d{1,2})?$/, //最多7为整数+2位小数点
  sixMaxTwoPoint: /^(0|[1-9]\d{0,5})(\.\d{1,2})?$/, //最多6位整数+2位小数点
  fiveMaxTwoPoint: /^(0|[1-9]\d{0,4})(\.\d{1,2})?$/, //最多5位整数+2位小数点
  eightMaxTwoPoint: /^(0|[1-9]\d{0,7})(\.\d{1,2})?$/, //最多8位整数+2位小数点
  pDesensitization: /(\d{3})\d*(\d{4})/, //手机号脱敏
}

// 米 转 千米
export const unitsMtoKm = (m = 0) => {
  return (m / 1000).toFixed(2);
}

// 价格单位转换（isShow: 分转元，isSeparate：三位逗号分割）
export const unitsPrice = (price = 0, isShow = false, isSeparate = true) => {
  let unit = 100
  let amount: any = 0
  if (isShow) {
    amount = Number((price / unit).toFixed(2))
    if (isSeparate) {
      amount = unitsSeparate(amount.toFixed(2))
    }
  } else {
    amount = Number((price * unit).toFixed(2))
  }

  return amount
}

/**
 * 请求的页码
 * obj: { len, pn }
 * len-数据列表的length， pn-当前页码
 */
export const toPageNum = (obj: any) => {
  const { len, pn } = obj
  if(len === 1 && pn > 1) {
    return pn - 1
  } else {
    return pn || 1
  }
}
