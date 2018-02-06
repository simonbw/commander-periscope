import PropTypes from 'prop-types';
import React, { Component } from 'react';
import GridMouseLocationProvider from './GridMouseLocationProvider';

// TODO: Implement shouldComponentUpdate or something. Don't rerender children when tile doesn't change
// TODO: Figure out how to make multiple of these possible
class GridTileSelect extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    onSelect: PropTypes.func
  };
  
  constructor(props) {
    super(props);
  }
  
  getTile(mouseLocation) {
    const tile = mouseLocation && mouseLocation.map((x) => Math.floor(x));
    if (!tile || tile.some(x => x < 0 || tile[x] >= 15)) {
      return null;
    }
    return tile;
  }
  
  render() {
    const onSelect = this.props.onSelect;
    return (
      <GridMouseLocationProvider
        onClick={onSelect && ((mouseLocation) => onSelect(this.getTile(mouseLocation)))}
      >
        {(mouseLocation) => this.props.children(this.getTile(mouseLocation))}
      </GridMouseLocationProvider>
    );
  }
}

export default GridTileSelect;