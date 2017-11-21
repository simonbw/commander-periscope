import classnames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import styles from '../../../../styles/CustomLobbyPage.css';
import * as CustomLobbyActions from '../../actions/CustomLobbyActions';
import * as GeneralActions from '../../actions/GeneralActions';
import * as Page from '../../models/Page';
import * as Team from '../../models/Team';
import TeamList from './TeamList';

const CustomLobbyPage = ({ lobby, userId, selectRole, ready, unready, goToMainMenu, setUsername }) => {
  const lobbyId = lobby.get('id');
  if (lobbyId) {
    const userIsReady = lobby.get('readied').has(userId);
    return (
      <div className={styles.CustomLobbyPage}>
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
    lobby: state.get('lobby'),
    userId: state.get('userId'),
  }),
  (dispatch) => ({
    selectRole: (role, team) => dispatch(CustomLobbyActions.selectRole(role, team)),
    ready: () => dispatch(CustomLobbyActions.ready()),
    unready: () => dispatch(CustomLobbyActions.unready()),
    goToMainMenu: () => {
      dispatch(CustomLobbyActions.leaveCustomLobby());
      dispatch(GeneralActions.changePage(Page.MAIN_MENU))
    },
    setUsername: (username) => dispatch(CustomLobbyActions.setUsername(username))
  })
)(CustomLobbyPage);
