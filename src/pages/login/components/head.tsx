import React, { useState, FC } from 'react';
import styles from './../style.less';
import classnames from 'classnames'
import iconCodeLogin from '@/assets/login/code_login.png'
import iconWxLogin from '@/assets/login/wx_login.png'

interface HeadProps {
  activeTab: number
  changeTab: () => void
}

const HeadPage: FC<HeadProps> = (props) => {
  const { activeTab, changeTab } = props;

  return (
    <div className={styles.headBox}>
      {
        activeTab === 1 ? (
          <>
            <h3 className={styles.nameTitle}>扫码登录</h3>
            <p className={styles.tips}>请先在APP中绑定微信</p>
          </>
        ) : (
            <h3 className={classnames(styles.intervalContent, styles.nameTitle)}>手机号登录</h3>
          )
      }
      <div className={styles.switchover} onClick={changeTab}>
        {
          activeTab === 1 ? <img src={iconCodeLogin} alt="" /> : <img src={iconWxLogin} alt="" />
        }
      </div>
    </div>
  );
};

export default HeadPage;