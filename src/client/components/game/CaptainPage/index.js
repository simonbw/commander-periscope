import classnames from 'classnames';
import { List, ListItem, ListItemAvatar, ListItemText, Paper } from 'material-ui';
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
import DenseAvatar from '../../DenseAvatar';
import FloatingText from '../../FloatingText';
import { GridPropType, LocationListPropType, LocationPropType } from '../../GamePropTypes';
import GridBackground from '../../grid/GridBackground';
import GridContainer from '../../grid/GridContainer';
import GridCrosshairs from '../../grid/GridCrosshairs';
import GridLabels from '../../grid/GridLabels';
import GridMines from '../../grid/GridMines';
import GridMoveChooser from '../../grid/GridMoveChooser';
import GridPath from '../../grid/GridPath';
import GridSectors from '../../grid/GridSectors';
import GridSectorSelect from '../../grid/GridSectorSelect';
import GridTiles from '../../grid/GridTiles';
import GridTileSelect from '../../grid/GridTileSelect';
import MineChooser from '../../grid/MineChooser';
import SubMarker from '../../grid/SubMarker';
import TorpedoChooser from '../../grid/TorpedoChooser';
import { getIconForSystem } from '../../SystemIcons';
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
  
  constructor(props) {
    super(props);
    this.state = {
      waitingForResponse: false
    }
  }
  
  startWaiting() {
    this.setState({ waiting: true });
  }
  
  stopWaiting() {
    this.setState({ waiting: false });
  }
  
  componentWillReceiveProps(nextProps) {
    // TODO: This is really hacky and fragile and wrong
    if (
      !Immutable.is(nextProps.mines, this.props.mines) ||
      !Immutable.is(nextProps.started, this.props.started) ||
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
        gameStarted={this.props.started}
        systemStatuses={this.props.systems}
      >
        {({ mode, setMode }) => (
          <div id="captain-page" className={styles.CaptainPage}>
            <div className={styles.GridBox}>
              <GridContainer>
                {this.renderGridCommon(mode)}
                {this.renderMode(mode, setMode)}
              </GridContainer>
            </div>
            
            <div className={styles.RightPane}>
              <FloatingText className={styles.Messages}>
                {mode === PICK_START_LOCATION_MODE ? (
                  <div>Choose Start Location</div>
                ) : (
                  <Fragment>
                    {this.props.waitingForEngineer ?
                      <div className={styles.waiting}>Waiting for Engineer</div> :
                      <div className={styles.notWaiting}>Engineer has gone</div>}
                    {this.props.waitingForFirstMate ?
                      <div className={styles.waiting}>Waiting for First Mate</div> :
                      <div className={styles.notWaiting}>First Mate has gone</div>}
                  </Fragment>
                )}
              
              </FloatingText>
              <Paper className={styles.SystemsPanel}>
                {this.renderButtonList(mode, setMode)}
              </Paper>
            </div>
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
            this.startWaiting();
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
            this.startWaiting();
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
          <ListItemAvatar><DenseAvatar>M</DenseAvatar></ListItemAvatar>
          <ListItemText primary={"Move"}/>
        </ModeButton>
        <ModeButton mode={TORPEDO_MODE} currentMode={mode} setMode={setMode} disabled={!systems.get(TORPEDO)}>
          {getIconForSystem(TORPEDO)}
          <ListItemText primary={"Fire Torpedo"}/>
        </ModeButton>
        <ModeButton mode={DROP_MINE_MODE} currentMode={mode} setMode={setMode} disabled={!systems.get(MINE)}>
          {getIconForSystem(MINE)}
          <ListItemText primary={"Drop Mine"}/>
        </ModeButton>
        <ModeButton
          mode={DETONATE_MINE_MODE}
          currentMode={mode}
          setMode={setMode}
          disabled={this.props.mines.isEmpty()}
        >
          {getIconForSystem(MINE)}
          <ListItemText primary={"Detonate Mine"}/>
        </ModeButton>
        <ModeButton mode={DRONE_MODE} currentMode={mode} setMode={setMode} disabled={!systems.get(DRONE)}>
          {getIconForSystem(DRONE)}
          <ListItemText primary={"Launch Drone"}/>
        </ModeButton>
        <ListItem dense button disabled={!systems.get(SONAR)} onClick={() => this.props.useSonar()}>
          {getIconForSystem(SONAR)}
          <ListItemText primary={"Use Sonar"}/>
        </ListItem>
        <ModeButton mode={SILENT_MODE} currentMode={mode} setMode={setMode} disabled={!systems.get(SILENT)}>
          {getIconForSystem(SILENT)}
          <ListItemText primary={"Go Silent"}/>
        </ModeButton>
        <ListItem dense button onClick={() => this.props.surface()}>
          <ListItemAvatar><DenseAvatar>S</DenseAvatar></ListItemAvatar>
          <ListItemText primary={"Surface"}/>
        </ListItem>
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