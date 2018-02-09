import React from 'react';
import { connect } from 'react-redux';
import { PHASE, ROLE, SURFACED, TEAM, WINNER } from '../../../common/fields/GameFields';
import { GAME } from '../../../common/fields/StateFields';
import { ENDED_PHASE, LOADING_PHASE } from '../../../common/GamePhase';
import * as Role from '../../../common/Role';
import { leaveCustomLobby } from '../../actions/CustomLobbyActions';
import GameOverPage from '../GameOverPage';
import LoadingPage from '../LoadingPage';
import CaptainPage from './CaptainPage';
import EngineerPage from './EngineerPage';
import FirstMatePage from './FirstMatePage/index';
import RadioOperatorPage from './RadioOperatorPage/index';
import SurfacedPage from './SurfacedPage';

const UnconnectedGamePage = ({ team, role, gamePhase, winner, surfaced, goToMainMenu }) => {
  if (gamePhase === LOADING_PHASE) { // TODO: constants
    return <LoadingPage/>
  } else if (gamePhase === ENDED_PHASE) { // TODO: constants
    return <GameOverPage isWinner={team === winner} goToMainMenu={goToMainMenu}/>;
  }
  
  if (surfaced) {
    return <SurfacedPage/>
  }
  
  switch (role) {
    case Role.CAPTAIN:
      return <CaptainPage/>;
    case Role.ENGINEER:
      return <EngineerPage/>;
    case Role.FIRST_MATE:
      return <FirstMatePage/>;
    case Role.RADIO_OPERATOR:
      return <RadioOperatorPage/>;
    default:
      return (
        <div id="unknown-role-page">
          <span>Unknown role: "{role}"</span>
        </div>
      );
  }
};

export default connect(
  (state) => {
    return {
      gamePhase: state.getIn([GAME, PHASE]),
      role: state.getIn([GAME, ROLE]),
      surfaced: state.getIn([GAME, SURFACED]),
      team: state.getIn([GAME, TEAM]),
      winner: state.getIn([GAME, WINNER]),
    };
  },
  (dispatch) => ({
    goToMainMenu: () => dispatch(leaveCustomLobby())
  })
)(UnconnectedGamePage);