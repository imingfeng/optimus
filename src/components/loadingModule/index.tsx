import React, { FC } from 'react';
import { Skeleton } from 'antd';
import { CardModule } from '@/components';

interface PageProps {

}

const LoadingModule: FC<PageProps> = () => {
  return (
    <>
      <CardModule>
        <Skeleton active />
      </CardModule>
    </>
  );
};

export default LoadingModule