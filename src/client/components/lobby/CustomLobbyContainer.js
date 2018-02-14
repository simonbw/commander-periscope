import PropTypes from 'prop-types';
import React from 'react';
import { State } from 'statty';
import { GAME_ID } from '../../../common/fields/LobbyFields';
import { LOBBY } from '../../../common/fields/StateFields';
import { LOADING_LOBBY } from '../../Updaters';
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

UnconnectedCustomLobbyContainer.propTypes = {
  inGame: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};

const ConnectedCustomLobbyContainer = () => (
  <State
    select={(state) => ({
      loading: state.get(LOBBY) === LOADING_LOBBY,
      inGame: Boolean(state.getIn([LOBBY, GAME_ID]))
    })}
    render={({ loading, inGame }) => (
      <UnconnectedCustomLobbyContainer inGame={inGame} loading={loading}/>
    )}
  />
);

export default ConnectedCustomLobbyContainer;