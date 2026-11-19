import { WATER_TILE } from "../../../shared/grid";
import type { Grid } from "../../../shared/types";

interface GridTilesProps {
  grid: Grid;
}

const GridTiles = ({ grid }: GridTilesProps) => (
  <g>
    <g shapeRendering="crispEdges">
      {grid.flatMap((column, x) =>
        column.map((tile, y) =>
          tile !== WATER_TILE ? (
            <rect key={`${x},${y}`} x={x} y={y} width={1} height={1} fill={"#11AA11"} />
          ) : null,
        ),
      )}
    </g>
    <g shapeRendering="auto">
      {grid.flatMap((column, x) =>
        column.map((tile, y) =>
          tile === WATER_TILE ? (
            <circle key={`${x},${y}`} cx={x + 0.5} cy={y + 0.5} r={0.12} fill={"#11447711"} />
          ) : null,
        ),
      )}
    </g>
  </g>
);

export default GridTiles;
