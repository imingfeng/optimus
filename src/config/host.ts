import HOST_ENV from './env';
import _ from 'lodash';
// 通过gateway分发，业务服务在SERVERS中，通常维护SERVERS即可

const gateway: any = {
  // local
  DEV: {
    gateway: '//qa-gateway.worldfarm.com',
  },
  // qa
  QA: {
    gateway: '//qa-gateway.worldfarm.com',
  },
  PROD: {
    gateway: '//gateway.worldfarm.com',
  },
};

const servers: any = {
  SSO: '/world-passport',
  IM: '/world-sms',
  USER: '/world-user',
  DATA: '/world-report',
  FARM: '/world-gather',
  KOALA: '/world-koala',
  TARDE: '/world-trade',
  KANGAROO: '/world-kangaroo',
  FCBEE: '/fc-bee',
  FCREPORT: '/fc-report',
  FCTRADE: '/fc-trade'
};

const getHost = () => {
  if (HOST_ENV === 'mock') {
    return Object.keys(servers).reduce((obj: any, host) => {
      obj[host] = 'http://localhost:8000';
      return obj;
    }, {});
  }
  let hostEnv = HOST_ENV.toLocaleUpperCase();
  let _servers: any = {};
  Object.keys(servers).map(serverHost => {
    _servers[serverHost] = gateway[hostEnv].gateway + servers[serverHost];
  });
  _.assign(_servers, {
    ...gateway[hostEnv],
  })
  return _servers;
};
export default getHost();

