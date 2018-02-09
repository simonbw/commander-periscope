import { Divider, List, ListSubheader, Paper } from 'material-ui';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styles from '../../../../../styles/RadioOperatorPage.css';
import { NOTIFICATION_ID } from '../../../../common/models/Notifications';
import { BOTH_TEAMS } from '../../../../common/models/Team';
import { NotificationListItem } from './NotificationListItem';

const MAX_VISIBLE_NOTIFICATIONS = 10;

const NotificationList = (props) => (
  <Paper className={styles.NotificationListPaper}>
    <List
      classes={{ root: styles.NotificationList }}
      subheader={<div/>}
    >
      <ListSubheader>Notifications</ListSubheader>
      <Divider/>
      {props.notifications.take(MAX_VISIBLE_NOTIFICATIONS + 1).map((notification, i) => ( //last one isn't visible
        <NotificationListItem
          first={i === 0}
          key={notification.get(NOTIFICATION_ID)}
          last={i === MAX_VISIBLE_NOTIFICATIONS}
          notification={notification}
          team={props.team}
        />
      ))}
    </List>
  </Paper>
);

NotificationList.propTypes = {
  notifications: ImmutablePropTypes.list.isRequired,
  team: PropTypes.oneOf(BOTH_TEAMS).isRequired
};

export default NotificationList;