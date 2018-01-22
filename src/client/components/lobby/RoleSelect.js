import classnames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import style from '../../../../styles/RoleSelect.css'; // TODO: Rename this
import * as Role from '../../../common/Role';
import { ALL_ROLES } from '../../../common/Role';
import { LOBBY, READIED, TEAMS, USER_ID, USERNAMES } from '../../../common/StateFields';
import { BLUE, RED } from '../../../common/Team';
import { selectRole } from '../../actions/CustomLobbyActions';

const UnconnectedRoleSelect = ({ lobby, userId, selectRole }) => {
  return (
    <div className={style.TeamLists}>
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
    <div
      className={classnames(
        style.RoleSelect,
        { [style.red]: team === RED },
        { [style.blue]: team === BLUE }
      )}
    >
      {ALL_ROLES.map((role) => {
        const player = lobby.getIn([TEAMS, team, role]);
        return (
          <RoleCard
            team={team}
            isReady={player && lobby.get(READIED).includes(player)}
            isUser={player === userId}
            key={role}
            onSelect={(() => selectRole(role, team))}
            playerId={player}
            role={role}
            onUnSelect={(() => selectRole(null, null))}
            username={player && lobby.getIn([USERNAMES, player], 'Anonymous')}
          />
        );
      })}
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
  
  getClassName() {
    return classnames(
      style.RoleCard,
      { [style.ready]: this.props.isReady },
      { [style.user]: this.props.isUser },
      { [style.empty]: !this.props.username }
    )
  }
  
  render() {
    const { onUnSelect, role, username, isUser } = this.props;
    return (
      <div
        className={this.getClassName()}
        onClick={() => this.onClick()}
        id={`${this.props.team}-${this.props.role}`}
      >
        <span className={style.RoleName}>{Role.getDisplayName(role)}</span>
        <span className={style.UserName}>{username || 'available'}</span>
        {isUser && <span className={style.Unselect} onClick={onUnSelect}>X</span>}
      </div>
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
)(UnconnectedRoleSelect);