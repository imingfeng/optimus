import React, { useState, FC } from 'react';
import styles from './../style.less';
import { Button } from 'antd';

interface LoginProps {

}

const AutoLogin: FC<LoginProps> = (props: any) => {
  const { logout, onLogin, userInfo, loginLoading } = props;
  const { headImg, userName } = userInfo;

  const headUrl = 'https://dnkj-family-farm-prd.oss-cn-huhehaote.aliyuncs.com/data/ms-kbms/activity/img/1586394828632.jpeg';

  return (
    <div className={styles.autoSession}>
      <div className={styles.head}>
        <img src={headImg} alt="" />
      </div>
      <div className={styles.userName}>{userName}</div>
      <Button type="primary" size="large" block loading={loginLoading} onClick={onLogin}>登录</Button>
      <Button type="link" block onClick={logout} style={{ marginTop: '12px' }}>切换账号</Button>
    </div>
  );
};

export default AutoLogin;