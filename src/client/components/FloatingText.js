import React from 'react';
import styles from '../../../styles/FloatingText.css';

const FloatingText = ({ children }) => (
  <div className={styles.FloatingText}>
    {children}
  </div>
);

export default FloatingText;