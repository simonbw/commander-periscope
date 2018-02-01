import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { LocationPropType } from '../../GamePropTypes';

// TODO: Implement shouldComponentUpdate or something. Don't rerender children when sector doesn't change
class GridSectorSelect extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    mouseLocation: LocationPropType,
  };
  
  constructor(props) {
    super(props);
  }
  
  getSector() {
    const mouseLocation = this.props.mouseLocation;
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
    return (
      <g>
        {this.props.children(this.getSector())}
      </g>
    );
  }
}

export default GridSectorSelect;