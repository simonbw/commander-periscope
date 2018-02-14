import classnames from 'classnames';
import React from 'react';
import styles from '../../../../styles/Grid/GridMoveChooser.css'
import { getDirection } from '../../../common/models/Grid';
import { LocationListPropType, LocationPropType } from '../../GamePropTypes';
import DirectionMarker from './DirectionMarker';
import SubMarker from './SubMarker';

// TODO: This should probably be a PureComponent
const GridMoveChooser = ({ subLocation, moveOptions, mouseTile }) => {
  return (
    <g>
      {moveOptions.map(location => {
        const selected = location.equals(mouseTile);
        const direction = getDirection(subLocation, location);
        return (
          <g
            className={classnames(styles.MoveOption, { [styles.selected]: selected })}
            fill={"none"}
            key={location}
          >
            <DirectionMarker
              color={'inherit'}
              direction={direction}
              location={subLocation}
            />
            <SubMarker location={location} color={'inherit'}/>
          </g>
        );
      })}
    </g>
  );
};

GridMoveChooser.propTypes = {
  moveOptions: LocationListPropType.isRequired,
  mouseTile: LocationPropType,
  subLocation: LocationPropType.isRequired,
};

export default GridMoveChooser;