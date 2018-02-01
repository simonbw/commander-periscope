import PropTypes from 'prop-types';
import React, { Component } from 'react';

class GridMouseLocation extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  };
  
  constructor(props) {
    super(props);
    this.state = {
      mousePosition: null
    };
    this._gRef = null;
  }
  
  updateMousePosition(clientX, clientY) {
    const svg = this._gRef.ownerSVGElement;
    const p = svg.createSVGPoint();
    
    p.x = clientX;
    p.y = clientY;
    const p2 = p.matrixTransform(svg.getScreenCTM().inverse());
    
    const mousePosition = [p2.x, p2.y];
    this.setState({ mousePosition });
  }
  
  render() {
    return (
      <g ref={(gRef) => this._gRef = gRef}>
        {this.props.children(this.state.mousePosition)}
        <rect
          fill="transparent"
          height={15} // TODO: Don't hard code this
          onMouseLeave={() => this.setState({ mousePosition: null })}
          onMouseMove={(event) => this.updateMousePosition(event.clientX, event.clientY)}
          width={15} // TODO: Don't hard code this
          x={0}
          y={0}
        />
      </g>
    );
  }
}

export default GridMouseLocation;