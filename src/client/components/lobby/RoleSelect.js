import classnames from 'classnames';
import { Divider, List, ListSubheader, Paper } from 'material-ui';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styles from '../../../../styles/RoleSelect.css';
import { IS_AVAILABLE, IS_READY, IS_USER, USERNAME } from '../../../common/fields/LobbyFields';
import { getDisplayName, RED } from '../../../common/models/Team';
import RoleCard from './RoleCard';

export const RoleSelectTeamList = (props) => {
  const team = props.team;
  return (
    <div className={styles.RoleSelect}>
      <Paper>
        <List>
          <ListSubheader className={classnames(styles.TeamName, team === RED ? styles.red : styles.blue)}>
            <h2>{getDisplayName(team)}</h2>
          </ListSubheader>
          <Divider/>
          
          {props.players.map((player, role) => (
            <RoleCard
              isAvailable={player.get(IS_AVAILABLE)}
              isReady={player.get(IS_READY)}
              isUser={player.get(IS_USER)}
              key={role}
              onSelect={() => props.selectRole(role, team)}
              onUnSelect={() => props.selectRole(null, null)}
              role={role}
              team={team}
              username={player.get(USERNAME)}
            />
          )).valueSeq()}
        </List>
      </Paper>
    </div>
  );
};

RoleSelectTeamList.propTypes = {
  players: ImmutablePropTypes.map.isRequired,
  selectRole: PropTypes.func.isRequired,
  team: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default RoleSelectTeamList;