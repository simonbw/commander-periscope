import classnames from 'classnames';
import { List, ListItem, ListItemText, Paper } from 'material-ui';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styles from '../../../../../styles/CaptainPage.css';
import { DRONE, MINE, SILENT, SONAR, TORPEDO } from '../../../../common/models/System';
import { LocationListPropType } from '../../GamePropTypes';
import { MoveIcon, SurfaceIcon } from '../../icons/ActionIcons';
import { DroneIcon, MineIcon, SilentIcon, SonarIcon, TorpedoIcon } from '../../icons/SystemIcons';
import {
  DETONATE_MINE_MODE, DRONE_MODE, DROP_MINE_MODE, MOVE_MODE, PICK_START_LOCATION_MODE, SILENT_MODE, TORPEDO_MODE
} from './ModeWrapper';

const SystemsPanel = (props) => (
  <Paper className={styles.SystemsPanel}>
    <List>
      <ModeButton
        mode={MOVE_MODE}
        currentMode={props.mode}
        setMode={props.setMode}
        disabled={props.mode === PICK_START_LOCATION_MODE}
      >
        <MoveIcon/>
        <ListItemText primary={"Move"}/>
      </ModeButton>
      
      <ModeButton
        mode={TORPEDO_MODE}
        currentMode={props.mode}
        setMode={props.setMode}
        disabled={!props.systems.get(TORPEDO)}
      >
        <TorpedoIcon/>
        <ListItemText primary={"Fire Torpedo"}/>
      </ModeButton>
      
      <ModeButton
        mode={DROP_MINE_MODE}
        currentMode={props.mode}
        setMode={props.setMode}
        disabled={!props.systems.get(MINE)}
      >
        <MineIcon/>
        <ListItemText primary={"Drop Mine"}/>
      </ModeButton>
      
      <ModeButton
        mode={DETONATE_MINE_MODE}
        currentMode={props.mode}
        setMode={props.setMode}
        disabled={props.mines.isEmpty()}
      >
        <MineIcon/>
        <ListItemText primary={"Detonate Mine"}/>
      </ModeButton>
      
      <ModeButton
        mode={DRONE_MODE}
        currentMode={props.mode}
        setMode={props.setMode}
        disabled={!props.systems.get(DRONE)}
      >
        <DroneIcon/>
        <ListItemText primary={"Launch Drone"}/>
      </ModeButton>
      
      <ListItem
        dense button
        disabled={!props.systems.get(SONAR)}
        onClick={() => props.useSonar()}
      >
        <SonarIcon/>
        <ListItemText primary={"Use Sonar"}/>
      </ListItem>
      
      <ModeButton
        mode={SILENT_MODE}
        currentMode={props.mode}
        setMode={props.setMode}
        disabled={!props.systems.get(SILENT)}
      >
        <SilentIcon/>
        <ListItemText primary={"Go Silent"}/>
      </ModeButton>
      
      <ListItem
        dense button
        onClick={() => props.surface()}
        disabled={props.mode === PICK_START_LOCATION_MODE}
      >
        <SurfaceIcon/>
        <ListItemText primary={"Surface"}/>
      </ListItem>
    </List>
  </Paper>
);

SystemsPanel.propTypes = {
  mines: LocationListPropType.isRequired,
  mode: PropTypes.string.isRequired,
  setMode: PropTypes.func.isRequired,
  surface: PropTypes.func.isRequired,
  systems: ImmutablePropTypes.map.isRequired,
  useSonar: PropTypes.func.isRequired,
};

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

export default SystemsPanel;