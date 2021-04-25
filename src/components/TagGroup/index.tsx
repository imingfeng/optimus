import React, { Component } from 'react';
import _ from 'lodash';
import { Input, Tag, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons'

import styles from './style.less'

interface IProps {
  tags?: any,
  onChange?: any,
  onClick?: any,
  onClose?: any,
  max?: number,
  inputMaxLength?: any,
  isPreview?: boolean,
  prefix?: any,
  defaultText?: string
}

export default class EditableTagGroup extends Component<IProps> {
  state = {
    tags: this.props.tags || [],
    inputVisible: false,
    inputValue: ''
  };

  UNSAFE_componentWillReceiveProps({ tags, initialValue }: any) {
    if (tags !== this.props.tags) {
      this.setState({
        tags
      });
    }
  }

  handleClose = (removedTag: any) => {
    const { onChange = '' } = this.props;
    const tags = this.state.tags.filter((tag: any) => tag !== removedTag && tag.toString().trim() !== '');
    onChange && onChange(tags);
    this.setState({ tags });
  };
  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e: any) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const state = this.state;
    const props = this.props;
    const inputValue = state.inputValue;
    let tags = props && props.tags ? props.tags : state.tags;
    if (inputValue && inputValue.toString().trim() && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    const { onChange } = this.props;
    onChange && onChange({ tags });
    this.setState({
      tags,
      inputVisible: false,
      inputValue: ''
    });
  };

  saveInputRef = (input: any) => this.input = input;

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    const { onClick, onClose } = this.props;
    const tagClose = onClose || this.handleClose;
    let renderTags = tags;
    if (this.props.tags) {
      renderTags = this.props.tags;
    }
    const { max = 100, inputMaxLength, isPreview = false, prefix = '', defaultText = '添加标签' } = this.props || {};
    return (
      <div className={styles.tagsList}>
        {renderTags.map((tag: any) => {
          const name = _.isObject(tag) ? tag.name : tag;
          const id = _.isObject(tag) ? tag.id : tag;
          const isLongTag = name.length > 20;
          const tagElem = (
            <Tag key={name} id={id} onClick={(e) => onClick && onClick(tag,e)} closable={!isPreview}
                 onClose={(e: any) => tagClose(tag,e)}>
              {isLongTag ? `${prefix}${name.slice(0, 20)}...` : `${prefix}${name}`}
            </Tag>
          );
          return isLongTag ? <Tooltip title={name} key={name}>{tagElem}</Tooltip> : tagElem;
        })}
        {inputVisible && (
          <Input
            className={styles.input}
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
            maxLength={inputMaxLength}
          />
        )}
        {!inputVisible && renderTags.length < max && !isPreview && (
          <Tag
            className={styles.defaultTag}
            onClick={this.showInput}
            style={{ background: '#fff', borderStyle: 'dashed' }}
          >
            <PlusOutlined /><span style={{marginLeft: '2px'}}>{defaultText}</span>
          </Tag>
        )}
      </div>
    );
  }
}
