import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import styles from '../../../../../styles/CaptainPage.css';
import {
  GRID, MINE_LOCATIONS, PHASE, SUB_LOCATION, SUB_PATH, SYSTEMS, TURN_INFO
} from '../../../../common/fields/GameFields';
import {
  GAME} from '../../../../common/fields/StateFields';
import { WAITING_FOR_ENGINEER, WAITING_FOR_FIRST_MATE } from '../../../../common/fields/TurnInfoFields';
import { getMineOptions, getMoveOptions, getSilentOptions, getTorpedoOptions } from '../../../../common/util/GameUtils';
import {
  detonateMine, dropMine, fireTorpedo, goSilent, headInDirection, setStartLocation, useDrone, useSonar
} from '../../../actions/GameActions';
import { GridPropType, LocationListPropType, LocationPropType } from '../../GamePropTypes';
import CaptainGridContainer from './CaptainGridContainer';
import DetonateMineMode from './DetonateMineMode';
import DroneMode from './DroneMode';
import DropMineMode from './DropMineMode';
import Messages from './Messages';
import ModeWrapper, {
  DETONATE_MINE_MODE, DRONE_MODE, DROP_MINE_MODE, MOVE_MODE, PICK_START_LOCATION_MODE, SILENT_MODE, TORPEDO_MODE
} from './ModeWrapper';
import MoveMode from './MoveMode';
import SilentMode from './SilentMode';
import StartLocationMode from './StartLocationMode';
import SystemsPanel from './SystemsPanel';
import TorpedoMode from './TorpedoMode';

export class UnconnectedCaptainContainer extends React.Component { // export for testing
  static propTypes = {
    // systems: ImmutablePropTypes.mapOf(PropTypes.bool).isRequired, // TODO: Update immutable-proptypes
    detonateMine: PropTypes.func.isRequired,
    dropMine: PropTypes.func.isRequired,
    fireTorpedo: PropTypes.func.isRequired,
    gamePhase: PropTypes.string.isRequired,
    goSilent: PropTypes.func.isRequired,
    grid: GridPropType,
    headInDirection: PropTypes.func.isRequired,
    mines: LocationListPropType.isRequired,
    setStartLocation: PropTypes.func.isRequired,
    subLocation: LocationPropType,
    subPath: LocationListPropType.isRequired,
    surface: PropTypes.func.isRequired,
    systems: ImmutablePropTypes.map.isRequired,
    useDrone: PropTypes.func.isRequired,
    useSonar: PropTypes.func.isRequired,
    waitingForEngineer: PropTypes.bool.isRequired,
    waitingForFirstMate: PropTypes.bool.isRequired,
  };
  
  constructor(props) {
    super(props);
    this.state = {
      waitingForResponse: false
    }
  }
  
  startWaiting() {
    this.setState({ waitingForResponse: true });
  }
  
  stopWaiting() {
    this.setState({ waitingForResponse: false });
  }
  
  componentWillReceiveProps(nextProps) {
    // TODO: This is really hacky and fragile and wrong
    if (
      !Immutable.is(nextProps.mines, this.props.mines) ||
      !Immutable.is(nextProps.gamePhase, this.props.gamePhase) ||
      !Immutable.is(nextProps.subLocation, this.props.subLocation) ||
      !Immutable.is(nextProps.subPath, this.props.subPath) ||
      !Immutable.is(nextProps.systems, this.props.systems)
    ) {
      this.stopWaiting();
    }
  }
  
  render() {
    return (
      <ModeWrapper
        gamePhase={this.props.gamePhase}
        systemStatuses={this.props.systems}
        hasMines={!this.props.mines.isEmpty()}
      >
        {({ mode, setMode }) => (
          <div id="captain-page" className={styles.CaptainPage}>
            <div className={styles.GridBox}>
              <CaptainGridContainer
                grid={this.props.grid}
                mines={this.props.mines}
                mode={mode}
                path={this.props.subPath}
                subLocation={this.props.subLocation}
              >
                {this.renderMode(mode, setMode)}
              </CaptainGridContainer>
            </div>
            
            <div className={styles.RightPane}>
              <Messages
                mode={mode}
                waitingForEngineer={this.props.waitingForEngineer}
                waitingForFirstMate={this.props.waitingForFirstMate}
              />
              
              <SystemsPanel
                mines={this.props.mines}
                mode={mode}
                setMode={setMode}
                surface={this.props.surface}
                systems={this.props.systems}
                useSonar={this.props.useSonar}
              />
            </div>
          </div>
        )}
      </ModeWrapper>
    );
  }
  
  renderMode(mode) {
    const startWaiting = () => this.startWaiting();
    const waitingForResponse = this.state.waitingForResponse;
    const mines = this.props.mines;
    const subLocation = this.props.subLocation;
    const grid = this.props.grid;
    const path = this.props.subPath;
    switch (mode) {
      case DETONATE_MINE_MODE:
        return <DetonateMineMode
          mines={mines}
          detonateMine={this.props.detonateMine}
          startWaiting={startWaiting}
          waitingForResponse={waitingForResponse}
        />;
      case DRONE_MODE:
        return <DroneMode
          useDrone={this.props.useDrone}
          startWaiting={startWaiting}
          waitingForResponse={waitingForResponse}
        />;
      case DROP_MINE_MODE:
        return <DropMineMode
          mineOptions={getMineOptions(subLocation, grid, path, mines)}
          dropMine={this.props.dropMine}
          startWaiting={startWaiting}
          waitingForResponse={waitingForResponse}
        />;
      case MOVE_MODE:
        return <MoveMode
          moveOptions={getMoveOptions(subLocation, grid, path, mines)}
          headInDirection={this.props.headInDirection}
          startWaiting={startWaiting}
          subLocation={subLocation}
          waitingForPlayers={this.props.waitingForFirstMate || this.props.waitingForEngineer}
          waitingForResponse={waitingForResponse}
        />;
      case PICK_START_LOCATION_MODE:
        return <StartLocationMode
          grid={grid}
          setStartLocation={this.props.setStartLocation}
          startWaiting={startWaiting}
          waitingForResponse={waitingForResponse}
        />;
      case TORPEDO_MODE:
        return <TorpedoMode
          torpedoOptions={getTorpedoOptions(subLocation, grid)}
          fireTorpedo={this.props.fireTorpedo}
          startWaiting={startWaiting}
          waitingForResponse={waitingForResponse}
        />;
      case SILENT_MODE:
        return <SilentMode
          goSilent={this.props.goSilent}
          moveOptions={getSilentOptions(subLocation, grid, path, mines)}
          startWaiting={startWaiting}
          subLocation={subLocation}
          waitingForResponse={waitingForResponse}
        />;
    }
  }
}

export default connect(
  (state) => ({
    gamePhase: state.getIn([GAME, PHASE]),
    grid: state.getIn([GAME, GRID]),
    mines: state.getIn([GAME, MINE_LOCATIONS]),
    subLocation: state.getIn([GAME, SUB_LOCATION]),
    subPath: state.getIn([GAME, SUB_PATH]),
    systems: state.getIn([GAME, SYSTEMS]),
    waitingForEngineer: state.getIn([GAME, TURN_INFO, WAITING_FOR_ENGINEER]),
    waitingForFirstMate: state.getIn([GAME, TURN_INFO, WAITING_FOR_FIRST_MATE]),
  }),
  (dispatch) => ({
    detonateMine: (location) => dispatch(detonateMine(location)),
    dropMine: (location) => dispatch(dropMine(location)),
    fireTorpedo: (location) => dispatch(fireTorpedo(location)),
    headInDirection: (direction) => dispatch(headInDirection(direction)),
    goSilent: (direction) => dispatch(goSilent(direction)),
    setStartLocation: (location) => dispatch(setStartLocation(location)),
    useDrone: (location) => dispatch(useDrone(location)),
    useSonar: (location) => dispatch(useSonar(location)),
  })
)(UnconnectedCaptainContainer);