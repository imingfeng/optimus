import React, { useState, FC } from 'react';
import styles from './../style.less';

interface FooterProps {

}

const Footer: FC<FooterProps> = (props: any) => {
  return (
    <div className={styles.footerBottom}>
      <div className={styles.content}>
        <div>
          <span style={{ paddingRight: '40px' }}><i className="iconfont">&#xe6ba;</i>成都市高新区天府软件园E5-501</span>
          <span><i className="iconfont" style={{ fontSize: '18px' }}>&#xe7ce;</i>028 6271 2801</span>
        </div>
        <div className={styles.copyright}>
          <span style={{ paddingRight: '12px' }}>© 2020 成都大农科技有限公司版权所有.</span>
          <a href="http://www.beian.miit.gov.cn/" target="_blank">蜀ICP备18026508号</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;