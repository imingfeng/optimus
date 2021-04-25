import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { arrayToTree, queryArray } from '@/utils';
import pathToRegexp from 'path-to-regexp';
import styles from './Layout.less';

const { SubMenu } = Menu;
let openKeysFlag = false;

interface IMenusProps {
  siderFold: boolean;
  navOpenKeys: any;
  changeOpenKeys: any;
  menu: any;
  location: any;
  darkTheme?: boolean;
}

const Menus = (props: IMenusProps) => {
  let { siderFold, darkTheme, navOpenKeys, changeOpenKeys, menu, location } = props;

  let userRoles = localStorage.getItem('userRoles')
  if (userRoles) {
    userRoles = JSON.parse(userRoles)
  }

  if (userRoles && userRoles.length && !userRoles.includes('1001')) {
    menu = menu.filter((item: any) => item.route !== '/dashboard/map')
  }

  let mainContainer = document.getElementById('mainContainer')
  if (mainContainer) {
    const exceptRoutes = ['/dashboard/map', '/plant/map']
    if (exceptRoutes.includes(location.pathname)) {
      mainContainer.style['overflow'] = 'hidden'
    } else {
      mainContainer.style.overflow = 'auto'
    }
  }

  // 生成树状
  const menuTree = arrayToTree(
    menu.filter((item: any) => item.mpid !== '-1'),
    'id',
    'mpid',
  );
  let levelMap: any;
  levelMap = {};

  // console.log('menuTree', menuTree, menu)

  const EmptyIcon = (
    <i style={{ width: '6px', display: 'inline-block' }}></i>
  )

  // 递归生成菜单
  const getMenus = (menuTreeN: any[], siderFoldN: boolean) => {
    // console.log('menuTreeN', menuTreeN);
    return menuTreeN.map(item => {
      if (item.children) {
        if (item.mpid) {
          levelMap[item.id] = item.mpid;
        }
        return (
          <SubMenu
            key={item.id}
            title={
              <span style={siderFoldN ? { display: 'flex', justifyContent: 'center' } : {}}>
                {item.icon || EmptyIcon} {/* icon空占位 */}
                {siderFoldN && ''}
                {(!siderFoldN || !menuTree.includes(item)) && item.name}
              </span>
            }
          >
            {getMenus(item.children, siderFoldN)}
          </SubMenu>
        );
      }
      const currentHref = window.location.pathname;
      return (
        <Menu.Item key={item.id}>
          {
            currentHref !== item.route ? (
              <Link to={item.route || '#'} style={siderFoldN ? { width: 10 } : {}}>
                {item.icon}
                {/* 三级菜单去掉padding-left，不然过宽 */}
                <span style={item.lev === 2 ? { paddingLeft: '10px' } : {}}>{item.name}</span>
              </Link>
            ) : (
                <div>
                  {item.icon}
                  {/* 三级菜单去掉padding-left，不然过宽 */}
                  <span style={item.lev === 2 ? { paddingLeft: '10px' } : {}}>{item.name}</span>
                </div>
              )
          }
        </Menu.Item>
      );
    });
  };
  const menuItems = getMenus(menuTree, siderFold);

  // 保持选中
  const getAncestorKeys = (key: number) => {
    let map: any;
    map = {};
    const getParent = (index: any) => {
      const result = [String(levelMap[index])];
      if (levelMap[result[0]]) {
        result.unshift(getParent(result[0])[0]);
      }
      return result;
    };
    for (let index in levelMap) {
      if ({}.hasOwnProperty.call(levelMap, index)) {
        map[index] = getParent(index);
      }
    }
    return map[key] || [];
  };

  const onOpenChange = (openKeys: any) => {
    if (navOpenKeys.length) changeOpenKeys([]), (openKeysFlag = true);
    const latestOpenKey = openKeys.find((key: any) => !navOpenKeys.includes(key));
    const latestCloseKey = navOpenKeys.find((key: any) => !openKeys.includes(key));
    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = getAncestorKeys(latestCloseKey);
    }
    changeOpenKeys(nextOpenKeys);
  };

  let menuProps = !siderFold
    ? {
      onOpenChange,
      openKeys: navOpenKeys,
    }
    : {};

  // 寻找选中路由
  let currentMenu;
  let defaultSelectedKeys;
  for (let item of menu) {
    if (item.route && pathToRegexp(item.route).exec(location.pathname)) {
      if (!navOpenKeys.length && item.mpid && !openKeysFlag) changeOpenKeys([String(item.mpid)]);
      currentMenu = item;
      break;
    }
  }
  const getPathArray = (array: [], current: any, pid: any, id: any) => {
    let result = [String(current[id])];
    const getPath = (item: any) => {
      if (item && item[pid]) {
        if (item[pid] === '-1') {
          result.unshift(String(item['bpid']));
        } else {
          result.unshift(String(item[pid]));
          getPath(queryArray(array, item[pid], id));
        }
      }
    };
    getPath(current);
    return result;
  };
  if (currentMenu) {
    defaultSelectedKeys = getPathArray(menu, currentMenu, 'mpid', 'id');
  }

  if (!defaultSelectedKeys) {
    defaultSelectedKeys = ['1'];
  }

  return (
    <Menu
      {...menuProps}
      mode={siderFold ? 'vertical' : 'inline'}
      theme={'dark'}
      selectedKeys={defaultSelectedKeys}
      className={styles.sidemenu}
    >
      {menuItems}
    </Menu>
  );
};

export default Menus;
