import React from 'react';
import { LocationListPropType } from '../GamePropTypes';
import MineMarker from './MineMarker';

const GridMines = ({ mines }) => {
  return (
    <g>
      {mines.map((location) => (
        <MineMarker location={location} key={location.join(',')}/>
      ))}
    </g>
  );
};

GridMines.propTypes = {
  mines: LocationListPropType.isRequired,
};

export default GridMines;