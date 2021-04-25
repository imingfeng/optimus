import React from 'react';
import PropTypes from 'prop-types';
import ImageClipper from './ImageClipper';

const App = ({visible, ...props}: any) => {
  let imageProps = {
    resetText: '重置',
    okText: '保存',
    ...props,
  }
  return (
    <div>
      {visible ? <ImageClipper {...imageProps} /> : null}
    </div>
  )
}

App.propTypes = {
  visible: PropTypes.bool.isRequired,
}

export default App;
