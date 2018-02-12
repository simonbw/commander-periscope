import { Button } from 'material-ui';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import styles from '../../../../styles/CustomLobbyPage.css';
import { ID, TEAMS } from '../../../common/fields/CommonFields';
import { LOBBY, USER_ID } from '../../../common/fields/StateFields';
import { BLUE, RED } from '../../../common/models/Team';
import { leaveCustomLobby, selectRole } from '../../actions/CustomLobbyActions';
import FloatingText from '../FloatingText';
import ReadyButton from './ReadyButton';
import RoleSelect from './RoleSelect';
import UsernameInput from './UsernameInput';

export const UnconnectedCustomLobbyPage = (props) => (
  <div className={styles.CustomLobbyPage} id="custom-lobby-page">
    <FloatingText>
      <h1>Lobby ID: <span className={styles.LobbyId}>{props.lobbyId}</span></h1>
    </FloatingText>
    <UsernameInput/>
    <div className={styles.RoleSelectContainer}>
      <RoleSelect
        players={props.teams.get(RED)}
        selectRole={props.selectRole}
        team={RED}
        userId={props.userId}
      />
      <RoleSelect
        players={props.teams.get(BLUE)}
        selectRole={props.selectRole}
        team={BLUE}
        userId={props.userId}
      />
    </div>
    <div className={styles.ButtonBar}>
      <Button variant="raised" onClick={props.goToMainMenu}>
        Main Menu
      </Button>
      <ReadyButton/>
    </div>
  </div>
);

UnconnectedCustomLobbyPage.propTypes = {
  goToMainMenu: PropTypes.func.isRequired,
  lobbyId: PropTypes.string.isRequired,
  selectRole: PropTypes.func.isRequired,
  teams: ImmutablePropTypes.map.isRequired,
  userId: PropTypes.string.isRequired,
};

export default connect(
  (state) => ({
    lobbyId: state.getIn([LOBBY, ID]),
    teams: state.getIn([LOBBY, TEAMS]),
    userId: state.get(USER_ID)
  }),
  (dispatch) => ({
    goToMainMenu: () => dispatch(leaveCustomLobby()),
    selectRole: (role, team) => dispatch(selectRole(role, team))
  })
)(UnconnectedCustomLobbyPage)