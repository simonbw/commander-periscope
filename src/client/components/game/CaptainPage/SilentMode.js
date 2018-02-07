import PropTypes from 'prop-types';
import React from 'react';
import { LocationListPropType, LocationPropType } from '../../GamePropTypes';
import GridMoveChooser from '../../grid/GridMoveChooser';
import GridTileSelect from '../../grid/GridTileSelect';

const SilentMode = (props) => (
  <GridTileSelect
    onSelect={(tile) => {
      if (props.moveOptions.includes(tile)) {
        props.goSilent(tile);
        props.startWaiting();
      }
    }}
    disabled={props.waitingForResponse}
  >
    {(tile) => (
      <GridMoveChooser
        mouseTile={tile}
        moveOptions={props.moveOptions}
        subLocation={props.subLocation}
      />
    )}
  </GridTileSelect>
);

SilentMode.propTypes = {
  goSilent: PropTypes.func.isRequired,
  moveOptions: LocationListPropType.isRequired,
  startWaiting: PropTypes.func.isRequired,
  subLocation: LocationPropType.isRequired,
  waitingForResponse: PropTypes.bool.isRequired,
};

export default SilentMode;