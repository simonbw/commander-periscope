import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { getGridSize } from '../../../../common/Grid';
import { isValidStartLocation } from '../../../../common/util/GameUtils';
import { GridPropType } from '../../GamePropTypes';
import GridCrosshairs from '../../grid/GridCrosshairs';
import GridLabels from '../../grid/GridLabels';
import GridTileSelect from '../../grid/GridTileSelect';

const StartLocationMode = (props) => {
  const gridSize = getGridSize(props.grid);
  return (
    <GridTileSelect
      onSelect={(tile) => {
        if (isValidStartLocation(tile, props.grid)) {
          props.setStartLocation(tile);
          props.startWaiting();
        }
      }}
      disabled={props.waitingForResponse}
    >
      {(tile) => {
        const isValid = isValidStartLocation(tile, props.grid);
        return (
          <Fragment>
            <GridCrosshairs tile={tile} color={isValid ? '#FFFFFF' : '#AA5555'}/>
            <GridLabels
              height={gridSize.get(0)}
              width={gridSize.get(1)}
              selectedX={tile && tile.get(0)}
              selectedY={tile && tile.get(1)}
            />
          </Fragment>
        );
      }}
    </GridTileSelect>
  );
};

StartLocationMode.propTypes = {
  grid: GridPropType.isRequired,
  setStartLocation: PropTypes.func.isRequired,
  startWaiting: PropTypes.func.isRequired,
  waitingForResponse: PropTypes.bool.isRequired,
};

export default StartLocationMode;