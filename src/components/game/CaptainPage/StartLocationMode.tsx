import { getGridSize } from "../../../../shared/grid";
import { isValidStartLocation } from "../../../../shared/gameUtils";
import type { Grid, Location } from "../../../../shared/types";
import GridCrosshairs from "../../grid/GridCrosshairs";
import GridLabels from "../../grid/GridLabels";
import GridTileSelect from "../../grid/GridTileSelect";

interface StartLocationModeProps {
  grid: Grid;
  setStartLocation: (location: Location) => void;
  waitingForResponse: boolean;
}

const StartLocationMode = (props: StartLocationModeProps) => {
  const gridSize = getGridSize(props.grid);
  return (
    <GridTileSelect
      onSelect={(tile) => {
        if (tile && isValidStartLocation(tile, props.grid)) {
          props.setStartLocation(tile);
        }
      }}
      disabled={props.waitingForResponse}
    >
      {(tile) => {
        const isValid = isValidStartLocation(tile, props.grid);
        return (
          <>
            <GridCrosshairs tile={tile} color={isValid ? "#FFFFFF" : "#AA5555"} />
            <GridLabels
              height={gridSize[0]}
              width={gridSize[1]}
              selectedX={tile && tile[0]}
              selectedY={tile && tile[1]}
            />
          </>
        );
      }}
    </GridTileSelect>
  );
};

export default StartLocationMode;
