import classnames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import styles from '../../../../styles/CustomLobbyPage.css';
import { ID, LOBBY, READIED, USER_ID } from '../../../common/StateFields';
import * as Team from '../../../common/Team';
import * as CustomLobbyActions from '../../actions/CustomLobbyActions';
import * as GeneralActions from '../../actions/GeneralActions';
import { MAIN_MENU_PAGE } from '../../models/Page';
import TeamList from './TeamList';

const CustomLobbyPage = ({ lobby, userId, selectRole, ready, unready, goToMainMenu, setUsername }) => {
  const lobbyId = lobby.get(ID);
  if (lobbyId) {
    const userIsReady = lobby.get(READIED).has(userId);
    return (
      <div id="custom-lobby-page" className={styles.CustomLobbyPage}>
        <pre>{JSON.stringify(lobby, null, 2)}</pre>
        <UsernameInput {...{ setUsername }}/>
        <h1 className={styles.LobbyId}>{String(lobbyId)}</h1>
        <div className={styles.TeamLists}>
          <TeamList {...{ selectRole, lobby, userId }} teamName={Team.RED}/>
          <TeamList {...{ selectRole, lobby, userId }} teamName={Team.BLUE}/>
        </div>
        <ReadyButton {...{ ready, unready, userIsReady }}/>
        <CancelButton {...{ goToMainMenu }}/>
      </div>
    );
  } else {
    return (
      <div><i>Loading...</i></div>
    )
  }
};

const ReadyButton = ({ ready, unready, userIsReady }) => (
  <button
    className={classnames(styles.ReadyButton, { [styles.ready]: userIsReady })}
    onClick={userIsReady ? unready : ready}
    id="ready-button"
  >
    {userIsReady ? 'Unready' : 'Ready'}
  </button>
);

const CancelButton = ({ goToMainMenu }) => (
  <a
    className={styles.CancelButton}
    onClick={goToMainMenu}
  >
    Main Menu
  </a>
);

const UsernameInput = ({ setUsername }) => (
  <div>
    <input
      // TODO: Get the localstorage value. Possibly involves some binding.
      className={styles.UsernameInput}
      onChange={(event) => setUsername(event.target.value)}
      placeholder='Anonymous'
    />
  </div>
);

export default connect(
  (state) => ({
    lobby: state.get(LOBBY),
    userId: state.get(USER_ID),
  }),
  (dispatch) => ({
    selectRole: (role, team) => dispatch(CustomLobbyActions.selectRole(role, team)),
    ready: () => dispatch(CustomLobbyActions.ready()),
    unready: () => dispatch(CustomLobbyActions.unready()),
    goToMainMenu: () => {
      dispatch(CustomLobbyActions.leaveCustomLobby());
      dispatch(GeneralActions.changePage(MAIN_MENU_PAGE))
    },
    setUsername: (username) => dispatch(CustomLobbyActions.setUsername(username))
  })
)(CustomLobbyPage);
