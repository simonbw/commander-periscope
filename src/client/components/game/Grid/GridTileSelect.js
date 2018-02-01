import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { LocationPropType } from '../../GamePropTypes';

// TODO: Implement shouldComponentUpdate or something. Don't rerender children when tile doesn't change
class GridTileSelect extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    mouseLocation: LocationPropType,
  };
  
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  getTile(mouseLocation) {
    const tile = mouseLocation && mouseLocation.map((x) => Math.floor(x));
    if (!tile || tile.some(x => x < 0 || tile[x] >= 15)) {
      return null;
    }
    return tile;
  }
  
  render() {
    return (
      <g>
        {this.props.children(this.getTile(this.props.mouseLocation))}
      </g>
    );
  }
}

export default GridTileSelect;