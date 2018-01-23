import classnames from 'classnames';
import Immutable from 'immutable';
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Paper
} from 'material-ui';
import { Clear } from 'material-ui-icons';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from '../../../../styles/RoleSelect.css';
import * as Role from '../../../common/Role';
import { ALL_ROLES, getAvatar } from '../../../common/Role'; // TODO: Rename this
import { LOBBY, READIED, TEAMS, USER_ID, USERNAMES } from '../../../common/StateFields';
import { BLUE, RED } from '../../../common/Team';
import { selectRole } from '../../actions/CustomLobbyActions';

const UnconnectedRoleSelectContainer = ({ lobby, userId, selectRole }) => {
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
          <ListSubheader style={{ color: team === RED ? '#F00' : '#00F' }}><h2>{team}</h2></ListSubheader>
          <Divider/>
          {ALL_ROLES.map((role) => {
            const player = lobby.getIn([TEAMS, team, role]);
            return (
              <RoleCard
                key={role}
                team={team}
                isReady={player && lobby.get(READIED).includes(player)}
                isUser={player === userId}
                onSelect={(() => selectRole(role, team))}
                playerId={player}
                role={role}
                onUnSelect={(() => selectRole(null, null))}
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
    const { role, team, username, isUser, onUnSelect } = this.props;
    const isOther = username && !isUser;
    return (
      <ListItem
        button
        classes={{
          container: classnames(
            styles.RoleCard,
            { [styles.isUser]: isUser },
            { [styles.isOther]: isOther }
          )
        }}
        disabled={isOther}
        id={`${team}-${role}`}
        onClick={() => this.onClick()}
      >
        {getAvatar(role)}
        <ListItemText
          primary={Role.getDisplayName(role)}
          secondary={username ?
            (<span className={styles.Username}>{username}</span>)
            :
            (<span className={styles.Available}>Available</span>)}
        />
        <ListItemSecondaryAction>
          {isUser && (
            <IconButton onClick={onUnSelect}>
              <Clear/>
            </IconButton>
          )}
        </ListItemSecondaryAction>
      </ListItem>
    );
  };
}

export default connect(
  (state) => ({
    lobby: state.get(LOBBY),
    userId: state.get(USER_ID)
  }),
  (dispatch) => ({
    selectRole: (role, team) => dispatch(selectRole(role, team))
  })
)(UnconnectedRoleSelectContainer);