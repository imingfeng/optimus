import React from 'react';
import { Button, Layout, Menu, Popover } from 'antd';
import classnames from 'classnames';
import { icon } from '@/config/icon';
import styles from './Header.less';
import Menus from './Menu';

interface IHeaderProps {
  user: any;
  menu: any;
  logout: any;
  switchSider: any;
  siderFold: boolean;
  isNavbar: boolean;
  menuPopoverVisible: boolean;
  location: any;
  switchMenuPopover: any;
  navOpenKeys: any;
  changeOpenKeys: any;
}

const { SubMenu } = Menu;

const Header = (props: IHeaderProps) => {
  const {
    user,
    logout,
    switchSider,
    siderFold,
    isNavbar,
    menuPopoverVisible,
    location,
    switchMenuPopover,
    navOpenKeys,
    changeOpenKeys,
    menu,
  } = props;

  let handleClickMenu = (e: any) => e.key === 'logout' && logout();

  const menusProps = {
    menu,
    siderFold: false,
    darkTheme: false,
    isNavbar,
    handleClickNavMenu: switchMenuPopover,
    location,
    navOpenKeys,
    changeOpenKeys,
  };

  return (
    <Layout.Header className={styles.header}>
      {isNavbar ? (
        <Popover
          placement="bottomLeft"
          onVisibleChange={switchMenuPopover}
          visible={menuPopoverVisible}
          overlayClassName={styles.popovermenu}
          trigger="click"
          content={<Menus {...menusProps} />}
        >
          <div className={styles.button}>{icon.bars}</div>
        </Popover>
      ) : (
        <div className={styles.button} onClick={switchSider}>
          {siderFold ? icon.menuFold : icon.menuUnfold}
        </div>
      )}
      <div className={styles.rightWarpper}>
        <Menu mode="horizontal" onClick={handleClickMenu}>
          <SubMenu
            style={{
              float: 'right',
            }}
            title={
              <span>
                {
                  <img
                    src={user.headImg}
                    style={{ width: 20, height: 20, borderRadius: '50%', marginRight: 10 }}
                    alt=""
                  />
                }
                {user.userName}
              </span>
            }
          >
            <Menu.Item key="logout">退出登录</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    </Layout.Header>
  );
};

export default Header;
