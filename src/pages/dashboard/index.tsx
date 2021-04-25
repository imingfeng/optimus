import Redirect from 'umi/redirect';
import React, { useState, FC } from 'react';

export default () => {
  const [login, setLogin] = useState(true);
  const [redirectRrl, setRedirectRrl] = useState('/dashboard/board');

  return <Redirect to={redirectRrl} />
};
