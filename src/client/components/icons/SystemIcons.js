import Immutable from 'immutable';
import { SvgIcon } from 'material-ui';
import { AirplanemodeActive, GpsFixed, SignalWifi4Bar, VolumeOff } from 'material-ui-icons';
import React from 'react';
import { DRONE, MINE, SILENT, SONAR, TORPEDO } from '../../../common/models/System';
import MineMarker from '../grid/MineMarker';

export const DroneIcon = () => (
  <AirplanemodeActive nativeColor="#00CC00"/>
);

export const MineIcon = () => (
  <SvgIcon viewBox="0.20 0.20 0.6 0.6">
    <MineMarker location={Immutable.List([0, 0])}/>
  </SvgIcon>
);

export const SilentIcon = () => (
  <VolumeOff nativeColor="#00DDFF"/>
);

export const SonarIcon = () => (
  <SignalWifi4Bar nativeColor="#00CC00"/>
);

export const TorpedoIcon = () => (
  <GpsFixed nativeColor="#FF0000"/>
);

export function getIconForSystem(system) {
  switch (system) {
    case DRONE:
      return DroneIcon();
    case MINE:
      return MineIcon();
    case SONAR:
      return SonarIcon();
    case SILENT:
      return SilentIcon();
    case TORPEDO:
      return TorpedoIcon();
    default:
      throw new Error(`Invalid system: ${system}`);
  }
}


