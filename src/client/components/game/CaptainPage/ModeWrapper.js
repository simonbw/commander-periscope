import PropTypes from 'prop-types';
import React, { Component } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes';
import { PICK_PHASE } from '../../../../common/GamePhase';
import { DRONE, MINE, SILENT, TORPEDO } from '../../../../common/System';

// Modes
export const DRONE_MODE = 'DRONE_MODE';
export const DROP_MINE_MODE = 'DROP_MINE_MODE';
export const DETONATE_MINE_MODE = 'DETONATE_MINE_MODE';
export const MOVE_MODE = 'MOVE_MODE';
export const PICK_START_LOCATION_MODE = 'PICK_START_LOCATION_MODE';
export const SILENT_MODE = 'SILENT_MODE';
export const TORPEDO_MODE = 'TORPEDO_MODE';

// Keeps track of what mode the component is in
class ModeWrapper extends Component {
  static propTypes = {
    // systemStatuses: ImmutablePropTypes.mapOf(PropTypes.bool).isRequired // TODO: Update immutable-proptypes
    children: PropTypes.func.isRequired,
    gamePhase: PropTypes.string.isRequired,
    hasMines: PropTypes.bool.isRequired,
    systemStatuses: ImmutablePropTypes.map.isRequired,
  };
  
  constructor(props) {
    super(props);
    this.state = {
      targetMode: MOVE_MODE,
    };
    console.log(this.props.systemStatuses.toJS());
  }
  
  componentWillReceiveProps(props) {
    const currentSystem = this.getRequiredSystem();
    if (currentSystem && !props.systemStatuses.get(currentSystem)) {
      this.setState({ targetMode: MOVE_MODE });
    } else if (this.state.targetMode === DETONATE_MINE_MODE && !props.hasMines) {
      this.setState({ targetMode: MOVE_MODE });
    }
  }
  
  getRequiredSystem() {
    switch (this.state.targetMode) {
      case DRONE_MODE:
        return DRONE;
      case DROP_MINE_MODE:
        return MINE;
      case SILENT_MODE:
        return SILENT;
      case TORPEDO_MODE:
        return TORPEDO;
      default:
        return null;
    }
  }
  
  setMode(targetMode) {
    this.setState({ targetMode });
  }
  
  getMode() {
    if (this.props.gamePhase === PICK_PHASE) {
      return PICK_START_LOCATION_MODE;
    }
    return this.state.targetMode
  }
  
  render() {
    return this.props.children({
      mode: this.getMode(),
      setMode: (mode) => this.setMode(mode),
    });
  }
}

export default ModeWrapper;