import PropTypes from 'prop-types';
import React, { Component } from 'react'

// Modes
export const MOVE_MODE = 'MOVE_MODE';
export const PICK_LOCATION_MODE = 'PICK_LOCATION_MODE';

// Keeps track of what mode the component is in
class ModeWrapper extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    gameStarted: PropTypes.bool.isRequired
  };
  
  constructor(props) {
    super(props);
    this.state = { mode };
  }
  
  setMode(mode) {
    this.setState({ mode });
  }
  
  getMode() {
    return this.state.mode
  }
  
  render() {
    return this.props.children({
      mode: this.getMode(),
      setMode: (mode) => this.setMode(mode)
    })
  }
}

export default ModeWrapper;