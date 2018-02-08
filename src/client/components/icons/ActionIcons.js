import React from 'react';
import AvatarIcon from './AvatarIcon';
import { MineIcon } from './SystemIcons';

export const DetonateMineIcon = () => (
  <MineIcon/>
);

export const MoveIcon = () => (
  <AvatarIcon style={{ background: '#1188BB' }}>M</AvatarIcon>
);

export const SurfaceIcon = () => (
  <AvatarIcon style={{ background: '#114477' }}>S</AvatarIcon>
);
