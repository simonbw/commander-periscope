import Immutable from 'immutable/dist/immutable';
import React, { Fragment } from 'react';
import { ALL_DIRECTIONS } from '../../../../common/Direction';
import { getNewLocation, WATER_TILE } from '../../../../common/Grid';
import Grid from '../OldGridView';

export default ({ grid, subPath, subLocation, headInDirection, waiting }) => {
  const locationsToDirection = Immutable.Map(
    ALL_DIRECTIONS.map((direction) =>
      [getNewLocation(subLocation, direction), direction]));
  
  const canMoveTo = (location) =>
    !waiting &&
    grid.getIn(location) === WATER_TILE &&
    locationsToDirection.has(location) &&
    !subPath.includes(location);
  
  return (
    <Fragment>
      <Grid
        grid={grid}
        subLocation={subLocation}
        subPath={subPath}
        canClick={(location) => canMoveTo(location)}
        onClick={(location) => canMoveTo(location) && headInDirection(locationsToDirection.get(location))}
      />
    </Fragment>
  );
};