import { includesLocation } from "../../../../shared/grid";
import type { Location } from "../../../../shared/types";
import GridCrosshairs from "../../grid/GridCrosshairs";
import GridTileSelect from "../../grid/GridTileSelect";

interface DetonateMineModeProps {
  mines: Location[];
  detonateMine: (location: Location) => void;
  waitingForResponse: boolean;
}

const DetonateMineMode = (props: DetonateMineModeProps) => (
  <GridTileSelect
    onSelect={(tile) => {
      if (tile && includesLocation(props.mines, tile)) {
        props.detonateMine(tile);
      }
    }}
    disabled={props.waitingForResponse}
  >
    {(tile) => (
      <GridCrosshairs tile={tile} color={tile && includesLocation(props.mines, tile) ? "#FFFFFF" : "#AA5555"} />
    )}
  </GridTileSelect>
);

export default DetonateMineMode;
