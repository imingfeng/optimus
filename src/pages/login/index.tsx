import React, { useState, useEffect, FC } from 'react';
import { connect } from 'dva';
import { Checkbox, Skeleton } from 'antd';
import { localStorage, clearUserLoginToken } from '@/utils';
import moment from 'moment';
import _ from 'lodash';
import { StateType } from './model';

import styles from './style.less';

import logo from '@/assets/login/logo.png'
import info from '@/assets/login/info.png'

import HeadTemp from './components/head'
import FooterTemp from './components/footer'

import WXCodeTemp from './components/wx';
import NoteTemp from './components/note';
import AutoTemp from './components/auto';

// import AmimationTemp from './components/animation';

interface LoginProps {
  dispatch: any;
  login: {
    loginLoading: boolean;
  }
}

const Login: FC<LoginProps> = (props) => {
  const { dispatch, login: { loginLoading, wxLoading } } = props;
  const lastLoginTime = Number(localStorage.get('lastLoginTime'));
  let autoLoginInit: boolean = localStorage.get('userRemember') === '1' ? true : false;;
  let valid: boolean = true; // 是否在有效期
  const userInfo = localStorage.getJson('userInfo');

  // 清空缓存中的用户信息
  const clearUser = () => {
    clearUserLoginToken();
  }

  // 有效期 5 天
  if (lastLoginTime) {
    valid = moment().isBefore(moment(lastLoginTime).add(5, 'days'))

    if (!valid) {
      autoLoginInit = false;
    }
  }

  // 缓存中没值
  if (_.isEmpty(userInfo)) {
    autoLoginInit = false;
  }

  const [activeTab, setActiveTab] = useState(1);
  const changeTab = (): void => {
    let key = 1;
    if (activeTab === 1) {
      key = 2;
    }
    setActiveTab(key)
  }
  const headProps = {
    activeTab,
    changeTab,
  }

  const [autoLogin, setAutoLogin] = useState(autoLoginInit);
  const [remember, setRemember] = useState(false);

  const onChange = (e: any) => {
    let checked = e.target.checked;

    setRemember(checked);

    localStorage.set({
      'userRemember': checked ? 1 : 0
    });
  }

  const continueProps = {
    logout: () => {
      setAutoLogin(false);
      clearUser();
    },

    onLogin: () => {
      dispatch({
        type: 'login/fetchAutoLogin',
        onError: () => {
          setAutoLogin(false);
          clearUser();
        }
      })
    },

    userInfo,
    loginLoading,
  }

  const noteProps = {
    loginLoading,
    onLogin: (payload: any) => {
      clearUser();
      localStorage.set({
        'userRemember': remember ? 1 : 0
      });
      dispatch({
        type: 'login/fetchLogin',
        payload,
      })
    },
    onSendCode: (payload: any, success: any, error: any): void => {
      dispatch({
        type: 'login/fetchMobileCheck',
        payload,
        successBack: success,
        errorBack: error,
      })
    },
  }

  const skeletonProps = {
    active: true,
    paragraph: {
      rows: 8,
    }
  }

  return (
    <div className={styles.bodyContent}>
      <div className={styles.headerTop}>
        <div className={styles.content}>
          <img src={logo} alt="" />
        </div>
      </div>
      <div className={styles.mainBox}>
        <div className={styles.mainContent}>
          <div className={styles.mainInfo}>
            <img src={info} alt="" />
          </div>
          <div className={styles.main}>
            <div className={styles.content}>
              {
                wxLoading ? (
                  <Skeleton {...skeletonProps} />
                ) : autoLogin ? (
                  <AutoTemp {...continueProps} />
                ) : (
                      <>
                        <HeadTemp {...headProps} />
                        <div>
                          <div className={styles.wxContent} style={{ display: activeTab === 2 ? 'none' : 'block', position: 'relative' }}>
                            <WXCodeTemp />
                          </div>
                          <div style={{ display: activeTab === 1 ? 'none' : 'block' }}>
                            <NoteTemp {...noteProps} />
                          </div>
                        </div>
                        <div className={styles.autoLogin}>
                          <Checkbox onChange={onChange} checked={remember}>下次自动登录</Checkbox>
                        </div>
                      </>
                    )
              }
            </div>
          </div>
        </div>
      </div>
      <FooterTemp />
    </div>
  );
};

export default connect(({ login }: {
  login: StateType
}) => ({
  login,
}))(Login);
