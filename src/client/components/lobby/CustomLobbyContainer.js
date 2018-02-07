import React from 'react';
import { connect } from 'react-redux';
import { GAME_ID } from '../../../common/fields/LobbyFields';
import { LOBBY } from '../../../common/fields/StateFields';
import GamePage from '../game/GamePage';
import LoadingPage from '../LoadingPage';
import CustomLobbyPage from './CustomLobbyPage';

export const UnconnectedCustomLobbyContainer = ({ loading, inGame }) => {
  if (loading) { // lobby is loading
    return <LoadingPage/>;
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