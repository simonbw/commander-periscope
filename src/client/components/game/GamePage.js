import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { State } from 'statty';
import { PHASE, ROLE, SURFACED, TEAM, WINNER } from '../../../common/fields/GameFields';
import { GAME } from '../../../common/fields/StateFields';
import { ALL_PHASES, ENDED_PHASE, LOADING_PHASE } from '../../../common/models/GamePhase';
import * as Role from '../../../common/models/Role';
import { ALL_ROLES } from '../../../common/models/Role';
import { BOTH_TEAMS } from '../../../common/models/Team';
import { setUrlForMenu } from '../../navigation';
import { leaveLobbyUpdater } from '../../Updaters';
import LoadingPage from '../LoadingPage';
import CaptainPage from './CaptainPage';
import DamageFlash from './DamageFlash';
import EngineerPage from './EngineerPage/index';
import FirstMatePage from './FirstMatePage/index';
import GameOverPage from './GameOverPage';
import RadioOperatorPage from './RadioOperatorPage/index';
import SurfacedPage from './SurfacedPage';

const UnconnectedGamePage = ({ team, role, gamePhase, winner, surfaced, goToMainMenu }) => {
  if (gamePhase === LOADING_PHASE) {
    return <LoadingPage/>
  } else if (gamePhase === ENDED_PHASE) {
    return <GameOverPage isWinner={team === winner} goToMainMenu={goToMainMenu}/>;
  }
  
  if (surfaced) {
    return <SurfacedPage/>
  }
  
  return (
    <Fragment>
      <DamageFlash/>
      {getRolePage(role)}
    </Fragment>
  )
};

const getRolePage = (role) => {
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

UnconnectedGamePage.propTypes = {
  gamePhase: PropTypes.oneOf(ALL_PHASES).isRequired,
  goToMainMenu: PropTypes.func.isRequired,
  role: PropTypes.oneOf(ALL_ROLES),
  surfaced: PropTypes.bool.isRequired,
  team: PropTypes.oneOf(BOTH_TEAMS),
  winner: PropTypes.oneOf(BOTH_TEAMS),
};

const ConnectedGamePage = () => (
  <State
    select={(state) => ({
      gamePhase: state.getIn([GAME, PHASE]),
      role: state.getIn([GAME, ROLE]),
      surfaced: state.getIn([GAME, SURFACED]),
      team: state.getIn([GAME, TEAM]),
      winner: state.getIn([GAME, WINNER]),
    })}
    render={({ gamePhase, role, surfaced, team, winner }, update) => (
      <UnconnectedGamePage
        gamePhase={gamePhase}
        goToMainMenu={() => {
          setUrlForMenu();
          update(leaveLobbyUpdater);
        }}
        role={role}
        surfaced={surfaced}
        team={team}
        winner={winner}
      />
    )}
  />
);

export default ConnectedGamePage;