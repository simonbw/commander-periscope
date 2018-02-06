import PropTypes from 'prop-types';
import React, { Component } from 'react';
import GridMouseLocationProvider from './GridMouseLocationProvider';

// TODO: Implement shouldComponentUpdate or something. Don't rerender children when sector doesn't change
// TODO: Figure out how to make multiple of these possible
class GridSectorSelect extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    onSelect: PropTypes.func
  };
  
  constructor(props) {
    super(props);
  }
  
  getSector(mouseLocation) {
    if (!mouseLocation) {
      return null;
    }
    const col = Math.floor(mouseLocation.get(0) / 5); // TODO: Don't hardcode
    const row = Math.floor(mouseLocation.get(1) / 5); // TODO: Don't hardcode
    if (row < 0 || col < 0) {
      return null
    }
    return 3 * row + col
  }
  
  render() {
    const onSelect = this.props.onSelect;
    return (
      <GridMouseLocationProvider
        onClick={onSelect && ((mouseLocation) => onSelect(this.getSector(mouseLocation)))}
      >
        {(mouseLocation) => this.props.children(this.getSector(mouseLocation))}
      </GridMouseLocationProvider>
    );
  }
}

export default GridSectorSelect;