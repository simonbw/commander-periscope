import { includesLocation } from "../../../../shared/grid";
import type { Location } from "../../../../shared/types";
import GridTileSelect from "../../grid/GridTileSelect";
import MineChooser from "../../grid/MineChooser";

interface DropMineModeProps {
  mineOptions: Location[];
  dropMine: (location: Location) => void;
  waitingForResponse: boolean;
}

const MineDropper = (props: DropMineModeProps) => (
  <GridTileSelect
    onSelect={(tile) => {
      if (tile && includesLocation(props.mineOptions, tile)) {
        props.dropMine(tile);
      }
    }}
    disabled={props.waitingForResponse}
  >
    {(tile) => <MineChooser mouseTile={tile} mineOptions={props.mineOptions} />}
  </GridTileSelect>
);

export default MineDropper;
