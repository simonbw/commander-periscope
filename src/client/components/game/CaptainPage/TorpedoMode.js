import PropTypes from 'prop-types';
import React from 'react';
import { LocationListPropType } from '../../../GamePropTypes';
import GridTileSelect from '../../grid/GridTileSelect';
import TorpedoChooser from '../../grid/TorpedoChooser';

const TorpedoMode = (props) => (
  <GridTileSelect
    onSelect={(tile) => {
      if (props.torpedoOptions.includes(tile)) {
        props.fireTorpedo(tile);
        props.startWaiting();
      }
    }}
    disabled={props.waitingForResponse}
  >
    {(tile) => (
      <TorpedoChooser mouseTile={tile} torpedoOptions={props.torpedoOptions}/>
    )}
  </GridTileSelect>
);

TorpedoMode.propTypes = {
  torpedoOptions: LocationListPropType.isRequired,
  fireTorpedo: PropTypes.func.isRequired,
  startWaiting: PropTypes.func.isRequired,
  waitingForResponse: PropTypes.bool.isRequired,
};

export default TorpedoMode;