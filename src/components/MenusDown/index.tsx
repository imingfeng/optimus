import React, { Component } from 'react';
import styles from './index.less';
import { Popover, Button, Checkbox } from 'antd';
import Link from 'umi/link';
import classnames from 'classnames';

const CheckboxGroup = Checkbox.Group;

/*
数据格式
menuList: [
  // 默认单列自定义
  { render: reactNode },
  { type: 'link', iconfont: '图标', link: '链接地址', label: '名称' },

  // menusType:select 数据格式
  { label: '名称', value: 'id', selected: true }, 

  // menusType:cascader或choose 数据格式
  { label: '名称', value: 'id', selected: true, children: [] }, 
],
popoverProps: {
  ... popover 的属性
},
menusType: '', 默认自定义, select 多选择, cascader 级联菜单, choose 单选地址
onSave: function（被选中的数组，原数组）, 保存
onReset: function 重置
contentStyle: {}, 可定义内容样式，例如{width: '200px'}
*/

interface IProps {
  menuList?: any,
  onReset?: any,
  onSave?: any,
  popoverProps?: any, 
  menusType?: any,
  contentStyle?: any,
  resetBtnId?: any,
}

export default class Page extends Component<IProps> {
  state = {
    visible: false,
    menuList: [],
  };

  // componentWillUpdate({ menuList }) {
  //   if (menuList !== this.props.menuList || this.state.menuList.length === 0) {
  //     this.setState({
  //       menuList,
  //     });
  //   }
  // }

  componentWillReceiveProps(nextProps: any) {
    const { menuList } = nextProps;
    if (menuList !== this.props.menuList || this.state.menuList.length === 0) {
      this.setState({
        menuList: nextProps.menuList,
      }) 
    }
  }

  save = (payload: any) => {
    this.setState({
      ...payload,
    });
  };

  handerSelect = (e:any, value: any) => {
    const menuList = this.state.menuList.length ? this.state.menuList : this.props.menuList
    let selected = e.target.checked;
    menuList.map((item: any) => {
      if (item.value === value) {
        item.selected = selected;
      }
    });

    this.setState({
      menuList,
    });
  };

  handerSave = () => {
    const { onSave } = this.props;
    const { menuList } = this.state;
    let select: any[] = [];

    menuList.map(({ value, selected, children }) => {
      if (children && children.length) {
        children.map(item => {
          if (item.selected) {
            select.push(item.value);
          }
        });
      }
      if (selected) {
        select.push(value);
      }
    });
    onSave && onSave(select, menuList);
    this.hide();
  };

  handerReset = () => {
    const { onReset } = this.props;
    const { menuList } = this.state;

    console.log('cao ');

    menuList.map(item => {
      item.selected = false;
      if (item.children && item.children.length) {
        item.children.map(itemChildren => {
          itemChildren.selected = false;
        });
      }
    });

    this.save({
      menuList,
    });

    onReset && onReset(menuList);
    this.hide();
  };

  handleVisibleChange = (visible: any) => {
    this.setState({ visible });
  };

  hide = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { children, popoverProps, menusType, contentStyle, onSave, onReset, resetBtnId } = this.props;
    const { menuList, visible } = this.state;

    const list = menuList.length ? menuList : this.props.menuList;

    let operate = '';
    let userMenu = list.map(({ render, type, label, iconfont, link, style }, index) => {
      let content = render;
      if (type === 'link') {
        content = (
          <Link to={link || '#'} onClick={this.hide} className={styles.userMenusItem}>
            <i className="iconfont" style={style || {}} dangerouslySetInnerHTML={{ __html: iconfont }}></i>
            <span>{label}</span>
          </Link>
        );
      }
      return (
        <div className={styles.downMenusItem} onClick={this.hide} key={index}>
          {content}
        </div>
      );
    });
    if (menusType === 'select') {
      userMenu = (
        <div className={styles.selectBox}>
          {
            list.map(({ label, selected, value }, index) => {
              let checkProps = {
                checked: selected,
                onChange: (e) => {
                  this.handerSelect(e, value)
                },
              };
              return (
                <div className={styles.menusItem} key={index}>
                  <div className={styles.selectMenusItem}>
                    <Checkbox {...checkProps}>
                      <span className={styles.title}>{label}</span>
                    </Checkbox>
                  </div>
                </div>
              );
            })
          }
        </div>
      )
    }

    if (onSave && menusType !== 'choose') {
      operate = (
        <div className={styles.operateBox}>
          {onReset ? (
            <span id={resetBtnId} onClick={this.handerReset} className={styles.splitBtn}>
              重置
            </span>
          ) : (
            ''
          )}

          <span onClick={this.handerSave}>
            保存
          </span>
        </div>
      );
    }

    let menusContent = (
      <div style={contentStyle || {}}>
        <div>{userMenu}</div>
        {operate}
      </div>
    );

    let _popoverProps = {
      ...popoverProps,
      visible,
      onVisibleChange: this.handleVisibleChange,
      content: menusContent,
      overlayClassName: styles.popovermenu,
    };

    return (
      <div className={styles.loginUser}>
        <Popover {..._popoverProps}>{children}</Popover>
      </div>
    );
  }
}
