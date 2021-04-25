import React, { Component } from 'react'
import { connect } from 'dva'
import { Card } from 'antd';
import styles from './index.less'

interface IProps {
  title?: string;
  bodyStyle?: object;
  cardProps?: object;
}

const CardModule: React.FC<IProps> = (props: any) => {
  const { title, bodyStyle = {}, cardProps = {} } = props
  let _cardProps = {
    bordered: false,
    title,
    ...cardProps,
  }
  return (
    <div className="panelDescList">
      <div className={styles.panelDescBox}>
        <Card {..._cardProps}>
          <div className="panelBody" style={bodyStyle}>
            {props.children}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default CardModule;
