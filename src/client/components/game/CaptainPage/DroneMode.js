import PropTypes from 'prop-types';
import React from 'react';
import GridSectors from '../../grid/GridSectors';
import GridSectorSelect from '../../grid/GridSectorSelect';

const DronePicker = (props) => {
  return (
    <GridSectorSelect
      onSelect={(sector) => {
        props.useDrone(sector);
        props.startWaiting();
      }}
      disabled={props.waitingForResponse}
    >
      {(sector) => (
        <GridSectors selected={sector}/>
      )}
    </GridSectorSelect>
  );
};

DronePicker.propTypes = {
  useDrone: PropTypes.func.isRequired,
  startWaiting: PropTypes.func.isRequired,
  waitingForResponse: PropTypes.bool.isRequired,
};

export default DronePicker;