import React from 'react';
import { LocationListPropType, LocationPropType } from '../GamePropTypes';
import MineMarker from './MineMarker';

// TODO: This should probably be a PureComponent
const MineChooser = ({ mineOptions, mouseTile }) => {
  return (
    <g>
      {mineOptions.map(location => (
        <g
          fill={"none"}
          key={location}
        >
          <MineMarker
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

MineChooser.propTypes = {
  mineOptions: LocationListPropType.isRequired,
  mouseTile: LocationPropType
};

export default MineChooser;