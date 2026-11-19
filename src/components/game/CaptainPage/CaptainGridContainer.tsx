import type { ReactNode } from "react";
import { getGridSize } from "../../../../shared/grid";
import type { Grid, Location } from "../../../../shared/types";
import GridBackground from "../../grid/GridBackground";
import GridContainer from "../../grid/GridContainer";
import GridLabels from "../../grid/GridLabels";
import GridMines from "../../grid/GridMines";
import GridPath from "../../grid/GridPath";
import GridSectors from "../../grid/GridSectors";
import GridTiles from "../../grid/GridTiles";
import SubMarker from "../../grid/SubMarker";
import { DRONE_MODE, type Mode, PICK_START_LOCATION_MODE } from "./ModeWrapper";

interface CaptainGridContainerProps {
  children?: ReactNode;
  grid: Grid;
  mines: Location[];
  mode: Mode;
  path: Location[];
  subLocation?: Location | null;
}

const CaptainGridContainer = (props: CaptainGridContainerProps) => {
  const gridSize = getGridSize(props.grid);
  return (
    <GridContainer>
      <GridBackground height={gridSize[0]} width={gridSize[1]} />
      {props.mode !== DRONE_MODE && <GridSectors />}
      <GridTiles grid={props.grid} />
      {props.mode !== PICK_START_LOCATION_MODE && <GridLabels height={15} width={15} />}
      <GridPath path={props.subLocation ? [...props.path, props.subLocation] : props.path} />
      <GridMines mines={props.mines} />
      {props.subLocation && <SubMarker location={props.subLocation} />}

      {props.children}
    </GridContainer>
  );
};

export default CaptainGridContainer;
