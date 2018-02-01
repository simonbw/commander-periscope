import { Avatar } from 'material-ui';
import React from 'react';
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from '../../common/Role';

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

export const getAvatarForRole = (role) => {
  switch (role) {
    case CAPTAIN:
      return CaptainAvatar();
    case FIRST_MATE:
      return FirstMateAvatar();
    case RADIO_OPERATOR:
      return RadioOperatorAvatar();
    case ENGINEER:
      return EngineerAvatar();
  }
  throw new Error(`Invalid role: ${role}`);
};
