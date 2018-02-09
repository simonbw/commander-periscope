import classnames from 'classnames';
import { Collapse, Divider, Fade, ListItem, ListItemText } from 'material-ui';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styles from '../../../../../styles/RadioOperatorPage.css';
import {
  DETONATE_MINE_NOTIFICATION, DRONE_NOTIFICATION, DROP_MINE_NOTIFICATION, MOVE_NOTIFICATION, NOTIFICATION_TYPE,
  SILENT_NOTIFICATION, SONAR_NOTIFICATION, SURFACE_NOTIFICATION, TORPEDO_NOTIFICATION
} from '../../../../common/models/Notifications';
import { BOTH_TEAMS } from '../../../../common/models/Team';
import {
  DetonateMineNotification, DroneNotification, DropMineNotification, MoveNotification, SilentNotification,
  SonarNotification, SurfaceNotification, TorpedoNotification
} from './NotificationInfos';

export class NotificationListItem extends Component {
  static propTypes = {
    first: PropTypes.bool.isRequired,
    last: PropTypes.bool.isRequired,
    team: PropTypes.oneOf(BOTH_TEAMS).isRequired,
    notification: ImmutablePropTypes.map.isRequired,
  };
  
  constructor(props) {
    super(props);
    this.state = { hasBeenAdded: false };
    setTimeout(() => this.setState({ hasBeenAdded: true }), 5);
  }
  
  render() {
    const { first, last } = this.props;
    const { hasBeenAdded } = this.state;
    return (
      <Fragment>
        <Collapse in={hasBeenAdded} timeout="auto">
          <Fade in={!last}>
            <ListItem
              dense
              className={classnames(
                styles.NotificationListItem,
                { [styles.first]: first },
                { [styles.last]: last })
              }
            >
              {this.renderNotification()}
            </ListItem>
          </Fade>
        </Collapse>
        <Divider/>
      </Fragment>
    );
  }
  
  renderNotification() {
    const notification = this.props.notification;
    switch (notification.get(NOTIFICATION_TYPE)) {
      case MOVE_NOTIFICATION:
        return <MoveNotification notification={notification}/>;
      case DRONE_NOTIFICATION:
        return <DroneNotification notification={notification}/>;
      case SONAR_NOTIFICATION:
        return <SonarNotification notification={notification}/>;
      case SILENT_NOTIFICATION:
        return <SilentNotification notification={notification}/>;
      case DETONATE_MINE_NOTIFICATION:
        return <DetonateMineNotification notification={notification} team={this.props.team}/>;
      case DROP_MINE_NOTIFICATION:
        return <DropMineNotification notification={notification}/>;
      case TORPEDO_NOTIFICATION:
        return <TorpedoNotification notification={notification} team={this.props.team}/>;
      case SURFACE_NOTIFICATION:
        return <SurfaceNotification notification={notification}/>;
      default: {
        return (
          <ListItemText primary={JSON.stringify(notification)}/>
        );
      }
    }
  }
}
