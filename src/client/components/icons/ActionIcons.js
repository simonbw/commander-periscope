import { ArrowBack, ArrowDownward, ArrowForward, ArrowUpward, Forward, Settings } from 'material-ui-icons';
import React from 'react';
import { EAST, NORTH, SOUTH, WEST } from '../../../common/models/Direction';
import { MineIcon } from './SystemIcons';

export const DetonateMineIcon = () => (
  <MineIcon/>
);

export const MoveIcon = () => (
  <Forward nativeColor="#1188BB"/>
);

export const SurfaceIcon = () => (
  <Settings nativeColor="#1188BB"/>
);

export function getMoveIcon(direction) {
  switch (direction) {
    case NORTH:
      return <ArrowUpward/>;
    case EAST:
      return <ArrowForward/>;
    case SOUTH:
      return <ArrowDownward/>;
    case WEST:
      return <ArrowBack/>;
    default:
      throw new Error(`Invalid direction: ${direction}`);
  }
}