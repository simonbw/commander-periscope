import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { getGridSize, tileToSector } from '../../../common/Grid';
import GridMouseLocationProvider from './GridMouseLocationProvider';

// TODO: Implement shouldComponentUpdate or something. Don't rerender children when sector doesn't change
// TODO: Figure out how to make multiple of these possible
class GridSectorSelect extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    onSelect: PropTypes.func
  };
  
  constructor(props) {
    super(props);
  }
  
  render() {
    const onSelect = this.props.onSelect;
    return (
      <GridMouseLocationProvider
        onClick={!this.props.disabled && onSelect && (
          (mouseLocation) => onSelect(tileToSector(mouseLocation, getGridSize()))) /*TODO: Real grid size*/}
      >
        {(mouseLocation) => this.props.children(
          this.props.disabled ? null : tileToSector(mouseLocation, getGridSize())) /*TODO: Real grid size*/}
      </GridMouseLocationProvider>
    );
  }
}

export default GridSectorSelect;