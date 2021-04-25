import React, { useState, FC } from 'react'
import { Button } from 'antd'
import Link from 'umi/link';

// demo跳转使用，可以删除
export default () => {
  return (
    <>
      <div className="pageBox">
        <Link to="/form/step/add">
          <Button>添加</Button>
        </Link>
        <Link to="/form/basic/edit/1" style={{ marginLeft: '24px' }}>
          <Button>编辑</Button>
        </Link>
      </div>
    </>
  )
}