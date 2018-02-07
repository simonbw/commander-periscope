import PropTypes from 'prop-types';
import React, { Component } from 'react';
import GridMouseLocationProvider from './GridMouseLocationProvider';

// TODO: Implement shouldComponentUpdate or something. Don't rerender children when tile doesn't change
// TODO: Figure out how to make multiple of these possible
class GridTileSelect extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    onSelect: PropTypes.func,
  };
  
  constructor(props) {
    super(props);
  }
  
  getTile(mouseLocation) {
    if (this.props.disabled) {
      return null;
    }
    const tile = mouseLocation && mouseLocation.map((x) => Math.floor(x));
    if (!tile || tile.some(x => x < 0 || tile[x] >= 15)) {
      return null;
    }
    return tile;
  }
  
  render() {
    const onSelect = this.props.onSelect && ((mouseLocation) => this.props.onSelect(this.getTile(mouseLocation)));
    return (
      <GridMouseLocationProvider
        onClick={this.props.disabled ? undefined : onSelect}
      >
        {(mouseLocation) => this.props.children(this.getTile(mouseLocation))}
      </GridMouseLocationProvider>
    );
  }
}

export default GridTileSelect;