import PropTypes from 'prop-types';
import React from 'react';
import { LocationPropType } from '../../GamePropTypes';

// TODO: This should probably be a PureComponent
const MineMarker = ({ location, color = "#CC0000" }) => {
  return (
    <g transform={`translate(${location.get(0) + 0.5},${location.get(1) + 0.5})`}>
      <circle
        fill={color}
        r={0.16}
        stroke="none"
      />
      {[0, 45, 90, 135].map((angle) => (
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
    </g>
  );
};

MineMarker.propTypes = {
  location: LocationPropType.isRequired,
  color: PropTypes.string
};

export default MineMarker;