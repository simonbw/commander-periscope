import { Avatar, withStyles } from 'material-ui';
import React from 'react';

// An avatar the size of an icon
export default withStyles(() =>
  ({
    root: {
      'height': '24px',
      'width': '24px',
      'font-size': '0.8rem',
      'font-family': 'sans-serif',
    }
  }))(Avatar);
