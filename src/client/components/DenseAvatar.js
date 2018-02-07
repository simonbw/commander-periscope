import { Avatar, withStyles } from 'material-ui';
import React from 'react';

const DenseAvatar = withStyles(() =>
  ({
    root: {
      'height': '24px',
      'width': '24px',
      'font-size': '0.8rem',
      'font-family': 'sans-serif',
    }
  }))(Avatar);

export default DenseAvatar;