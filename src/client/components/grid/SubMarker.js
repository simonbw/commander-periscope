import PropTypes from 'prop-types';
import React from 'react';
import { LocationPropType } from '../../GamePropTypes';

const SubMarker = ({ location, color = "#000000" }) => {
  return (
    <g>
      <circle
        cx={location.get(0) + 0.5}
        cy={location.get(1) + 0.5}
        r={0.12}
        fill={color}
        stroke={"none"}
      />
      <circle
        cx={location.get(0) + 0.5}
        cy={location.get(1) + 0.5}
        r={0.22}
        fill={"none"}
        stroke={color}
        strokeWidth={0.04}
      />
    </g>
  );
};

SubMarker.propTypes = {
  location: LocationPropType.isRequired,
  color: PropTypes.string
};

export default SubMarker;