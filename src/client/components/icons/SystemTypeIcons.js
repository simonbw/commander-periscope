import { SvgIcon } from 'material-ui';
import { Clear, GpsFixed, RssFeed, VolumeOff } from 'material-ui-icons';
import React from 'react';
import { COMMS, NUCLEAR, SPECIAL, WEAPONS } from '../../../common/System';

export const CommsIcon = () => (
  <RssFeed nativeColor="#00CC00"/>
);
export const SpecialIcon = () => (
  <VolumeOff nativeColor="#00DDFF"/>
);
export const WeaponsIcon = () => (
  <GpsFixed nativeColor="#FF0000"/>
);
export const NuclearIcon = () => (
  <SvgIcon viewBox='0 0 100 100'>
    <circle
      cx="50"
      cy="50"
      r="9"
      fill='#000000'
    />
    <circle
      cx="50"
      cy="50"
      r="30"
      fill="none"
      stroke="#000000"
      strokeWidth="32"
      strokeDasharray="31.41592, 31.41592" /* (pi / 3 * 30) */
    />
  </SvgIcon>
  // <Camera nativeColor="#000000"/>
);

function getColorForSystemType(systemType) {
  switch (systemType) {
    case WEAPONS:
      return '#FF0000';
    case COMMS:
      return '#00CC00';
    case SPECIAL:
      return '#00DDFF';
    case NUCLEAR:
      return '#000000';
    default:
      throw Error(`Unrecognized system type: ${systemType}`);
  }
}

export function getIconForSystemType(systemType, broken = false) {
  if (broken) {
    return <Clear nativeColor={getColorForSystemType(systemType)}/>
  }
  switch (systemType) {
    case WEAPONS:
      return WeaponsIcon();
    case COMMS:
      return CommsIcon();
    case SPECIAL:
      return SpecialIcon();
    case NUCLEAR:
      return NuclearIcon();
    default:
      throw Error(`Unrecognized system type: ${systemType}`);
  }
}