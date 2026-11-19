import { includesLocation } from "../../../../shared/grid";
import type { Location } from "../../../../shared/types";
import GridMoveChooser from "../../grid/GridMoveChooser";
import GridTileSelect from "../../grid/GridTileSelect";

interface SilentModeProps {
  goSilent: (destination: Location) => void;
  moveOptions: Location[];
  subLocation: Location;
  waitingForResponse: boolean;
}

const SilentMode = (props: SilentModeProps) => (
  <GridTileSelect
    onSelect={(tile) => {
      if (tile && includesLocation(props.moveOptions, tile)) {
        props.goSilent(tile);
      }
    }}
    disabled={props.waitingForResponse}
  >
    {(tile) => (
      <GridMoveChooser mouseTile={tile} moveOptions={props.moveOptions} subLocation={props.subLocation} />
    )}
  </GridTileSelect>
);

export default SilentMode;
