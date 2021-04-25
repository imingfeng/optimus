import { Button, Result } from 'antd';
import React, { useState } from 'react';
import router from 'umi/router';
import Redirect from 'umi/redirect';

// const NoFoundPage: React.FC<{}> = () => (
//   <Result
//     status="404"
//     title="404"
//     subTitle="你访问的页面不存在"
//     extra={
//       <Button type="primary" onClick={() => router.push('/')}>
//         回到首页
//       </Button>
//     }
//   />
// );

// export default NoFoundPage;

export default () => {
  const [login, setLogin] = useState(true);
  const [redirectRrl, setRedirectRrl] = useState('/dashboard/board');

  return <Redirect to={redirectRrl} />
};
