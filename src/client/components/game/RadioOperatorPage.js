import classnames from 'classnames';
import { Collapse, Divider, Fade, List, ListItem, ListItemText, ListSubheader, Paper } from 'material-ui';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styles from '../../../../styles/RadioOperatorPage.css';
import { getDirectionArrow } from '../../../common/Direction';
import { getHitDisplayName } from '../../../common/Explosion';
import { GRID, NOTIFICATIONS, TEAM } from '../../../common/fields/GameFields';
import {
  DETONATE_MINE_NOTIFICATION, DRONE_NOTIFICATION, DROP_MINE_NOTIFICATION, MOVE_NOTIFICATION, NOTIFICATION_DIRECTION,
  NOTIFICATION_DRONE_RESULT, NOTIFICATION_HIT_RESULT, NOTIFICATION_ID, NOTIFICATION_LOCATION, NOTIFICATION_SECTOR,
  NOTIFICATION_SONAR_RESULT, NOTIFICATION_TEAM, NOTIFICATION_TYPE, SILENT_NOTIFICATION, SONAR_NOTIFICATION,
  SURFACE_NOTIFICATION, TORPEDO_NOTIFICATION
} from '../../../common/Notifications';
import { GAME} from '../../../common/fields/StateFields';
import { DRONE, MINE, SILENT, SONAR, TORPEDO } from '../../../common/System';
import GridBackground from '../grid/GridBackground';
import GridContainer from '../grid/GridContainer';
import GridLabels, { ROW_LABELS } from '../grid/GridLabels';
import GridSectors from '../grid/GridSectors';
import GridTiles from '../grid/GridTiles';
import AvatarIcon from '../icons/AvatarIcon';
import { getIconForSystem } from '../icons/SystemIcons';

const MAX_VISIBLE_NOTIFICATIONS = 10;

export const UnconnectedRadioOperatorPage = ({ grid, notifications, team }) => (
  <div id="radio-operator-page" className={styles.RadioOperatorPage}>
    <div className={styles.GridBox}>
      <GridContainer>
        <GridBackground height={15} width={15}/> {/* TODO: Don't hard code*/}
        <GridSectors/>
        <GridTiles grid={grid}/>
        <GridLabels height={15} width={15}/>
      </GridContainer>
    </div>
    <Paper className={styles.NotificationListPaper}>
      <List
        classes={{ root: styles.NotificationList }}
        subheader={<div/>}
      >
        <ListSubheader>Notifications</ListSubheader>
        <Divider/>
        {notifications.take(MAX_VISIBLE_NOTIFICATIONS + 1).map((notification, i) => ( //last one isn't visible
          <NotificationListItem
            first={i === 0}
            last={i === MAX_VISIBLE_NOTIFICATIONS}
            key={notification.get(NOTIFICATION_ID)}
            notification={notification}
            team={team}
          />
        ))}
      </List>
    </Paper>
  </div>
);

class NotificationListItem extends Component {
  constructor(props) {
    super(props);
    this.state = { hasBeenAdded: false };
    setTimeout(() => this.setState({ hasBeenAdded: true }), 5);
  }
  
  render() {
    const { notification, team, first, last } = this.props;
    const { hasBeenAdded } = this.state;
    return (
      <Fragment>
        <Collapse in={hasBeenAdded}>
          <Fade in={!last}>
            <ListItem
              dense
              className={classnames(styles.NotificationListItem, { [styles.first]: first }, { [styles.last]: last })}
            >
              {(() => {
                switch (notification.get(NOTIFICATION_TYPE)) {
                  case MOVE_NOTIFICATION: {
                    const direction = notification.get(NOTIFICATION_DIRECTION);
                    return (
                      <Fragment>
                        <AvatarIcon>
                          {getDirectionArrow(direction)}
                        </AvatarIcon>
                        <ListItemText primary={direction}/>
                      </Fragment>
                    );
                  }
                  case DRONE_NOTIFICATION: {
                    const sector = notification.get(NOTIFICATION_SECTOR);
                    const droneResult = notification.get(NOTIFICATION_DRONE_RESULT);
                    return (
                      <Fragment>
                        {getIconForSystem(DRONE)}
                        <ListItemText primary={`Enemy ${droneResult ? 'in' : 'not in'} sector ${sector}`}/>
                      </Fragment>
                    );
                  }
                  case SONAR_NOTIFICATION: {
                    const sonarResult = notification.get(NOTIFICATION_SONAR_RESULT);
                    sonarResult.map((v, k) => `${k}: ${v}`);
                    return (
                      <Fragment>
                        {getIconForSystem(SONAR)}
                        <ListItemText primary={sonarResult.map((v, k) => `${k}: ${v}`).join(' ')}/>
                      </Fragment>
                    );
                  }
                  case SILENT_NOTIFICATION: {
                    return (
                      <Fragment>
                        {getIconForSystem(SILENT)}
                        <ListItemText primary="Silent"/>
                      </Fragment>
                    );
                  }
                  case DETONATE_MINE_NOTIFICATION: {
                    const mineLocation = formatLocation(notification.get(NOTIFICATION_LOCATION));
                    if (notification.get(NOTIFICATION_TEAM) === team) {
                      const hitResult = getHitDisplayName(notification.get(NOTIFICATION_HIT_RESULT));
                      return (
                        <Fragment>
                          {getIconForSystem(MINE)}
                          <ListItemText
                            primary={
                              <span>{hitResult} at {mineLocation}</span>}
                          />
                        </Fragment>
                      );
                    } else {
                      return (
                        <Fragment>
                          {getIconForSystem(MINE)}
                          <ListItemText
                            primary={
                              <span>Mine detonated at {mineLocation}</span>
                            }
                          />
                        </Fragment>
                      );
                    }
                  }
                  case DROP_MINE_NOTIFICATION: {
                    return (
                      <Fragment>
                        {getIconForSystem(MINE)}
                        <ListItemText primary="Mine Dropped"/>
                      </Fragment>
                    );
                  }
                  case TORPEDO_NOTIFICATION: {
                    const torpedoLocation = formatLocation(notification.get(NOTIFICATION_LOCATION));
                    if (notification.get(NOTIFICATION_TEAM) === team) {
                      const hitResult = getHitDisplayName(notification.get(NOTIFICATION_HIT_RESULT));
                      return (
                        <Fragment>
                          {getIconForSystem(TORPEDO)}
                          <ListItemText
                            primary={
                              <span>{hitResult} at {torpedoLocation})</span>
                            }
                          />
                        </Fragment>
                      );
                    } else {
                      return (
                        <Fragment>
                          {getIconForSystem(TORPEDO)}
                          <ListItemText
                            primary={
                              <span>Torpedo at {torpedoLocation})</span>}
                          />
                        </Fragment>
                      );
                    }
                  }
                  case SURFACE_NOTIFICATION: {
                    const surfaceSector = notification.get(NOTIFICATION_SECTOR);
                    return (
                      <Fragment>
                        <AvatarIcon>
                          S
                        </AvatarIcon>
                        <ListItemText
                          primary={
                            <span>Surfaced in sector <b>{surfaceSector + 1}</b></span>}
                        />
                      </Fragment>
                    );
                  }
                  default: {
                    return (
                      <ListItemText primary={JSON.stringify(notification)}/>
                    );
                  }
                }
              })()}
            </ListItem>
          </Fade>
        </Collapse>
        <Divider/>
      </Fragment>
    );
  }
}

function formatLocation(location) {
  return <b>{ROW_LABELS[location.get(0)]}-{location.get(1)}</b>
}

export default connect(
  (state) => ({
    grid: state.getIn([GAME, GRID]),
    notifications: state.getIn([GAME, NOTIFICATIONS]),
    team: state.getIn([GAME, TEAM])
  }),
  (dispatch) => ({})
)(UnconnectedRadioOperatorPage);