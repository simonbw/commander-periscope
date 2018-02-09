import { Avatar, withStyles } from 'material-ui';
import React from 'react';
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from '../../../common/models/Role';

const RoleAvatar = withStyles({
  root: {
    fontFamily: 'sans-serif'
  }
})(Avatar);

export const CaptainAvatar = () => (
  <RoleAvatar>C</RoleAvatar>
);

export const FirstMateAvatar = () => (
  <RoleAvatar>FM</RoleAvatar>
);

export const EngineerAvatar = () => (
  <RoleAvatar>E</RoleAvatar>
);

export const RadioOperatorAvatar = () => (
  <RoleAvatar>RO</RoleAvatar>
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
