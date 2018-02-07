import classnames from 'classnames';
import React from 'react';
import styles from '../../../styles/FloatingText.css';

const FloatingText = ({ children, className, ...otherProps }) => (
  <div className={classnames(styles.FloatingText, className)} {...otherProps}>
    {children}
  </div>
);

export default FloatingText;