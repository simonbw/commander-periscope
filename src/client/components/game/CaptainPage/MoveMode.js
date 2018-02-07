import PropTypes from 'prop-types';
import React from 'react';
import { getDirection } from '../../../../common/Grid';
import { LocationListPropType, LocationPropType } from '../../GamePropTypes';
import GridMoveChooser from '../../grid/GridMoveChooser';
import GridTileSelect from '../../grid/GridTileSelect';

const MovePicker = (props) => (
  <GridTileSelect
    onSelect={(tile) => {
      if (props.moveOptions.includes(tile)) {
        const direction = getDirection(props.subLocation, tile);
        props.headInDirection(direction);
        props.startWaiting();
      }
    }}
    disabled={props.waitingForResponse || props.waitingForPlayers}
  >
    {(tile) => props.waitingForPlayers ? null : (
      <GridMoveChooser
        mouseTile={tile}
        moveOptions={props.moveOptions}
        subLocation={props.subLocation}
      />
    )}
  </GridTileSelect>
);

MovePicker.propTypes = {
  moveOptions: LocationListPropType.isRequired,
  headInDirection: PropTypes.func.isRequired,
  startWaiting: PropTypes.func.isRequired,
  subLocation: LocationPropType.isRequired,
  waitingForPlayers: PropTypes.bool.isRequired,
  waitingForResponse: PropTypes.bool.isRequired,
};

export default MovePicker;