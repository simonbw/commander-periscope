import PropTypes from 'prop-types';
import React from 'react';
import { LAND_TILE, WATER_TILE } from '../../../../common/Grid';

const COLORS = {
  [WATER_TILE]: '#CCDDFF',
  [LAND_TILE]: '#11AA11'
};

// TODO: This should probably be a PureComponent
const GridTiles = ({ grid }) => (
  <g>
    <g shapeRendering="crispEdges">
      {grid.map((column, x) => column.map((tile, y) => (
        <rect
          key={`${x},${y}`}
          x={x} y={y}
          width={1} height={1}
          fill={COLORS[tile]}
        />
      )))}
    </g>
    <g shapeRendering="auto">
      {grid.map((column, x) => column.map((tile, y) => (
        tile === WATER_TILE && (
          <circle
            key={`${x},${y}`}
            cx={x + 0.5} cy={y + 0.5}
            r={0.12}
            fill={'#11447733'}
          />
        )
      )))}
    </g>
  </g>
);

GridTiles.propTypes = {
  grid: PropTypes.object.isRequired,
};

export default GridTiles;