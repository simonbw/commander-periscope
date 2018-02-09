import PropTypes from 'prop-types';
import React from 'react';
import { directionToAngle } from '../../../common/models/Direction';
import { DirectionPropType, LocationPropType } from '../GamePropTypes';

const DirectionMarker = ({ location, direction, color = "#000000" }) => (
  <polyline
    fill="none"
    points="-0.15,-0.35 0,-0.6 0.15,-0.35"
    stroke={color}
    strokeLinecap="round"
    strokeWidth={0.08}
    transform={`translate(${location.map(x => x + 0.5).join(',')}) rotate(${directionToAngle(direction)})`}
  />
);

DirectionMarker.propTypes = {
  color: PropTypes.string,
  direction: DirectionPropType.isRequired,
  location: LocationPropType.isRequired,
};

export default DirectionMarker;