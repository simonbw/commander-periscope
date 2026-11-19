import { includesLocation } from "../../../../shared/grid";
import type { Location } from "../../../../shared/types";
import GridTileSelect from "../../grid/GridTileSelect";
import TorpedoChooser from "../../grid/TorpedoChooser";

interface TorpedoModeProps {
  torpedoOptions: Location[];
  fireTorpedo: (target: Location) => void;
  waitingForResponse: boolean;
}

const TorpedoMode = (props: TorpedoModeProps) => (
  <GridTileSelect
    onSelect={(tile) => {
      if (tile && includesLocation(props.torpedoOptions, tile)) {
        props.fireTorpedo(tile);
      }
    }}
    disabled={props.waitingForResponse}
  >
    {(tile) => <TorpedoChooser mouseTile={tile} torpedoOptions={props.torpedoOptions} />}
  </GridTileSelect>
);

export default TorpedoMode;
