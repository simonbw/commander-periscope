import classnames from 'classnames';
import { List, ListItem, Paper } from 'material-ui';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import styles from '../../../../../styles/CaptainPage.css';
import { getDirection } from '../../../../common/Grid';
import {
  GAME,
  GRID,
  MINE_LOCATIONS,
  STARTED,
  SUB_LOCATION,
  SUB_PATH,
  SYSTEMS,
  TURN_INFO,
  WAITING_FOR_ENGINEER,
  WAITING_FOR_FIRST_MATE
} from '../../../../common/StateFields';
import { DRONE, MINE, SILENT, SONAR, TORPEDO } from '../../../../common/System';
import {
  getMineOptions,
  getMoveOptions,
  getSilentOptions,
  getTorpedoOptions,
  isValidStartLocation
} from '../../../../common/util/GameUtils';
import {
  detonateMine,
  dropMine,
  fireTorpedo,
  goSilent,
  headInDirection,
  setStartLocation,
  useDrone,
  useSonar
} from '../../../actions/GameActions';
import { GridPropType, LocationListPropType, LocationPropType } from '../../GamePropTypes';
import GridBackground from '../Grid/GridBackground';
import GridContainer from '../Grid/GridContainer';
import GridCrosshairs from '../Grid/GridCrosshairs';
import GridLabels from '../Grid/GridLabels';
import GridMines from '../Grid/GridMines';
import GridMoveChooser from '../Grid/GridMoveChooser';
import GridPath from '../Grid/GridPath';
import GridSectors from '../Grid/GridSectors';
import GridSectorSelect from '../Grid/GridSectorSelect';
import GridTiles from '../Grid/GridTiles';
import GridTileSelect from '../Grid/GridTileSelect';
import MineChooser from '../Grid/MineChooser';
import SubMarker from '../Grid/SubMarker';
import TorpedoChooser from '../Grid/TorpedoChooser';
import ModeWrapper, {
  DETONATE_MINE_MODE,
  DRONE_MODE,
  DROP_MINE_MODE,
  MOVE_MODE,
  PICK_START_LOCATION_MODE,
  SILENT_MODE,
  TORPEDO_MODE
} from './ModeWrapper';

export class UnconnectedCaptainContainer extends React.Component { // export for testing
  static propTypes = {
    // systems: ImmutablePropTypes.mapOf(PropTypes.bool).isRequired, // TODO: Update immutable-proptypes
    detonateMine: PropTypes.func.isRequired,
    dropMine: PropTypes.func.isRequired,
    fireTorpedo: PropTypes.func.isRequired,
    goSilent: PropTypes.func.isRequired,
    grid: GridPropType,
    headInDirection: PropTypes.func.isRequired,
    mines: LocationListPropType.isRequired,
    setStartLocation: PropTypes.func.isRequired,
    started: PropTypes.bool.isRequired,
    subLocation: LocationPropType,
    subPath: LocationListPropType.isRequired,
    surface: PropTypes.func.isRequired,
    systems: ImmutablePropTypes.map.isRequired,
    useDrone: PropTypes.func.isRequired,
    useSonar: PropTypes.func.isRequired,
    waitingForEngineer: PropTypes.bool.isRequired,
    waitingForFirstMate: PropTypes.bool.isRequired,
  };
  
  render() {
    return (
      <ModeWrapper
        gameStarted={this.props.started}
        systemStatuses={this.props.systems}
      >
        {({ mode, setMode }) => (
          <div className={styles.CaptainPage}>
            <div className={styles.GridBox}>
              <GridContainer>
                {this.renderGridCommon(mode)}
                {this.renderMode(mode, setMode)}
              </GridContainer>
            </div>
            
            <Paper className={styles.SystemsPanel}>
              {mode === PICK_START_LOCATION_MODE && (
                <h2>Choose Start Location</h2>
              )}
              {mode !== PICK_START_LOCATION_MODE && this.renderButtonList(mode, setMode)}
            </Paper>
          </div>
        )}
      </ModeWrapper>
    );
  }
  
  renderGridCommon(mode) {
    const subLocation = this.props.subLocation;
    let path = this.props.subPath;
    if (subLocation) {
      path = path.push(subLocation)
    }
    return (
      <Fragment>
        <GridBackground height={15} width={15}/> {/* TODO: Don't hard code*/}
        {mode !== DRONE_MODE && <GridSectors/>}
        <GridTiles grid={this.props.grid}/>
        {mode !== PICK_START_LOCATION_MODE && <GridLabels height={15} width={15}/>}
        <GridPath path={path}/>
        <GridMines mines={this.props.mines}/>
        {subLocation && <SubMarker location={subLocation}/>}
      </Fragment>
    );
  }
  
  renderMode(mode, setMode) {
    switch (mode) {
      case DRONE_MODE:
        return this.renderDroneMode();
      case DETONATE_MINE_MODE:
        return this.renderDetonateMineMode(setMode);
      case DROP_MINE_MODE:
        return this.renderDropMineMode();
      case MOVE_MODE:
        return this.renderMoveMode();
      case PICK_START_LOCATION_MODE:
        return this.renderPickStartLocationMode();
      case TORPEDO_MODE:
        return this.renderTorpedoMode();
      case SILENT_MODE:
        return this.renderSilentMode();
    }
  }
  
  // TODO: Turn this into a Component
  renderPickStartLocationMode() {
    return (
      <GridTileSelect
        onSelect={(tile) => {
          if (isValidStartLocation(tile, this.props.grid)) {
            this.props.setStartLocation(tile);
          }
        }}
      >
        {(tile) => {
          const isValid = isValidStartLocation(tile, this.props.grid);
          return (
            <Fragment>
              <GridCrosshairs tile={tile} color={isValid ? '#FFFFFF' : '#AA5555'}/>
              <GridLabels height={15} width={15} selectedX={tile && tile.get(0)} selectedY={tile && tile.get(1)}/>
            </Fragment>
          );
        }}
      </GridTileSelect>
    );
  }
  
  // TODO: Turn this into a Component
  renderMoveMode() {
    const { grid, subLocation, subPath, mines } = this.props;
    const moveOptions = getMoveOptions(subLocation, grid, subPath, mines);
    return (
      <GridTileSelect
        onSelect={(tile) => {
          if (moveOptions.includes(tile)) {
            const direction = getDirection(subLocation, tile);
            this.props.headInDirection(direction);
          }
        }}
      >
        {(tile) => (
          <GridMoveChooser
            mouseTile={tile}
            moveOptions={moveOptions}
            subLocation={subLocation}
          />
        )}
      </GridTileSelect>
    );
  }
  
  // TODO: Turn this into a Component
  renderSilentMode() {
    const { grid, subLocation, subPath, mines } = this.props;
    const moveOptions = getSilentOptions(subLocation, grid, subPath, mines);
    return (
      <GridTileSelect
        onSelect={(tile) => {
          if (moveOptions.includes(tile)) {
            this.props.goSilent(tile);
          }
        }}
      >
        {(tile) => (
          <GridMoveChooser
            mouseTile={tile}
            moveOptions={moveOptions}
            subLocation={subLocation}
          />
        )}
      </GridTileSelect>
    );
  }
  
  // TODO: Turn this into a Component
  renderDroneMode() {
    return (
      <GridSectorSelect onSelect={(sector) => this.props.useDrone(sector)}>
        {(sector) => (
          <GridSectors selected={sector}/>
        )}
      </GridSectorSelect>
    );
  }
  
  // TODO: Turn this into a Component
  renderDropMineMode() {
    const { grid, subLocation, subPath, mines } = this.props;
    const mineOptions = getMineOptions(subLocation, grid, subPath, mines);
    return (
      <GridTileSelect
        onSelect={(tile) => {
          if (mineOptions.includes(tile)) {
            this.props.dropMine(tile);
          }
        }}
      >
        {(tile) => (
          <MineChooser mouseTile={tile} mineOptions={mineOptions}/>
        )}
      </GridTileSelect>
    );
  }
  
  // TODO: Turn this into a Component
  renderDetonateMineMode(setMode) {
    const mines = this.props.mines;
    return (
      <GridTileSelect
        onSelect={(tile) => {
          if (mines.includes(tile)) {
            this.props.detonateMine(tile);
            setMode(MOVE_MODE);
          }
        }}
      >
        {(tile) => (
          <GridCrosshairs tile={tile} color={mines.includes(tile) ? '#FFFFFF' : '#AA5555'}/>
        )}
      </GridTileSelect>
    );
  }
  
  // TODO: Turn this into a Component
  renderTorpedoMode() {
    const { grid, subLocation } = this.props;
    const torpedoOptions = getTorpedoOptions(subLocation, grid);
    return (
      <GridTileSelect
        onSelect={(tile) => {
          if (torpedoOptions.includes(tile)) {
            this.props.fireTorpedo(tile);
          }
        }}
      >
        {(tile) => (
          <TorpedoChooser mouseTile={tile} torpedoOptions={torpedoOptions}/>
        )}
      </GridTileSelect>
    );
  }
  
  // TODO: Turn this into a Component
  renderButtonList(mode, setMode) {
    const systems = this.props.systems;
    return (
      <List>
        <ModeButton mode={MOVE_MODE} currentMode={mode} setMode={setMode}>
          Move
        </ModeButton>
        <ModeButton mode={TORPEDO_MODE} currentMode={mode} setMode={setMode} disabled={!systems.get(TORPEDO)}>
          Fire Torpedo
        </ModeButton>
        <ModeButton mode={DROP_MINE_MODE} currentMode={mode} setMode={setMode} disabled={!systems.get(MINE)}>
          Drop Mine
        </ModeButton>
        <ModeButton
          mode={DETONATE_MINE_MODE}
          currentMode={mode}
          setMode={setMode}
          disabled={this.props.mines.isEmpty()}
        >
          Detonate Mine
        </ModeButton>
        <ModeButton mode={DRONE_MODE} currentMode={mode} setMode={setMode} disabled={!systems.get(DRONE)}>
          Launch Drone
        </ModeButton>
        <ListItem dense button disabled={!systems.get(SONAR)} onClick={() => this.props.useSonar()}>
          Use Sonar
        </ListItem>
        <ModeButton mode={SILENT_MODE} currentMode={mode} setMode={setMode} disabled={!systems.get(SILENT)}>
          Go Silent
        </ModeButton>
        <ListItem dense button onClick={() => this.props.surface()}>Surface</ListItem>
      </List>
    );
  }
}

const ModeButton = ({ mode, currentMode, setMode, disabled, children }) => (
  <ListItem
    dense
    button
    disabled={disabled}
    className={classnames(styles.SystemButton, { [styles.active]: mode === currentMode })}
    onClick={() => setMode(mode)}
  >
    {children}
  </ListItem>
);

ModeButton.propTypes = {
  children: PropTypes.node.isRequired,
  currentMode: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  mode: PropTypes.string.isRequired,
  setMode: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    grid: state.getIn([GAME, GRID]),
    started: state.getIn([GAME, STARTED]),
    subLocation: state.getIn([GAME, SUB_LOCATION]),
    subPath: state.getIn([GAME, SUB_PATH]),
    mines: state.getIn([GAME, MINE_LOCATIONS]),
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