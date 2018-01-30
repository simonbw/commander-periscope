import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import styles from '../../../../../styles/CaptainPage.css';
import { WATER_TILE } from '../../../../common/Grid';
import {
  GAME,
  GRID,
  SUB_LOCATION,
  SUB_PATH,
  SYSTEMS,
  TURN_INFO,
  WAITING_FOR_ENGINEER,
  WAITING_FOR_FIRST_MATE
} from '../../../../common/StateFields';
import { headInDirection, setStartLocation } from '../../../actions/GameActions';
import DirectionSelect from '../DirectionSelect';
import Grid from '../GridView';

export class UnconnectedCaptainContainer extends React.Component { // export for testing
  static propTypes = {
    grid: PropTypes.object.isRequired,
    headInDirection: PropTypes.func.isRequired,
    setStartLocation: PropTypes.func.isRequired,
    started: PropTypes.bool.isRequired,
    subLocation: PropTypes.object,
    subPath: PropTypes.object.isRequired,
    systems: PropTypes.object.isRequired,
    waitingForEngineer: PropTypes.bool.isRequired,
    waitingForFirstMate: PropTypes.bool.isRequired,
  };
  
  render() {
    const { started } = this.props;
    return (
      <div id="captain-page" className={styles.CaptainPage}>
        {started ? this.renderStarted() : this.renderPreStart()}
      </div>
    );
  }
  
  renderPreStart() {
    const { grid, subLocation, setStartLocation } = this.props;
    return (
      <Fragment>
        <Grid
          grid={grid}
          subLocation={subLocation}
          canClick={(location) => grid.getIn(location) === WATER_TILE}
          onClick={(location) => setStartLocation(location)}
        />
        <h1>Choose a start location</h1>
      </Fragment>
    );
  }
  
  renderStarted() {
    const { grid, subLocation, subPath, systems, waitingForEngineer, waitingForFirstMate, headInDirection } = this.props;
    return (
      <Fragment>
        <DirectionSelect
          headInDirection={headInDirection}
          grid={grid}
          subLocation={subLocation}
          subPath={subPath}
          waiting={waitingForFirstMate || waitingForEngineer}
        />
        <MessagesPanel
          waitingForFirstMate={waitingForFirstMate}
          waitingForEngineer={waitingForEngineer}
        />
        <SystemsPanel systems={systems}/>
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
    grid: state.getIn([GAME, GRID]),
    subLocation: state.getIn([GAME, SUB_LOCATION]),
    subPath: state.getIn([GAME, SUB_PATH]),
    systems: state.getIn([GAME, SYSTEMS]),
    waitingForEngineer: state.getIn([GAME, TURN_INFO, WAITING_FOR_ENGINEER]),
    waitingForFirstMate: state.getIn([GAME, TURN_INFO, WAITING_FOR_FIRST_MATE]),
  }),
  (dispatch) => ({
    headInDirection: (direction) => dispatch(headInDirection(direction)),
    setStartLocation: (location) => dispatch(setStartLocation(location))
  })
)(UnconnectedCaptainContainer);