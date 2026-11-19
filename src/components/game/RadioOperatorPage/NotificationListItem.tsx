import { Collapse, Divider, Fade, ListItem, ListItemText } from "@mui/material";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import styles from "../../../../styles/RadioOperatorPage.module.css";
import type { Notification, Team } from "../../../../shared/types";
import {
  DetonateMineNotification,
  DroneNotification,
  DropMineNotification,
  MoveNotification,
  SilentNotification,
  SonarNotification,
  SurfaceNotification,
  TorpedoNotification,
} from "./NotificationInfos";

interface NotificationListItemProps {
  first: boolean;
  last: boolean;
  team: Team;
  notification: Notification;
}

export const NotificationListItem = ({ first, last, team, notification }: NotificationListItemProps) => {
  // Start collapsed and expand right after mounting so new notifications slide in.
  const [hasBeenAdded, setHasBeenAdded] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setHasBeenAdded(true), 5);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Fragment>
      <Collapse in={hasBeenAdded} timeout="auto">
        <Fade in={!last}>
          <ListItem
            dense
            className={clsx(styles.NotificationListItem, { [styles.first]: first }, { [styles.last]: last })}
          >
            {renderNotification(notification, team)}
          </ListItem>
        </Fade>
      </Collapse>
      <Divider />
    </Fragment>
  );
};

function renderNotification(notification: Notification, team: Team) {
  switch (notification.kind) {
    case "MOVE":
      return <MoveNotification notification={notification} />;
    case "DRONE":
      return <DroneNotification notification={notification} />;
    case "SONAR":
      return <SonarNotification notification={notification} />;
    case "SILENT":
      return <SilentNotification />;
    case "DETONATE_MINE":
      return <DetonateMineNotification notification={notification} team={team} />;
    case "DROP_MINE":
      return <DropMineNotification />;
    case "TORPEDO":
      return <TorpedoNotification notification={notification} team={team} />;
    case "SURFACE":
      return <SurfaceNotification notification={notification} />;
    default:
      return <ListItemText primary={JSON.stringify(notification)} />;
  }
}
