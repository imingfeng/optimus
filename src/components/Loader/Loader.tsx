import React from 'react';
import classNames from 'classnames';
import styles from './Loader.less';

interface ILoaderProps {
  spinning: boolean;
  fullScreen: boolean;
}

const Loader = (props: ILoaderProps) => {
  const { spinning, fullScreen } = props;

  return (
    <div
      className={classNames(styles.loader, {
        [styles.hidden]: !spinning,
        [styles.fullScreen]: fullScreen,
      })}
    >
      <div className={styles.warpper}>
        <div className={styles.inner} />
        <div className={styles.text}>LOADING</div>
      </div>
    </div>
  );
};

export default Loader;
