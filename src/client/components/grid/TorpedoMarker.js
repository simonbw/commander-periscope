import PropTypes from 'prop-types';
import React from 'react';
import { LocationPropType } from '../GamePropTypes';

// TODO: This should probably be a PureComponent
const TorpedoMarker = ({ location, color = "#CC0000", ...otherProps }) => {
  return (
    <g transform={`translate(${location.get(0) + 0.5},${location.get(1) + 0.5})`} {...otherProps}>
      {[0, 90].map((angle) => (
        <line
          key={angle}
          x1={-0.25} y1={0}
          x2={0.25} y2={0}
          stroke={color}
          strokeWidth={0.05}
          strokeLinecap="round"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle
        fill="none"
        r={0.25}
        stroke={color}
        strokeWidth={0.05}
      />
    </g>
  );
};

TorpedoMarker.propTypes = {
  location: LocationPropType.isRequired,
  color: PropTypes.string
};

export default TorpedoMarker;