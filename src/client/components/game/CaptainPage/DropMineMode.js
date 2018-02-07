import PropTypes from 'prop-types';
import React from 'react';
import { GridPropType } from '../../GamePropTypes';
import GridTileSelect from '../../grid/GridTileSelect';
import MineChooser from '../../grid/MineChooser';

const MineDropper = (props) => (
  <GridTileSelect
    onSelect={(tile) => {
      if (props.mineOptions.includes(tile)) {
        props.dropMine(tile);
        props.startWaiting();
      }
    }}
    disabled={props.waitingForResponse}
  >
    {(tile) => (
      <MineChooser mouseTile={tile} mineOptions={props.mineOptions}/>
    )}
  </GridTileSelect>
);

MineDropper.propTypes = {
  mineOptions: GridPropType.isRequired,
  dropMine: PropTypes.func.isRequired,
  startWaiting: PropTypes.func.isRequired,
  waitingForResponse: PropTypes.bool.isRequired,
};

export default MineDropper;