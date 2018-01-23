import { Avatar } from 'material-ui';
import React from 'react';

// TODO: Real icons
const style = { fontFamily: 'sans-serif' }; // Using the main font makes these not line up
export const CaptainAvatar = () => (
  <Avatar style={style}>C</Avatar>
);

export const FirstMateAvatar = () => (
  <Avatar style={style}>F</Avatar>
);

export const EngineerAvatar = () => (
  <Avatar style={style}>E</Avatar>
);

export const RadioOperatorAvatar = () => (
  <Avatar style={style}>R</Avatar>
);
