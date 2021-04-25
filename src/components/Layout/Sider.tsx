import React from 'react';
import { source } from '@/config';
import styles from './Layout.less';
import Menus from './Menu';

interface ISiderProps {
  menu: any;
  siderFold: boolean;
  location: any;
  changeTheme: any;
  navOpenKeys: any;
  changeOpenKeys: any;
}

const Sider = (props: ISiderProps) => {
  const { siderFold, location, changeTheme, navOpenKeys, changeOpenKeys, menu } = props;

  const menusProps = {
    menu,
    siderFold,
    location,
    navOpenKeys,
    changeOpenKeys,
  };
  return (
    <div>
      <div className={styles.logo}>
        {siderFold ? (
          // <img alt="logo" src={source.logoIcon} />
          <span>擎天柱</span>
        ) : (
          // <img alt="logo" src={source.logo} 
          <span>擎天柱管理平台</span>
        )}
      </div>
      <Menus {...menusProps} />
    </div>
  );
};

export default Sider;
