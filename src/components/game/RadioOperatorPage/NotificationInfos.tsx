import { ListItemText } from "@mui/material";
import { Fragment } from "react";
import { getHitDisplayName } from "../../../../shared/explosion";
import { COLUMN_LABELS, ROW_LABELS, SECTOR_LABELS } from "../../../../shared/grid";
import type {
  DetonateMineNotification as DetonateMineNotificationData,
  DroneNotification as DroneNotificationData,
  Location,
  MoveNotification as MoveNotificationData,
  SonarNotification as SonarNotificationData,
  SurfaceNotification as SurfaceNotificationData,
  Team,
  TorpedoNotification as TorpedoNotificationData,
} from "../../../../shared/types";
import { DetonateMineIcon, getMoveIcon, SurfaceIcon } from "../../icons/ActionIcons";
import { DroneIcon, MineIcon, SilentIcon, SonarIcon, TorpedoIcon } from "../../icons/SystemIcons";

function formatLocation(location: Location) {
  return (
    <b>
      {COLUMN_LABELS[location[0]]}-{ROW_LABELS[location[1]]}
    </b>
  );
}

export const MoveNotification = ({ notification }: { notification: MoveNotificationData }) => {
  const direction = notification.direction;
  return (
    <Fragment>
      {getMoveIcon(direction)}
      <ListItemText primary={direction} />
    </Fragment>
  );
};

export const DroneNotification = ({ notification }: { notification: DroneNotificationData }) => {
  const { sector, droneResult } = notification;
  return (
    <Fragment>
      <DroneIcon />
      <ListItemText primary={`Enemy ${droneResult ? "in" : "not in"} sector ${SECTOR_LABELS[sector]}`} />
    </Fragment>
  );
};

function formatSonarValue(key: string, value: number) {
  switch (key) {
    case "sector":
      return SECTOR_LABELS[value];
    case "column":
      return COLUMN_LABELS[value];
    case "row":
      return ROW_LABELS[value];
    default:
      return undefined;
  }
}

export const SonarNotification = ({ notification }: { notification: SonarNotificationData }) => {
  const sonarResult = Object.entries(notification.sonarResult)
    .filter((entry): entry is [string, number] => entry[1] != null)
    .map(([key, value]) => `${key} ${formatSonarValue(key, value)}`)
    .join(" - ");
  return (
    <Fragment>
      <SonarIcon />
      <ListItemText primary={sonarResult} />
    </Fragment>
  );
};

export const SilentNotification = () => {
  return (
    <Fragment>
      <SilentIcon />
      <ListItemText primary="Silent" />
    </Fragment>
  );
};

export const DetonateMineNotification = ({
  notification,
  team,
}: {
  notification: DetonateMineNotificationData;
  team: Team;
}) => {
  const mineLocation = formatLocation(notification.location);
  if (notification.team === team) {
    const hitResult = getHitDisplayName(notification.hitResult);
    return (
      <Fragment>
        <DetonateMineIcon />
        <ListItemText
          primary={
            <span>
              {hitResult} at {mineLocation}
            </span>
          }
        />
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <DetonateMineIcon />
        <ListItemText primary={<span>Mine detonated at {mineLocation}</span>} />
      </Fragment>
    );
  }
};

export const DropMineNotification = () => {
  return (
    <Fragment>
      <MineIcon />
      <ListItemText primary="Mine Dropped" />
    </Fragment>
  );
};

export const TorpedoNotification = ({ notification, team }: { notification: TorpedoNotificationData; team: Team }) => {
  const torpedoLocation = formatLocation(notification.location);
  if (notification.team === team) {
    const hitResult = getHitDisplayName(notification.hitResult);
    return (
      <Fragment>
        <TorpedoIcon />
        <ListItemText
          primary={
            <span>
              {hitResult} at {torpedoLocation}
            </span>
          }
        />
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <TorpedoIcon />
        <ListItemText primary={<span>Enemy Torpedo at {torpedoLocation}</span>} />
      </Fragment>
    );
  }
};

export const SurfaceNotification = ({ notification }: { notification: SurfaceNotificationData }) => {
  const surfaceSector = notification.sector;
  return (
    <Fragment>
      <SurfaceIcon />
      <ListItemText
        primary={
          <span>
            Surfaced in sector <b>{SECTOR_LABELS[surfaceSector]}</b>
          </span>
        }
      />
    </Fragment>
  );
};
