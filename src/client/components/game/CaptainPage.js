import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import styles from '../../../../styles/CaptainPage.css';
import { WATER_TILE } from '../../../common/Grid';
import {
  COMMON,
  GAME,
  GRID,
  STARTED,
  SUB_LOCATION,
  SUB_PATH,
  SYSTEMS,
  TURN_INFO,
  WAITING_FOR_ENGINEER,
  WAITING_FOR_FIRST_MATE
} from '../../../common/StateFields';
import { headInDirection, setStartLocation } from '../../actions/GameActions';
import DirectionSelect from './DirectionSelect';
import Grid from './GridView';

export class UnconnectedCaptainPage extends React.Component { // export for testing
  render() {
    const { game } = this.props;
    return (
      <div id="captain-page" className={styles.CaptainPage}>
        {game.getIn([COMMON, STARTED]) ? this.renderStarted() : this.renderPreStart()}
      </div>
    );
  }
  
  renderPreStart() {
    const { game, setStartLocation } = this.props;
    return (
      <Fragment>
        <Grid
          grid={game.get(GRID)}
          subLocation={game.get(SUB_LOCATION)}
          canClick={(location) => game.get(GRID).getIn(location) === WATER_TILE}
          onClick={(location) => setStartLocation(location)}
        />
        <h1>Choose a start location</h1>
      </Fragment>
    );
  }
  
  renderStarted() {
    const { game, headInDirection } = this.props;
    const waitingForFirstMate = game.getIn([TURN_INFO, WAITING_FOR_FIRST_MATE]);
    const waitingForEngineer = game.getIn([TURN_INFO, WAITING_FOR_ENGINEER]);
    return (
      <Fragment>
        <DirectionSelect
          headInDirection={headInDirection}
          grid={game.get(GRID)}
          subPath={game.get(SUB_PATH)}
          subLocation={game.get(SUB_LOCATION)}
          waiting={waitingForFirstMate || waitingForEngineer}
        />
        <MessagesPanel
          waitingForFirstMate={waitingForFirstMate}
          waitingForEngineer={waitingForEngineer}
        />
        <SystemsPanel systems={game.get(SYSTEMS)}/>
      </Fragment>
    );
  }
}

const SystemsPanel = ({ systems }) => (
  <div className={styles.SystemsPanel}>
    {systems.map((available, name) => (
      <button
        key={name}
        disabled={!available}
        onClick={() => console.log(name)} // TODO: Actually use systems
      >
        {name}
      </button>
    )).valueSeq()}
  </div>
);

const MessagesPanel = ({ waitingForFirstMate, waitingForEngineer }) => (
  <div className={styles.Messages}>
    <h2>Messages</h2>
    {waitingForFirstMate && <div className={styles.WaitingMessage}>Waiting for first mate...</div>}
    {waitingForEngineer && <div className={styles.WaitingMessage}>Waiting for engineer...</div>}
  </div>
);

export default connect(
  (state) => ({
    game: state.get(GAME),
  }),
  (dispatch) => ({
    headInDirection: (direction) => dispatch(headInDirection(direction)),
    setStartLocation: (location) => dispatch(setStartLocation(location))
  })
)(UnconnectedCaptainPage);