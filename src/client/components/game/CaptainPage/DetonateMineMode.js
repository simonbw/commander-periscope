import PropTypes from 'prop-types';
import React from 'react';
import { LocationListPropType } from '../../GamePropTypes';
import GridCrosshairs from '../../grid/GridCrosshairs';
import GridTileSelect from '../../grid/GridTileSelect';

const DetonateMineMode = (props) => (
  <GridTileSelect
    onSelect={(tile) => {
      if (props.mines.includes(tile)) {
        props.detonateMine(tile);
        props.startWaiting();
      }
    }}
    disabled={props.waitingForResponse}
  >
    {(tile) => (
      <GridCrosshairs tile={tile} color={props.mines.includes(tile) ? '#FFFFFF' : '#AA5555'}/>
    )}
  </GridTileSelect>
);

DetonateMineMode.propTypes = {
  mines: LocationListPropType.isRequired,
  detonateMine: PropTypes.func.isRequired,
  startWaiting: PropTypes.func.isRequired,
  waitingForResponse: PropTypes.bool.isRequired,
};

export default DetonateMineMode;