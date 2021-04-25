// import { icon } from './icon'
import React from 'react';

import {
  FundViewOutlined,
  FileSearchOutlined,
  SnippetsOutlined,
  FormOutlined,
} from '@ant-design/icons';

const originMenus = [
  {
    name: 'Dashboard',
    icon: <FundViewOutlined />,
    children: [
      {
        name: '分析页',
        route: '/dashboard/board',
      },
    ]
  },
  {
    name: '列表页',
    icon: <FileSearchOutlined />,
    children: [
      {
        name: '空页面',
        route: '/list/frame'
      },
      {
        name: '基础列表',
        route: '/list/base',
      },
      {
        name: '操作列表',
        route: '/list/simple',
      },
      {
        name: '标签操作列表',
        route: '/list/tagadd',
      },
      {
        name: '排序列表',
        route: '/list/base-list',
      },
    ]
  },
  {
    name: '详情页',
    icon: <SnippetsOutlined />,
    children: [
      {
        name: '基础详情页',
        route: '/detail/basic/87',
        children: [
          {
            name: '添加分组',
            route: '/supply/author/add',
            display: false,
          },
        ]
      }
    ]
  },
  {
    name: '表单页',
    icon: <FormOutlined />,
    children: [
      {
        name: '基本表单',
        route: '/form/basic/add',
        children: [
          {
            name: '添加',
            route: '/form/basic/add',
            display: false,
          },
          {
            name: '编辑',
            route: '/form/basic/edit/:id',
            display: false,
          },
        ]
      },
      {
        name: '分步表单',
        route: '/form/step/add',
        children: [
          {
            name: '添加',
            route: '/form/step/add',
            display: false,
          },
          {
            name: '编辑',
            route: '/form/step/edit/:id',
            display: false,
          },
        ]
      }
    ]
  }
];

const getMenusArray = () => {
  let menus: any = [];
  let topId: any = null; // 存储一级菜单id
  const getMenu = (_menus: any, serial: any, lev?: number) =>
    _menus.forEach((item: any, index: any) => {
      const {
        children = [],
        siblings = [],
        name = '',
        route = '',
        icon = '',
        display = true,
      } = item;
      const id = `${serial}${index + 10}`;
      let mpid = display ? serial : '-1';
      if (lev === 1) {
        topId = id;
        if (display) mpid = '';
      }
      if (lev === 3) mpid = '-1';
      let nextLev = id.slice(1).length / 2

      menus.push({
        id,
        name,
        display,
        bpid: serial,
        mpid,
        route,
        topId,
        lev: nextLev,
        icon,
      });
      if (children.length > 0) getMenu(children, id);
      if (siblings.length > 0) getMenu(siblings, id, 3);
    });
  getMenu(originMenus, 0, 1);
  return menus;
};
const resultMenus = getMenusArray();

export default resultMenus;
