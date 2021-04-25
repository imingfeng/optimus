/* global window */
/* global document */
/* global location */
/* eslint no-restricted-globals: ["error", "event"] */

import router from 'umi/router';
import { parse } from 'qs';
import * as config from '@/config';
import app from '@/services/app';
// import * as menusService from 'services/menus'
import queryString from 'query-string';
import * as _localStorage from '../utils/_localStorage';
import { treeToArray, Model, clearUserLoginToken } from '@/utils';

const roleDatas = {
  userId: 693,
  roles: ['1001']
}

interface IProps {
  dispatch:any;
  history:any;
  listen: any;
}

const menuPrivilegesSetting = (menu: any): any => {
  let levelOneMenu = (menu && menu.filter((item: any) => !item.bpid).map((_item: any) => _item.name)) || [];
  // 市场推广角色
  const marketingMenus = ['商品管理', '店铺管理', '商铺运营', '订单管理', '店铺克隆'];
  // 客服服务
  const customerServicesMenus = ['商品管理', '店铺管理', '店铺克隆', '商铺运营', '订单管理', '在线聊天'];
  // 仓库管理
  const warehouseManagement = ['订单管理'];
  // 运营管理
  const operationsManagement = levelOneMenu;
  // 植物医生
  const drPlant = levelOneMenu;
  //roleId  1:运营管理,2:植物医生,3:市场推广,4:客服,5：仓库管理
  return {
    1: operationsManagement,// 运营管理
    2: drPlant,// 植物医生
    3: marketingMenus, // 市场推广
    4: customerServicesMenus, // 客服
    5: warehouseManagement // 仓库管理
  };
};

const { Menus, base } = config;
const { prefix } = base;

export default Model.extend({
  namespace: 'app',
  state: {
    user: {},
    userRoles: [],
    isLogin: false, // 是否登陆
    permissions: { // 用户权限
      visit: []
    },
    menu: Menus,
    initMenu: Menus,
    menuPopoverVisible: false,
    siderFold: _localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: true,
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(_localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: JSON.parse(_localStorage.getItem(`${prefix}locationPathname`)) || '',
    locationQuery: {},
    is404: false,
    userIsMember: false,
  },
  subscriptions: {
    setup(props:IProps) {
      const { dispatch, history, listen } = props;

      // 监听路由变化，保存历史访问页面，用来在登陆后回到之前的打开的页面
      history.listen((location: any) => {
        const pathname = location.pathname;
        const query = location.query;
        // 多个页面同时打开，其中一个页面退出操作。
        if (pathname !== '/login') {
          // todo 打开登陆校验
          // dispatch({
          //   type: 'queryLogin',
          //   payload: { pathname }
          // });

          // dispatch({
          //   type: 'userDetail',
          // })
        }

        // 403 判断
        dispatch({
          type: 'checkIs404'
        });

        window.localStorage.setItem(`${prefix}locationPathname`, JSON.stringify(pathname));
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: pathname,
            locationQuery: query
          }
        });
      });
      // 页面首次载入时调用
      let tid: any;
      window.onresize = () => {
        clearTimeout(tid);
        tid = setTimeout(() => {
          dispatch({
            type: 'changeNavbar'
          });
        }, 300);
      };
    }
  },
  effects: {
    // 查询用户权限，
    * queryPermissions({ payload }: any, { call, put, select }: any) {
      // const content = yield call(app.permissions, payload)
      // 权限查询成功
      // const {
      //   list,
      // } = yield call( menusService.query )
      // const {
      //   // realName,
      //   // roles,
      // } = content
      // 匹配菜单
      let { initMenu, permissions, locationPathname } = yield select(_ => _.app);

      // let formatRoles = treeToArray(roles)

      // 有权访问的地方
      // const visit = formatRoles.map(item => item.id)

      // 匹配菜单的 roleId 返回新的菜单
      // let menu = initMenu.filter(item => visit.includes(item.roleId) )
      // permissions.visit = menu.map(item => item.id)
      const { pathname } = payload;
      let menu = initMenu;
      permissions.visit = menu;
      let roleMenus = [];
      const { user, userRoles } = yield select(_ => _.app);
      const { role } = user;
      /**begin 菜单权限**/
      const menuType = menuPrivilegesSetting(initMenu);
      const menusId = menuType[role] && menuType[role].map((item: any) => {
        let id = null;
        menu.some((v: any) => {
          if (v.name === item) {
            id = v.id;
            return false;
          }
        });
        return id;
      }).filter((_i: any) => _i);
      const _menu = menusId && menu.filter(((item: any) => {
        let flag = false;
        menusId.some((v: any) => {
          if (v === item.id || item.bpid === v || item.topId === v) {
            flag = true;
            return false;
          }
        });
        return flag;
      }));
      roleMenus = Object.keys(menuType).includes(String(role)) ? _menu : menu;
      /**end 菜单权限**/
      yield put({
        type: 'updateState',
        payload: {
          permissions,
          menu: roleMenus
        }
      });
      if (!roleMenus.find((item: any) => {
        const menusR = item.route.split('/');
        const menusP = new Set(pathname.split('/'));
        return menusR.filter((v: any) => menusP.has(v)).length >= 2;
      })) {
        router.push({
          pathname: roleMenus[0]['route'] || roleMenus[1]['route']
        });
      } else if (location.pathname === '/login' || !locationPathname || locationPathname === '/') {
        router.push({
          pathname: '/dashboard/general'
        });
      }
    },
    // 查询登陆状态
    * queryLogin({ payload }: any, { put, select, call }: any) {
      // 读取当地的localstorage的登陆信息
      const { locationPathname, user, permissions: { visit } } = yield select(_ => _.app);
      const isLogin = _localStorage.get('admin_isLogin');
      // const userData = yield call(app.userInfo);
      yield put({
        type: 'updateState',
        payload: {
          user,
          isLogin: isLogin || false
        }
      });
      // 如果没有登陆 去登陆页面
      if (!isLogin) {
        clearUserLoginToken();
        router.push({
          pathname: '/login',
          query: {
            from: locationPathname
          },
        });
      }
      // } else if(!visit.length){ // 没有权限去查询菜单权限，登陆用户信息等
      else {
        yield put({
          type: 'queryPermissions',
          payload
        });
      }
    },
    // 退出登陆
    * logout(active: any, { call, put }: any) {
      // const tk = _localStorage.get('token');
      // console.log(tk);
      // if (tk) {
      //   yield call(app.logout, parse({ token: tk }));
      // }
      _localStorage.set({ 'admin_isLogin': '' });
      yield put({
        type: 'updateState',
        payload: {
          user: {},
          isLogin: false,
          permissions: {
            visit: []
          },
          menu: []
        }
      });
      yield put({
        type: 'queryLogin'
      });
    },

    // 用户信息
    *userDetail({ payload }: any, { call, update, put }: any) {
      let userInfo = _localStorage.getJson('userInfo');

      if (!userInfo.id) {
        userInfo = yield call(app.userInfo);
        yield put('fetchUserRoles')
      }

      if (!userInfo.headImg) {
        userInfo.headImg = config.source.defaultHead;
      }

      _localStorage.setJson('userInfo', userInfo);
      yield update({
        user: userInfo,
      });

      // yield put({
      //   type: 'messageUnread',
      // });
    },

    * changeNavbar(action: any, { put, select }: any) {
      const { app } = yield (select(_ => _));
      const isNavbar = document.body.clientWidth < 769;
      if (isNavbar !== app.isNavbar) {
        yield put({
          type: 'handleNavbar',
          payload: isNavbar
        });
      }
    },
    * checkIs404(active:any, { select, put }:any) {
      const { initMenu, locationPathname } = yield select(_ => _.app);
      // 当前路由的pathname
      const pathname = locationPathname;
      // 判断initMenu 中是否有pathname

      const is404 = !initMenu.some((item: any) => {
        return item.route === pathname;
      });

      yield put({
        type: 'updateState',
        payload: {
          is404
        }
      });
    },

    // 用户角色
    * fetchUserRoles({ payload }: any, { call, update }: any) {
      const data = yield call(app.userRoles, { ...payload });
      _localStorage.setJson('userRoles', data.roles);
      _localStorage.setJson('userIsMember', data.beMember);
      yield update({
        userIsMember: data.beMember
      })
    }

  },
  reducers: {
    updateState(state, {
      payload
    }) {
      return {
        ...state,
        ...payload
      };
    },

    switchSider(state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold);
      return {
        ...state,
        siderFold: !state.siderFold
      };
    },

    switchMenuPopver(state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible
      };
    },

    handleNavbar(state, {
      payload
    }) {
      return {
        ...state,
        isNavbar: payload
      };
    },

    handleNavOpenKeys(state, {
      payload: navOpenKeys
    }) {
      return {
        ...state,
        ...navOpenKeys
      };
    }
  }
});
