import React from 'react';
import { connect } from 'react-redux';
import * as Role from '../../../common/Role';
import { COMMON, GAME, SURFACED, TEAMS, USER_ID, WINNER } from '../../../common/StateFields';
import { getGamePhase, getPlayerPosition } from '../../../common/util/GameUtils';
import FloatingText from '../FloatingText';
import LoadingPage from '../LoadingPage';
import CaptainPage from './CaptainPage';
import EngineerPage from './EngineerPage';
import FirstMatePage from './FirstMatePage';
import RadioOperatorPage from './RadioOperatorPage';
import SurfacedPage from './SurfacedPage';

const UnconnectedGamePage = ({ team, role, gamePhase, winner, surfaced }) => {
  if (gamePhase === 'loading') { // TODO: constants
    return <LoadingPage/>
  } else if (gamePhase === 'over') { // TODO: constants
    return <GameOverPage win={team === winner}/>;
  } // else gamePhase == 'middle'
  
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

const GameOverPage = ({ win }) => (
  <div>
    <FloatingText>
      <h1>Game Over. You {win ? 'Win' : 'Lose'}</h1>
    </FloatingText>
  </div>
);

export default connect(
  (state) => {
    return {
      gamePhase: getGamePhase(state.get(GAME)),
      winner: state.getIn([GAME, WINNER]),
      surfaced: state.getIn([GAME, SURFACED]),
      ...getPlayerPosition(state.getIn([GAME, COMMON, TEAMS]), state.get(USER_ID))
    };
  },
  (dispatch) => ({})
)(UnconnectedGamePage);