import { SvgIcon } from 'material-ui';
import { Camera, Clear, GpsFixed, RssFeed, VolumeOff } from 'material-ui-icons';
import React from 'react';
import { COMMS, getSystemType, NUCLEAR, SPECIAL, WEAPONS } from '../../common/System';

// TODO: Real icons
// TODO: Make them bigger?
export const WeaponsAvatar = () => (
  <GpsFixed nativeColor="#FF0000"/>
);

export const CommsAvatar = () => (
  <RssFeed nativeColor="#00CC00"/>
);

export const SpecialAvatar = () => (
  <VolumeOff nativeColor="#00DDFF"/>
);

export const NuclearAvatar = () => (
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
      return WeaponsAvatar();
    case COMMS:
      return CommsAvatar();
    case SPECIAL:
      return SpecialAvatar();
    case NUCLEAR:
      return NuclearAvatar();
    default:
      throw Error(`Unrecognized system type: ${systemType}`);
  }
}

// TODO: Actual icons for each system
export function getIconForSystem(system) {
  return getIconForSystemType(getSystemType(system));
}