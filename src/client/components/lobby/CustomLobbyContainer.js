import React from 'react';
import { connect } from 'react-redux';
import { GAME_ID, LOBBY } from '../../../common/StateFields';
import GamePage from '../game/GamePage';
import CustomLobbyPage from './CustomLobbyPage';
import LobbyLoadingPage from './LobbyLoadingPage';

const UnconnectedCustomLobbyContainer = ({ loading, inGame }) => {
  if (loading) { // lobby is loading
    return <LobbyLoadingPage/>;
  } else if (inGame) {
    return <GamePage/>
  } else {
    return <CustomLobbyPage/>
  }
};

export default connect(
  (state) => {
    const lobby = state.get(LOBBY);
    const loading = lobby === 'loading';
    const inGame = !loading && Boolean(lobby.get(GAME_ID));
    return ({ loading, inGame, });
  },
  (dispatch) => ({})
)(UnconnectedCustomLobbyContainer);