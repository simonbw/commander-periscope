import { ListItemText } from 'material-ui';
import React, { Fragment } from 'react';
import { getHitDisplayName } from '../../../../common/models/Explosion';
import { COLUMN_LABELS, ROW_LABELS, SECTOR_LABELS } from '../../../../common/models/Grid';
import {
  NOTIFICATION_DIRECTION, NOTIFICATION_DRONE_RESULT, NOTIFICATION_HIT_RESULT, NOTIFICATION_LOCATION,
  NOTIFICATION_SECTOR, NOTIFICATION_SONAR_RESULT, NOTIFICATION_TEAM
} from '../../../../common/models/Notifications';
import { DetonateMineIcon, getMoveIcon, SurfaceIcon } from '../../icons/ActionIcons';
import { DroneIcon, MineIcon, SilentIcon, SonarIcon, TorpedoIcon } from '../../icons/SystemIcons';

function formatLocation(location) {
  return <b>{COLUMN_LABELS[location.get(0)]}-{ROW_LABELS[location.get(1)]}</b>
}

export const MoveNotification = ({ notification }) => {
  const direction = notification.get(NOTIFICATION_DIRECTION);
  return (
    <Fragment>
      {getMoveIcon(direction)}
      <ListItemText primary={direction}/>
    </Fragment>
  );
};

export const DroneNotification = ({ notification }) => {
  const sector = notification.get(NOTIFICATION_SECTOR);
  const droneResult = notification.get(NOTIFICATION_DRONE_RESULT);
  return (
    <Fragment>
      <DroneIcon/>
      <ListItemText primary={`Enemy ${droneResult ? 'in' : 'not in'} sector ${SECTOR_LABELS[sector]}`}/>
    </Fragment>
  );
};

export const SonarNotification = ({ notification }) => {
  const sonarResult = notification.get(NOTIFICATION_SONAR_RESULT)
    .map((v, k) => {
      if (k === 'sector')
        return SECTOR_LABELS[v];
      if (k === 'column')
        return COLUMN_LABELS[v];
      if (k === 'row')
        return ROW_LABELS[v];
    })
    .map((v, k) => `${k} ${v}`)
    .join(' - ');
  return (
    <Fragment>
      <SonarIcon/>
      <ListItemText primary={sonarResult}/>
    </Fragment>
  );
};

export const SilentNotification = () => {
  return (
    <Fragment>
      <SilentIcon/>
      <ListItemText primary="Silent"/>
    </Fragment>
  );
};

export const DetonateMineNotification = ({ notification, team }) => {
  const mineLocation = formatLocation(notification.get(NOTIFICATION_LOCATION));
  if (notification.get(NOTIFICATION_TEAM) === team) {
    const hitResult = getHitDisplayName(notification.get(NOTIFICATION_HIT_RESULT));
    return (
      <Fragment>
        <DetonateMineIcon/>
        <ListItemText
          primary={<span>{hitResult} at {mineLocation}</span>}
        />
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <DetonateMineIcon/>
        <ListItemText
          primary={<span>Mine detonated at {mineLocation}</span>}
        />
      </Fragment>
    );
  }
};

export const DropMineNotification = () => {
  return (
    <Fragment>
      <MineIcon/>
      <ListItemText primary="Mine Dropped"/>
    </Fragment>
  );
};

export const TorpedoNotification = ({ notification, team }) => {
  const torpedoLocation = formatLocation(notification.get(NOTIFICATION_LOCATION));
  if (notification.get(NOTIFICATION_TEAM) === team) {
    const hitResult = getHitDisplayName(notification.get(NOTIFICATION_HIT_RESULT));
    return (
      <Fragment>
        <TorpedoIcon/>
        <ListItemText
          primary={
            <span>{hitResult} at {torpedoLocation}</span>
          }
        />
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <TorpedoIcon/>
        <ListItemText
          primary={
            <span>Enemy Torpedo at {torpedoLocation}</span>}
        />
      </Fragment>
    );
  }
};

export const SurfaceNotification = ({ notification }) => {
  const surfaceSector = notification.get(NOTIFICATION_SECTOR);
  return (
    <Fragment>
      <SurfaceIcon/>
      <ListItemText
        primary={
          <span>Surfaced in sector <b>{SECTOR_LABELS[surfaceSector]}</b></span>}
      />
    </Fragment>
  );
};
