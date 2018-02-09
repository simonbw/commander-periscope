import React from 'react';
import { WATER_TILE } from '../../../common/models/Grid';
import { GridPropType } from '../GamePropTypes';

// TODO: This should probably be a PureComponent
const GridTiles = ({ grid }) => (
  <g>
    <g shapeRendering="crispEdges">
      {grid.map((column, x) => column.toKeyedSeq()
        .filter(tile => tile !== WATER_TILE)
        .map((tile, y) => (
          <rect
            key={`${x},${y}`}
            x={x} y={y}
            width={1} height={1}
            fill={"#11AA11"}
          />
        )).valueSeq())}
    </g>
    <g shapeRendering="auto">
      {grid.map((column, x) => column.map((tile, y) => (
        tile === WATER_TILE && (
          <circle
            key={`${x},${y}`}
            cx={x + 0.5} cy={y + 0.5}
            r={0.12}
            fill={'#11447711'}
          />
        )
      )))}
    </g>
  </g>
);

GridTiles.propTypes = {
  grid: GridPropType.isRequired,
};

export default GridTiles;