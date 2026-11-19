import { Divider, List, ListSubheader, Paper } from "@mui/material";
import styles from "../../../../styles/RadioOperatorPage.module.css";
import type { Notification, Team } from "../../../../shared/types";
import { NotificationListItem } from "./NotificationListItem";

const MAX_VISIBLE_NOTIFICATIONS = 10;

interface NotificationListProps {
  notifications: Notification[];
  team: Team;
}

const NotificationList = ({ notifications, team }: NotificationListProps) => (
  <Paper className={styles.NotificationListPaper}>
    <List className={styles.NotificationList} subheader={<div />}>
      <ListSubheader>Notifications</ListSubheader>
      <Divider />
      {notifications.slice(0, MAX_VISIBLE_NOTIFICATIONS + 1).map((notification, i) => (
        // The last one isn't visible (it fades out).
        <NotificationListItem
          first={i === 0}
          key={notification.id}
          last={i === MAX_VISIBLE_NOTIFICATIONS}
          notification={notification}
          team={team}
        />
      ))}
    </List>
  </Paper>
);

export default NotificationList;
