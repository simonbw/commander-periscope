import PropTypes from 'prop-types';
import React, { Component } from 'react';

class GridMouseLocation extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    mouseLocation: PropTypes.array(),
  };
  
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  getTile() {
    const mouseLocation = this.props.mouseLocation;
    const tile = mouseLocation && mouseLocation.map((x) => Math.floor(x));
    if (!tile || tile[0] < 0 || tile[1 < 0 || tile[0] >= 15 || tile[1] >= 15]) {
      return null;
    }
    return tile;
  }
  
  render() {
    return (
      <g>
        {this.props.children(this.getTile())}
      </g>
    );
  }
}

export default GridMouseLocation;