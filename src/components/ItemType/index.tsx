// tslint:disable
import React from 'react';
import {
  Col,
  Form,
  Input,
  Select,
  Cascader,
  DatePicker,
  message,
  Radio,
  Switch,
  Checkbox,
  TreeSelect,
} from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { Map, MonthDate } from '@/utils'
import {
  PicturesWall,
  PicturesWallClipper,
  PicturesWallCrop,
  EditableTagGroup
} from '@/components';
import _ from 'lodash'
import { localStorage } from '@/utils'


const { RangePicker } = DatePicker;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

interface IProps {
  queryCondition: any;
  form: any;
  ColProps?: object;
  formItemLayout?: any;
  filterId?: string;
}

const defaultColConfig = {
  xs: 24,
  sm: 12,
  md: 8,
  xl: 8,
  xxl: 8,
};

// enum defaultColConfig {
//   xs = 24,
//   sm = 12,
//   md = 8,
//   xl = 8,
//   xxl = 8,
// }

const formItemLayout = {
  labelCol: {
    xs: 24,
    sm: 12,
    md: 8,
    xl: 6,
    xxl: 6,
  },
  wrapperCol: {
    xs: 24,
    sm: 12,
    md: 15,
    xl: 17,
    xxl: 17,
  },
};

const defaultSelect = {
  getPopupContainer: (triggerNode:any) => triggerNode.parentElement, // 父级：下拉内容不会随着滚动条滚动
  style: { width: '100%' },
};

const ItemType = (props: IProps) => {
  const { ColProps, queryCondition, filterId, form } = props;
  const { getFieldError, setFields, getFieldValue, setFieldsValue } = form;
  const ColConfig = ColProps ? ColProps : defaultColConfig;

  // 用户token信息
  const { token, deviceId } = localStorage.getJson('userToken');
  const uploadFileHeaders = {
    region: 'online',
    '_Token_': token,
    '_Device-Id_': deviceId
  }

  const type = (item: any) => {
    const compontentstype = item.inputType;
    const itemColConfig = item.ColConfig || ColConfig;

    // 图片上传增加header用户token信息
    if (compontentstype === 'picturewall' || compontentstype === 'PicturesWallClipper' || compontentstype === 'picturesWallCrop') {
      item.componentsConfig = {
        ...item.componentsConfig,
        headers: uploadFileHeaders,
      }
    }

    // 输入框默认
    if (compontentstype === 'input') {
      item.componentsConfig = {
        autoComplete: 'off', // 关闭浏览器默认记录
        ...item.componentsConfig,
      }
    }

    item.itemConfig = {
      validateTrigger: 'onBlur',
      ...item.itemConfig,
    };

    switch (compontentstype) {
      case 'select':
        const selectCondition = item.selectCondition ? [...item.selectCondition] : [];

        if (item.isAll) {
          selectCondition.unshift({
            label: '全部',
            value: '',
          });
        }

        // 最多选择
        const maxLimit = _.get(item, 'componentsConfig.limit')
        if (_.get(item, 'componentsConfig.mode') === 'multiple') {
          item.componentsConfig = {
            showSearch: true,
            optionFilterProp: 'label',
            ...item.componentsConfig,
          }

          if (maxLimit) {
            item.componentsConfig.onSelect = () => {
              let currentValue = getFieldValue(item.title)
              if (currentValue.length > maxLimit) {
                setFieldsValue({
                  [item.title]: currentValue.slice(0, 3)
                })
                message.error(`最多选择${maxLimit}个`)
              }
            }
          }
        }

        return (
          <Col key={item.title} {...itemColConfig}>
            <Form.Item
              name={item.title}
              {...item.itemConfig}
              label={item.label}
              {...item.formItemLayout || formItemLayout}
            >
              <Select {...defaultSelect} {...item.componentsConfig}>
                {selectCondition.map((itemList, index) => {
                  return (
                    <Select.Option key={`${itemList.value}_${index}`} label={itemList.label} value={itemList.value}>
                      <div dangerouslySetInnerHTML={{ __html: itemList.label }}></div>
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        );

      case 'treeSelect':
        const defaultProps = {
          // showCheckedStrategy: SHOW_PARENT,
          placeholder: '请选择',
          treeCheckable: true,

        };

        return (
          <Col key={item.title} {...itemColConfig}>
            <Form.Item
              label={item.label}
              name={item.title}
              {...item.formItemLayout || formItemLayout}
              {...item.itemConfig}
            >
              <TreeSelect
                {...defaultSelect}
                {...{
                  ...defaultProps,
                  ...item.componentsConfig,
                  treeData: (item.dataSource && item.dataSource) || [],
                }}
              />
            </Form.Item>
          </Col>
        );

      case 'input':
        return (
          <Col key={item.title} {...itemColConfig}>
            <Form.Item
              label={item.label}
              name={item.title}
              {...item.itemConfig}
              {...item.formItemLayout || formItemLayout}
            >
              <Input {...item.componentsConfig} />
            </Form.Item>
          </Col>
        );

      case 'rangeInput':
        return (
          <Col key={item.title} {...itemColConfig}>
            <Form.Item label={item.label} {...item.formItemLayout || formItemLayout}>
              <Form.Item name={item.title} {...item.itemConfig} style={{ display: 'inline-block', width: '47%', margin: '0' }}>
                <Input {...item.componentsConfig} />
              </Form.Item>
              <Form.Item name={item.title} style={{ display: 'inline-block', width: '2%', margin: '0 2%' }}>
                <span>-</span>
              </Form.Item>
              <Form.Item name={item.title2} {...item.itemConfig2} style={{ display: 'inline-block', width: '47%', margin: '0' }}>
                <Input {...item.componentsConfig2} />
              </Form.Item>
            </Form.Item>
          </Col>
        );

      case 'radio':
        return (
          <Col key={item.title} {...itemColConfig}>
            <Form.Item
              label={item.label}
              name={item.title}
              {...item.formItemLayout || formItemLayout}
              {...item.itemConfig}
            >
              <RadioGroup {...item.componentsConfig} />
            </Form.Item>
          </Col>
        );

      case 'radioButton':
        return (
          <Col key={item.title} {...itemColConfig}>
            <Form.Item
              label={item.label}
              name={item.title}
              {...item.formItemLayout || formItemLayout}
              {...item.itemConfig}
            >
              <RadioGroup {...item.componentsConfig}>
                {
                  item.radioCondition.map((radioItem: any, radioIndex: number) => {
                    return <Radio.Button
                              key={`radioButton_${radioIndex}`}
                              value={radioItem.value}
                              disabled={radioItem.disable ? true : false}
                          >
                            {radioItem.label}
                          </Radio.Button>
                  })
                }
              </RadioGroup>
            </Form.Item>
          </Col>
        );

      case 'switch':
        return (
          <Col key={item.title} {...itemColConfig}>
            <Form.Item
              label={item.label}
              name={item.title}
              {...item.formItemLayout || formItemLayout}
              {...item.itemConfig}
            >
              <Switch {...item.componentsConfig} />
            </Form.Item>
          </Col>
        );
      case 'checkbox':
        return (
          <Col key={item.title} {...itemColConfig}>
            <Form.Item
              label={item.label}
              name={item.title}
              {...item.formItemLayout || formItemLayout}
              {...item.itemConfig}
            >
              <CheckboxGroup {...item.componentsConfig} />
            </Form.Item>
          </Col>
        );

      case 'picturewall':
        return (
          <Col key={item.title} {...itemColConfig}>
            <Form.Item
              label={item.label}
              name={item.title}
              {...item.formItemLayout || formItemLayout}
              valuePropName={'fileList'}
              getValueFromEvent={e => {
                if (e.file.status === 'error') {
                  message.error('上传失败，请重试');
                }
                if (Array.isArray(e)) {
                  return e.filter(item => item.status !== 'error');
                }
                setFields([{
                  [item.title]: e.fileList.filter((item: any) => item.status !== 'error'),
                }]);
                return e && e.fileList.filter((item: any) => item.status !== 'error');
              }}
              {...item.itemConfig}
              validateTrigger={'onChange'}
          >
              <PicturesWall {...item.componentsConfig} />
            </Form.Item>
          </Col>
        );

      case 'picturesWallCrop':
        // https://github.com/nanxiaobei/antd-img-crop/blob/master/README.zh-CN.md
        return (
          <Col key={item.title} {...itemColConfig}>
            <Form.Item
              label={item.label}
              name={item.title}
              valuePropName={'fileList'}
              {...item.formItemLayout || formItemLayout}
              getValueFromEvent={e => {
                if (e.file.status === 'error') {
                  message.error('上传失败，请重试');
                }
                if (Array.isArray(e)) {
                  return e.filter(item => item.status !== 'error');
                }
                setFields([{
                  [item.title]: e.fileList.filter((item: any) => item.status !== 'error'),
                }]);
                return e && e.fileList.filter((item: any) => item.status !== 'error');
              }}
              {...item.itemConfig}
              validateTrigger={'onChange'}
            >
              <PicturesWallCrop {...item.componentsConfig} />
            </Form.Item>
          </Col>
        )

      case 'PicturesWallClipper':
        // 请使用 picturesWallCrop
        return (
          <Col key={item.title} {...itemColConfig}>
            <Form.Item
              label={item.label}
              name={item.title}
              valuePropName={'fileList'}
              {...item.formItemLayout || formItemLayout}
              getValueFromEvent={e => {
                if (e.file.status === 'error') {
                  message.error('上传失败，请重试');
                }
                if (Array.isArray(e)) {
                  return e.filter(item => item.status !== 'error');
                }
                setFields([{
                  [item.title]: e.fileList.filter((item: any) => item.status !== 'error'),
                }]);
                return e && e.fileList.filter((item: any) => item.status !== 'error');
              }}
              {...item.itemConfig}
            >
              <PicturesWallClipper {...item.componentsConfig} />
            </Form.Item>
          </Col>
        );

      case 'rangePicker':
        return (
          <Col key={item.title} {...itemColConfig}>
            <Form.Item
              label={item.label}
              name={item.title}
              {...item.formItemLayout || formItemLayout}
              {...item.itemConfig}
            >
              <RangePicker {...defaultSelect} {...{ locale, ...item.componentsConfig }} style={{width:'100%'}} />
            </Form.Item>
          </Col>
        );
      case 'datePicker':
        return (
          <Col key={item.title} {...itemColConfig}>
            <Form.Item
              label={item.label}
              name={item.title}
              {...item.formItemLayout || formItemLayout}
              {...item.itemConfig}
            >
              <DatePicker {...defaultSelect} {...{ locale, ...item.componentsConfig }} />
            </Form.Item>
          </Col>
        );
      case 'textArea':
        return (
          <Col key={item.title} {...itemColConfig}>
            <Form.Item
              label={item.label}
              name={item.title}
              {...item.formItemLayout || formItemLayout}
              {...item.itemConfig}
            >
              <TextArea {...item.componentsConfig} />
            </Form.Item>
          </Col>
        );
      case 'countryAddress':
        const defaultAttr = {
          allowClear: true,
          changeOnSelect: true,
          expandTrigger: 'hover',
          placeholder: '请选择地址',
          options: Map,
          style: { width: '100%' },
        };
        return (
          <Col key={item.title} {...itemColConfig}>
            <Form.Item
              label={item.label}
              name={item.title}
              {...item.formItemLayout || formItemLayout}
              {...item.itemConfig}
            >
              <Cascader {...defaultSelect} {...{ ...defaultAttr, ...item.componentsConfig }} />
            </Form.Item>
          </Col>
        );
      case 'monthDate': 
        const defaultMd = {
          allowClear: true,
          // changeOnSelect: true,
          expandTrigger: 'hover',
          placeholder: '请选择月日',
          options: MonthDate,
          style: { width: '100%' },
        };
        return (
          <Col key={item.title} {...itemColConfig}>
            <Form.Item
              label={item.label}
              name={item.title}
              {...item.formItemLayout || formItemLayout}
              {...item.itemConfig}
            >
              <Cascader {...defaultSelect} {...{ ...defaultMd, ...item.componentsConfig }} />
            </Form.Item>
          </Col>
        );
      case 'tagGroup':
        return (
          <Col key={item.title} {...itemColConfig}>
            <Form.Item
              label={item.label}
              name={item.title}
              {...item.formItemLayout || formItemLayout}
              {...item.itemConfig}
              valuePropName={'tags'}
              getValueFromEvent={e => {
                if (Array.isArray(e)) {
                  return e;
                }
                setFields([{
                  [item.title]: e,
                }]);
                return e && e.tags;
              }}
            >
              <EditableTagGroup {...item.componentsConfig} />
            </Form.Item>
          </Col>
        );
      case 'custom':
        return (
          <Col key={item.title} {...itemColConfig}>
            <Form.Item
              label={item.label}
              name={item.title}
              {...item.formItemLayout || formItemLayout}
              {...item.itemConfig}
            >
              <div>{item.render}</div>
            </Form.Item>
          </Col>
        );
      default:
        return null;
    }
  };
  const formItem = queryCondition && queryCondition.map(type);

  return <>{formItem}</>;
};

export default ItemType;
