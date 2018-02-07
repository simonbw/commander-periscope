import PropTypes from 'prop-types';
import React from 'react';
import { getGridSize } from '../../../../common/Grid';
import { GridPropType, LocationListPropType, LocationPropType } from '../../GamePropTypes';
import GridBackground from '../../grid/GridBackground';
import GridContainer from '../../grid/GridContainer';
import GridLabels from '../../grid/GridLabels';
import GridMines from '../../grid/GridMines';
import GridPath from '../../grid/GridPath';
import GridSectors from '../../grid/GridSectors';
import GridTiles from '../../grid/GridTiles';
import SubMarker from '../../grid/SubMarker';
import { DRONE_MODE, PICK_START_LOCATION_MODE } from './ModeWrapper';

const CaptainGridContainer = (props) => {
  const gridSize = getGridSize(props.grid);
  return (
    <GridContainer>
      <GridBackground height={gridSize.get(0)} width={gridSize.get(1)}/>
      {props.mode !== DRONE_MODE && <GridSectors/>}
      <GridTiles grid={props.grid}/>
      {props.mode !== PICK_START_LOCATION_MODE && <GridLabels height={15} width={15}/>}
      <GridPath path={props.subLocation ? props.path.push(props.subLocation) : props.path}/>
      <GridMines mines={props.mines}/>
      {props.subLocation && <SubMarker location={props.subLocation}/>}
      
      {props.children}
    </GridContainer>
  );
};

CaptainGridContainer.propTypes = {
  children: PropTypes.node,
  grid: GridPropType.isRequired,
  mines: LocationListPropType.isRequired,
  mode: PropTypes.string.isRequired,
  path: LocationListPropType.isRequired,
  subLocation: LocationPropType,
};

export default CaptainGridContainer;