import React from 'react';
import { LocationListPropType, LocationPropType } from '../GamePropTypes';
import TorpedoMarker from './TorpedoMarker';

// TODO: This should probably be a PureComponent
const TorpedoChooser = ({ torpedoOptions, mouseTile }) => {
  return (
    <g>
      {torpedoOptions.map(location => (
        <g
          fill={"none"}
          key={location}
        >
          <TorpedoMarker
            color={'#FF0000'}
            fillOpacity={location.equals(mouseTile) ? 1 : 0.2}
            strokeOpacity={location.equals(mouseTile) ? 1 : 0.2}
            location={location}
          />
        </g>
      ))}
    </g>
  );
};

TorpedoChooser.propTypes = {
  torpedoOptions: LocationListPropType.isRequired,
  mouseTile: LocationPropType
};

export default TorpedoChooser;