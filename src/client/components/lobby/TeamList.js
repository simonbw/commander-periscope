import classnames from 'classnames';
import React from 'react';
import styles from '../../../../styles/TeamList.css';
import * as Role from '../../../common/Role';
import { ALL_ROLES } from '../../../common/Role';
import { READIED, TEAMS, USERNAMES } from '../../../common/StateFields';
import { BLUE, RED } from '../../../common/Team';

const TeamList = ({ teamName, selectRole, lobby, userId }) => {
  const team = lobby.getIn([TEAMS, teamName]);
  return (
    <div
      className={classnames(
        styles.TeamList,
        { [styles.red]: teamName === RED },
        { [styles.blue]: teamName === BLUE }
      )}
    >
      {ALL_ROLES.map((role) => {
        const playerId = team.get(role);
        const isReady = playerId && lobby.get(READIED).includes(playerId);
        const username = playerId && (lobby.getIn([USERNAMES, playerId]) || 'Anonymous');
        const isUser = playerId === userId;
        const onSelect = (() => selectRole(role, teamName));
        const unSelect = (() => selectRole(null, null));
        return (
          <RoleCard
            key={role}
            {...{ onSelect, unSelect, role, isUser, playerId, username, isReady, teamName }}
          />
        );
      })}
    </div>
  );
};

const RoleCard = ({ onSelect, unSelect, role, playerId, username, isUser, isReady, teamName }) => (
  // TODO: Keyboard Navigation
  <div
    id={`${teamName}-${role}`}
    onClick={() => {
      if (!playerId && !isUser) {
        onSelect();
      }
    }}
    className={classnames(
      styles.RoleCard,
      { [styles.ready]: isReady },
      { [styles.user]: isUser },
      { [styles.empty]: !playerId }
    )}
  >
    <span className={styles.RoleName}>{Role.getDisplayName(role)}</span>
    <span className={styles.UserName}>{username || 'available'}</span>
    {isUser && (
      <span className={styles.Unselect} onClick={unSelect}>X</span>
    )}
  </div>
);

export default TeamList;