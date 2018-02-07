import { CircularProgress, withTheme } from 'material-ui';
import React, { Component } from 'react';
import style from '../../../../styles/SurfacedPage.css';
import FloatingText from '../FloatingText';

class SurfacedPage extends Component {
  render() {
    return (
      <div id="surface-page" className={style.SurfacedPage}>
        <FloatingText>
          <h1>Surfacing...</h1>
        </FloatingText>
        <FloatingCircularProgress/>
      </div>
    );
  }
}

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

export default SurfacedPage;