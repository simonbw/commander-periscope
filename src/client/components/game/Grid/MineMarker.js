import PropTypes from 'prop-types';
import React from 'react';
import { LocationPropType } from '../../GamePropTypes';

// TODO: This should probably be a PureComponent
const SubMarker = ({ subLocation: location, color = "#000000" }) => {
  return (
    <g>
      <circle
        cx={location.get(0) + 0.5}
        cy={location.get(1) + 0.5}
        r={0.15}
        fill={color}
      />
      <circle
        cx={location.get(0) + 0.5}
        cy={location.get(1) + 0.5}
        r={0.25}
        fill={"none"}
        stroke={color}
        strokeWidth={0.04}
      />
    </g>
  );
};

SubMarker.propTypes = {
  location: LocationPropType.isRequired,
  color: PropTypes.isRequired
};

export default SubMarker;