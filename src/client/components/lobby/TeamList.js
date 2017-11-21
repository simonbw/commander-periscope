import classnames from 'classnames';
import React from 'react';
import styles from '../../../../styles/TeamList.css';
import * as Role from '../../models/Role';
import * as Team from '../../models/Team';

const TeamList = ({ teamName, selectRole, lobby, userId }) => {
  const team = lobby.getIn(['teams', teamName]);
  return (
    <div
      className={classnames(
        styles.TeamList,
        { [styles.red]: teamName === Team.RED },
        { [styles.blue]: teamName === Team.BLUE }
      )}
    >
      {Role.all.map((role) => {
        const playerId = team.get(role);
        const isReady = playerId && lobby.hasIn(['readied', playerId]);
        const username = playerId && (lobby.getIn(['usernames', playerId]) || 'Anonymous');
        const isUser = playerId === userId;
        const onSelect = (() => selectRole(role, teamName));
        const unSelect = (() => selectRole(null, null));
        return (
          <RoleCard
            key={role}
            {...{ onSelect, unSelect, role, isUser, playerId, username, isReady }}
          />
        );
      })}
    </div>
  );
};

const RoleCard = ({ onSelect, unSelect, role, playerId, username, isUser, isReady }) => (
  // TODO: Keyboard Navigation
  <div
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