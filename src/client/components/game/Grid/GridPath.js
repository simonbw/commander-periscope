import PropTypes from 'prop-types';
import React from 'react';
import { getDirection } from '../../../../common/Grid';
import { LocationListPropType } from '../../GamePropTypes';
import DirectionMarker from './DirectionMarker';

// TODO: This should probably be a PureComponent
const GridPath = ({ path, showDirection = true }) => {
  if (path.isEmpty()) {
    return null;
  }
  const directions = path.butLast().map((p, i) => getDirection(p, path.get(i + 1)));
  const color = "#000000";
  return (
    <g>
      <polyline
        fill="none"
        points={`${path.map((p) => p.map(x => x + 0.5).join(',')).join(' ')}`}
        stroke={color}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth={0.08}
      />
      {showDirection && (
        directions.zip(path).map(([direction, location], i) => (
          <DirectionMarker key={i} direction={direction} location={location}/>
        ))
      )}
    </g>
  );
};

GridPath.propTypes = {
  path: LocationListPropType.isRequired,
  showDirection: PropTypes.bool
};

export default GridPath;