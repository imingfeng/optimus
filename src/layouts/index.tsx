import React from 'react';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import withRouter from 'umi/withRouter';
import App from './app';

export default withRouter(props => {
  return (
    <ConfigProvider locale={zh_CN}>
      <App>{props.children}</App>
    </ConfigProvider>
  );
});
