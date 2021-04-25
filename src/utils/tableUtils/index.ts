import { default as fieldTypes, combineTypes } from './fieldTypes';
import _ from 'lodash'

interface IFieldsType {
  title?: string;
  dataIndex?: string;
  [propName: string]: any;
}

// interface ICloumns {
//   fields?: Array<any>;
//   fieldKeys?: any;
//   extraFields?: any;
// }

/*
 * 获取column中显示的filedValue
 */
function getFieldValue(value: any, field: any) {
  let type = field.type || (field.enums && 'enum');
  type = fieldTypes.hasOwnProperty(type) ? type : 'normal';
  let val = fieldTypes[type](value, field)
  return _.isUndefined(val) ? '' : val;
}

/*xx
 * 获取表格column数组
 * 示例:
 * const columns = getColumns(fields,['name','author'],{ name: { render: ()=>{} }}).values();
 * const columns = getColumns(fields).excludes(['id','desc']).values();
 * const columns = getColumns(fields).pick(['name','author','openTime']).extend({name:{ render: ()=>{} }}).values();
 * @param originField 原始fields
 * @param fieldKeys 需要包含的字段keys
 * @param extraFields 扩展的fields
 * @result 链式写法，返回链式对象(包含pick,excludes,extend,values方法), 需要调用values返回最终的数据
 */
function getColumns(fields?: Array<IFieldsType>, fieldKeys?: any, extraFields?: any): any {
  const chain = {};
  let columns: any = [];

  const transform = (_fields: any) => {
    return _fields.map((field: any) => {
      let { dataIndex, title, key, name, render, ...others } = field;

      if (!render) {
        render = (value: any) => {
          return getFieldValue(value, field);
        };
      }

      return {
        dataIndex: key || dataIndex,
        title: name || title,
        render,
        ...others,
      };
    });
  };

  const pick = (_fieldKeys: any) => {
    _fieldKeys = [].concat(_fieldKeys);
    columns = _fieldKeys.map((fieldKey: any) => {
      let column = columns.find((item: any) => fieldKey === (item.key || item.dataIndex));
      if (!column) {
        // 如果fieldKey不存在，则创建text类型的column
        column = {
          dataIndex: fieldKey,
          title: fieldKey,
          render: (value: any) => {
            return getFieldValue(value, '');
          },
        };
      }
      return column;
    });
    return chain;
  };

  const excludes = (_fieldKeys: any) => {
    _fieldKeys = [].concat(_fieldKeys);
    columns = columns.filter((column: any) => !_fieldKeys.includes(column.dataIndex));
    return chain;
  };

  const extend = (_extraColumns: any) => {
    if (!Array.isArray(_extraColumns)) {
      _extraColumns = Object.keys(_extraColumns).map((key) => {
        return Object.assign(_extraColumns[key], {
          key,
        });
      });
    }
    _extraColumns.forEach((extraColumn: any) => {
      let { dataIndex, title, key, name, ...others } = extraColumn;
      extraColumn = {
        dataIndex: key || dataIndex,
        title: name || title,
        ...others,
      };

      // 如果extraColumn.title为undefined，则删除title属性，防止assign时覆盖掉原来的title
      if (extraColumn.hasOwnProperty('title') && extraColumn.title == undefined) {
        delete extraColumn.title;
      }

      const column = columns.find((item: any) => item.dataIndex == extraColumn.dataIndex);
      if (column) {
        Object.assign(column, extraColumn);
      } else {
        columns.push(extraColumn);
      }
    });

    return chain;
  };

  const values = () => {
    return columns;
  };

  columns = transform(fields);

  if (fieldKeys) {
    pick(fieldKeys);
  }

  if (extraFields) {
    extend(extraFields);
  }

  return Object.assign(chain, {
    pick,
    excludes,
    extend,
    values,
  });
}

export default {
  combineTypes,
  getFieldValue,
  getColumns,
};
