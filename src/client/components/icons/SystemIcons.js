import Immutable from 'immutable';
import { SvgIcon } from 'material-ui';
import { GpsFixed, RssFeed, VolumeOff } from 'material-ui-icons';
import React from 'react';
import { DRONE, getSystemType, MINE, SILENT, SONAR, TORPEDO } from '../../../common/System';
import MineMarker from '../grid/MineMarker';
import { getIconForSystemType } from './SystemTypeIcons';

// TODO: Drone Icon
export const DroneIcon = () => (
  <RssFeed nativeColor="#00CC00"/>
);

export const MineIcon = () => (
  <SvgIcon viewBox="0.20 0.20 0.6 0.6">
    <MineMarker location={Immutable.List([0, 0])}/>
  </SvgIcon>
);

export const SilentIcon = () => (
  <VolumeOff nativeColor="#00DDFF"/>
);

// TODO: Sonar Icon
export const SonarIcon = () => (
  <RssFeed nativeColor="#00CC00"/>
);

// TODO: Torpedo Icon
export const TorpedoIcon = () => (
  <GpsFixed nativeColor="#FF0000"/>
);

// TODO: Actual icons for each system
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
  return getIconForSystemType(getSystemType(system));
}


