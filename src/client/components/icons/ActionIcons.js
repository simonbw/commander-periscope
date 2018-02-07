import Immutable from "immutable";
import { SvgIcon } from 'material-ui';
import React from 'react';
import MineMarker from '../grid/MineMarker';

export const DetonateMineIcon = () => (
  <SvgIcon viewBox="0.20 0.20 0.6 0.6">
    <MineMarker location={Immutable.List([0, 0])}/>
  </SvgIcon>
);

export const MoveIcon = () => (
  <SvgIcon viewBox="0.20 0.20 0.6 0.6">
    <MineMarker location={Immutable.List([0, 0])}/>
  </SvgIcon>
);

export const SurfaceIcon = () => (
  <SvgIcon viewBox="0.20 0.20 0.6 0.6">
    <MineMarker location={Immutable.List([0, 0])}/>
  </SvgIcon>
);