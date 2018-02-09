import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

// TODO: Find a way to have multiple of these without the performance penalty
// TODO: Consider moving this stuff into the context of the top component
class GridMouseLocationProvider extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    onClick: PropTypes.func
  };
  
  constructor(props) {
    super(props);
    this.state = {
      mousePosition: null
    };
    this._gRef = null;
  }
  
  extractMousePosition(event) {
    const svg = this._gRef.ownerSVGElement;
    const p = svg.createSVGPoint();
    p.x = event.clientX;
    p.y = event.clientY;
    const p2 = p.matrixTransform(svg.getScreenCTM().inverse());
    return Immutable.List([p2.x, p2.y]);
  }
  
  render() {
    const onClick = this.props.onClick;
    return (
      <g
        ref={(gRef) => this._gRef = gRef}
        onClick={onClick && ((event) => onClick(this.extractMousePosition(event)))}
      >
        {this.props.children(this.state.mousePosition)}
        <rect
          fill="transparent"
          height={15} // TODO: Don't hard code this
          onMouseLeave={() => this.setState({ mousePosition: null })}
          onMouseMove={(event) => {
            this.setState({ mousePosition: this.extractMousePosition(event) });
          }}
          width={15} // TODO: Don't hard code this
          x={0}
          y={0}
        />
      </g>
    );
  }
}

export default GridMouseLocationProvider;