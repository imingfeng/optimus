import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import { queryArray } from '@/utils';
import styles from './Layout.less';

interface IBreadProps {
  menu: any;
  location: any;
}

const exceptRoutes = ['/dashboard/map', '/plant/map']

const Bread = (props: IBreadProps) => {
  const { menu, location } = props;

  // 匹配当前路由
  let pathArray = [];
  let current;
  for (let index in menu) {
    if (menu[index].route && pathToRegexp(menu[index].route).exec(location.pathname)) {
      current = menu[index];
      break;
    }
  }

  const getPathArray = (item: any) => {
    pathArray.unshift(item);
    if (item.bpid) {
      getPathArray(queryArray(menu, item.bpid, 'id'));
    }
  };

  let paramMap: any;
  paramMap = {};
  if (!current) {
    pathArray.push(
      menu[0] || {
        id: 1,
        icon: 'laptop',
        name: 'Dashboard',
      },
    );
    pathArray.push({
      id: 404,
      name: 'Not Found',
    });
  } else {
    getPathArray(current);

    let keys: any[];
    keys = [];

    let values: any;
    values = pathToRegexp(current.route, keys).exec(location.pathname.replace('#', ''));

    if (keys.length) {
      keys.forEach((currentValue, index) => {
        if (typeof currentValue.name !== 'string') {
          return;
        }
        paramMap[currentValue.name] = values[index + 1];
      });
    }
  }

  // 递归查找父级
  // pathArray.shift();
  const breads =
    pathArray.length > 0
      ? pathArray.map((item, key) => {
          const content = (
            <span>
              {/* {item.icon && item.icon} */}
              {item.name}
            </span>
          );
          return (
            <Breadcrumb.Item key={key}>
              {pathArray.length - 1 !== key && item.route ? (
                <Link to={pathToRegexp.compile(item.route || '')(paramMap) || '#'}>{content}</Link>
                ) : ( content )
              }
            </Breadcrumb.Item>
          )
        })
      : '';

  return (
    (!exceptRoutes.includes(current && current.route)) && (
      breads.length ? 
      <div className={styles.bread}>
        <Breadcrumb separator=">">{breads}</Breadcrumb>
      </div> : <></>
    )
  );

};

export default Bread;
