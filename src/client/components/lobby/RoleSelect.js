import classnames from 'classnames';
import {
  Divider, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, ListSubheader, Paper,
  Tooltip
} from 'material-ui';
import { Clear, Done } from 'material-ui-icons';
import React, { Component } from 'react';
import styles from '../../../../styles/RoleSelect.css';
import { READIED, TEAMS } from '../../../common/fields/LobbyFields';
import * as Role from '../../../common/Role';
import { ALL_ROLES } from '../../../common/Role'; // TODO: Rename this
import { USERNAMES } from '../../../common/fields/LobbyFields';
import { BLUE, getDisplayName, RED } from '../../../common/Team';
import { getAvatarForRole } from '../icons/RoleAvatars';

const RoleSelect = ({ lobby, userId, selectRole }) => {
  return (
    <div className={styles.RoleSelectContainer}>
      <RoleSelectTeamList
        team={RED}
        lobby={lobby}
        userId={userId}
        selectRole={selectRole}
      />
      <RoleSelectTeamList
        team={BLUE}
        lobby={lobby}
        userId={userId}
        selectRole={selectRole}
      />
    </div>
  );
};

const RoleSelectTeamList = ({ lobby, team, userId, selectRole }) => {
  return (
    <div className={styles.RoleSelectTeamList}>
      <Paper>
        <List>
          <ListSubheader
            className={classnames(
              styles.TeamName,
              team === RED ? styles.red : styles.blue)
            }
          >
            <h2>{getDisplayName(team)}</h2>
          </ListSubheader>
          <Divider/>
          {ALL_ROLES.map((role) => {
            const player = lobby.getIn([TEAMS, team, role]);
            return (
              <RoleCard
                isReady={Boolean(player) && lobby.get(READIED).includes(player)}
                isUser={player === userId}
                key={role}
                onSelect={(() => selectRole(role, team))}
                onUnSelect={(() => selectRole(null, null))}
                playerId={player}
                role={role}
                team={team}
                username={player && lobby.getIn([USERNAMES, player], 'Anonymous')}
              />
            );
          })}
        </List>
      </Paper>
    </div>
  );
};

class RoleCard extends Component {
  constructor(props) {
    super(props);
  }
  
  onClick() {
    if (!this.props.username && !this.props.isUser) {
      this.props.onSelect();
    }
  }
  
  render() {
    const { isReady, isUser, onUnSelect, role, team, username } = this.props;
    const isOther = username && !isUser;
    return (
      <ListItem
        classes={{
          container: classnames(
            styles.RoleCard,
            { [styles.isOther]: isOther },
            { [styles.isReady]: isReady },
            { [styles.isUser]: isUser },
          )
        }}
        button={!isOther}
        id={`${team}-${role}`}
        onClick={() => this.onClick()}
      >
        <ListItemAvatar>
          {getAvatarForRole(role)}
        </ListItemAvatar>
        <ListItemText
          primary={Role.getDisplayName(role)}
          secondary={
            <span className={username ? styles.Username : styles.Available}>
              {username ? username : 'Available'}
            </span>
          }
        />
        {/* Hide instead of remove this element to avoid element swapping */}
        <ListItemSecondaryAction>
          {isUser && (
            <Tooltip enterDelay={300} title={'Deselect Role'} /*TODO: Tooltip delay in constant*/>
              <IconButton onClick={onUnSelect}>
                <Clear/>
              </IconButton>
            </Tooltip>
          )}
          {!isUser && isReady && (
            <IconButton style={{ cursor: 'default', color: '#00CC00' }} disableRipple>
              <Tooltip enterDelay={300} title={'User is Ready'}>
                <Done/>
              </Tooltip>
            </IconButton>
          )}
        </ListItemSecondaryAction>
      
      </ListItem>
    );
  };
}

export default RoleSelect;