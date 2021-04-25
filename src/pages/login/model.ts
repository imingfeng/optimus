import services from './service'
import { Model, localStorage } from '@/utils'
import { message } from 'antd'

export interface StateType {
  loginLoading: boolean
  redirectUrl: string
  authCode: string
  wxLoading: boolean
}

export interface ModelType {
  namespace: string
  state: StateType
  effects: {
    fetchLogin: any
    fetchAutoLogin: any
    fetchCode: any
    fetchMobileCheck: any
  };
  reducers: {
    filter: any
  }
}

export default Model.extend({
  namespace: 'login',
  state: {
    loginLoading: false,
    wxLoading: false,
    redirectUrl: '',
    authCode: '',
  },

  subscriptions: {
    setup({ dispatch, listen }: any) {
      listen('/login', (e: any) => {
        const { query: { from, code } } = e;
        let redirectUrl = '/dashboard/board';
        if (from) {
          redirectUrl = from;
        }

        dispatch({
          type: 'updateState',
          payload: {
            redirectUrl,
            authCode: code
          }
        });

        if (code) {
          dispatch({
            type: 'fetchWxAuthLogin',
          })
        }
      });
    }
  },
  effects: {
    * fetchLogin({ payload }: any, { update, call, select }: any) {
      const { redirectUrl } = yield select((_: any) => _.login);

      // 调试直接登录
      message.success('登录成功');
      location.href = redirectUrl
      return

      yield update({
        loginLoading: true,
      })
      const data = yield call(services.fetchLogin, {
        appId: 'FLOWER_CHASERS',
        deviceType: 'WEB',
        ...payload,
      });
      if (data.status === 'OK') {
        localStorage.setJson('userToken', data.content);

        const checkData = yield call(services.fetchCheck);
        if (checkData.status === 'OK') {
          message.success('登录成功');
          location.href = redirectUrl
        } else {
          message.error(checkData.errorMsg);
        }
      } else {
        message.error(data.errorMsg);
      }

      yield update({
        loginLoading: false,
      })
    },

    * fetchAutoLogin({ payload, onError }: any, { call, update, select }: any) {
      const { redirectUrl } = yield select((_: any) => _.login);

      yield update({
        loginLoading: true,
      })

      const userToken = localStorage.getJson('userToken');
      const data = yield call(services.fetchAutoLogin, {
        ...userToken,
      });

      if (data.status === 'OK') {
        localStorage.setJson('userToken', data.content);

        const checkData = yield call(services.fetchCheck);
        if (checkData.status === 'OK') {
          localStorage.set({
            'lastLoginTime': (new Date).getTime(),
          });
          message.success('登录成功');
          location.href = redirectUrl
          setTimeout(() => {
            localStorage.removeLocalItem('userInfo')
          }, 0)
        } else {
          message.error(checkData.errorMsg);
        }
      } else {
        message.error(data.errorMsg);

        onError && onError();
      }

      yield update({
        loginLoading: false,
      })
    },

    * fetchWxAuthLogin({ payload }: any, { call, update, select }: any) {
      const { redirectUrl, authCode } = yield select((_: any) => _.login);
      const loginUrl = `${location.origin}${location.pathname}?from=${redirectUrl}`

      const linkTo = (url = '') => {
        if (!url) {
          return
        }
        setTimeout(() => {
          location.href = url
        }, 1000)
      }

      yield update({
        wxLoading: true,
      })

      const data = yield call(services.fetchWxLogin, {
        appId: 'FLOWER_CHASERS',
        deviceType: 'WEB',
        authType: 'WECHAT',
        code: authCode,
        ...payload,
      });
      if (data.status === 'OK') {
        localStorage.setJson('userToken', data.content);

        const checkData = yield call(services.fetchCheck);
        if (checkData.status === 'OK') {
          message.success('登录成功');

          linkTo(redirectUrl)
        } else {
          message.error(checkData.errorMsg)

          linkTo(loginUrl)
        }
      } else {
        message.error(data.errorMsg)

        linkTo(loginUrl)
      }

      // yield update({
      //   wxLoading: false,
      // })
    },

    * fetchCode({ payload, successBack, errorBack }: any, { callWithMessage }: any) {
      successBack && successBack();

      try {
        const data = yield callWithMessage(services.fetchCode, {
          bizType: 'MS_LOGIN',
          ...payload,
        });
        if (data.status === 'OK') {
          message.success('验证码已发送，请注意查看手机');
        } else {
          message.error(data.errorMsg);
          errorBack && errorBack();
        }
      } catch (error) {
        message.error('网络异常');
        errorBack && errorBack();
      }
    },

    * fetchMobileCheck({ payload, successBack, errorBack }: any, { callWithMessage, put }: any) {

      const data = yield callWithMessage(services.fetchMobileCheck, {
        appId: 'FLOWER_CHASERS',
        ...payload,
      });

      if (!data) {
        message.error('用户未注册');
        errorBack && errorBack();
      } else {
        yield put({
          type: 'fetchCode',
          payload,
          successBack,
          errorBack,
        });
      }
    },
  },

  reducers: {
    // 筛选
    filter(state: any, { payload }: any) {
      return {
        ...state,
        as: { ...payload }
      };
    },
  }
});
