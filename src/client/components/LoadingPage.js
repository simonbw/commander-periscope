import { CircularProgress, withTheme } from 'material-ui';
import React from 'react';
import styles from '../../../styles/LoadingPage.css';
import FloatingText from './FloatingText';

const LoadingPage = () => (
  <div className={styles.LoadingPage}>
    <FloatingText>
      <h1>Loading...</h1>
    </FloatingText>
    <FloatingCircularProgress/>
  </div>
);

const FloatingCircularProgress = withTheme()(({ theme }) => {
  return (
    <CircularProgress
      style={{
        // TODO: Use withStyles
        color: '#FFFFFF',
        // TODO: Pull shadow from theme
        filter: 'drop-shadow(0 1px 5px rgba(0, 0, 0, 0.2)) drop-shadow(0 2px 2px rgba(0, 0, 0, 0.14))',
      }}
      size={80}
      thickness={8}
    />
  );
});

export default LoadingPage;