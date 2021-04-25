import _ from 'lodash';

function getItemType(fields: any): any {

  const chain = {};
  let columns = _.cloneDeep(fields);

  function pick(_fieldKeys: any) {
    _fieldKeys = [].concat(_fieldKeys);
    columns = _fieldKeys.map((_fieldKey: any) => {
      let column = columns.find((item: any) => _fieldKey === item.title);
      return column;
    });
    return chain;
  }

  function extend(_extraFields: any) {
    _extraFields.forEach((_extraField: any) => {
      const column = columns.find((item: any) => item.title === _extraField.title);
      if(column) {
        // _extraField.forEach(field => {
        for(let field in _extraField) {
          if(typeof _extraField[field] === 'object' && !Array.isArray(_extraField[field])) {
            column[field] = {...column[field], ..._extraField[field]};
          } else {
            column[field] = _extraField[field];
          }
        }
        // })
        // Object.assign(column, _extraField)
      } else {
        columns.push(_extraField);
      }
    })
    return chain;
  }

  function initalValues(values: any = {}) {
    columns = columns.map((column: any) => {
      if(column.itemConfig) {
        column.itemConfig.initialvalue = values[column.title] || '';
      } else {
        column.itemConfig = { initialvalue: values[column.title] || '' };
      }
      return column
    })
   return chain;
  }

  function values () {
    return columns;
  }

  return Object.assign(chain, {
    pick,
    extend,
    values,
    initalValues,
  });
}

export default {
  // combineTypes,
  // getFieldValue,
  getItemType
};
