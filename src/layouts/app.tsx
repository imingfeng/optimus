import React, { FC } from 'react';
import NProgress from 'nprogress';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import { Loader, MyLayout } from '@/components';
import { BackTop, Layout } from 'antd';
// import classnames from 'classnames'
import * as config from '@/config';
import { Helmet } from 'react-helmet';
// import { withRouter } from 'dva/router';
import withRouter from 'umi/withRouter';
import Error from '../pages/404';
import '../themes/index.less';
import './app.less';

interface IAppProps {
  children: any;
  location: any;
  dispatch: any;
  app: any;
  target: any;
  loading: any;
}

const { Content, Sider } = Layout;
const { Header, Bread, styles } = MyLayout;
const { prefix, openPages } = config.base;

let lastHref: any;

const App: FC<IAppProps> = (props: any) => {
  const { children, dispatch, app, loading, location } = props;
  const { user, siderFold, isNavbar, menuPopoverVisible, navOpenKeys, menu, permissions } = app;
  let { pathname } = location;
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const current = menu.filter((item: any) => pathToRegexp(item.route || '').exec(pathname));
  // todo permission
  const hasPermission = current.length ? permissions.visit.includes(current[0].id) : false;
  const { href } = window.location;

  if (lastHref !== href) {
    NProgress.start();
    if (!loading.global) {
      NProgress.done();
      lastHref = href;
    }
  }

  const headerProps = {
    menu,
    user,
    location,
    siderFold,
    isNavbar,
    menuPopoverVisible,
    navOpenKeys,
    switchMenuPopover() {
      dispatch({ type: 'app/switchMenuPopver' });
    },
    logout() {
      dispatch({ type: 'app/logout' });
    },
    switchSider() {
      dispatch({ type: 'app/switchSider' });
    },
    changeOpenKeys(openKeys: any) {
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } });
    },
  };

  const siderProps = {
    menu,
    location,
    siderFold,
    navOpenKeys,
    changeTheme() {
      dispatch({ type: 'app/switchTheme' });
    },
    changeOpenKeys(openKeys: any) {
      window.localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys));
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } });
    },
  };

  const breadProps = {
    menu,
    location,
  };

  if (openPages && openPages.includes(pathname)) {
    return (
      <div>
        <Loader fullScreen={true} spinning={loading.effects['app/query']} />
        {children}
      </div>
    );
  }

  return (
    <div>
      <Loader fullScreen spinning={loading.effects['app/query']} />
      <Layout className={styles.dark}>
        {!isNavbar && (
          <Sider width="220" trigger={null} collapsible collapsed={siderFold}>
            {siderProps.menu.length === 0 ? null : <MyLayout.Sider {...siderProps} />}
          </Sider>
        )}
        <Layout style={{ height: '100vh', overflow: 'scroll' }} id="mainContainer">
          <Header {...headerProps} />
          <Content className={pathname === '/contact' ? 'full-screen-container' : ''}>
            <Bread {...breadProps} />
            {children}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(App));
