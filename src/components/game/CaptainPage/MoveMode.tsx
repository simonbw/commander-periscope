import { getDirection, includesLocation } from "../../../../shared/grid";
import type { Direction, Location } from "../../../../shared/types";
import GridMoveChooser from "../../grid/GridMoveChooser";
import GridTileSelect from "../../grid/GridTileSelect";

interface MoveModeProps {
  moveOptions: Location[];
  headInDirection: (direction: Direction) => void;
  subLocation: Location;
  waitingForPlayers: boolean;
  waitingForResponse: boolean;
}

const MovePicker = (props: MoveModeProps) => (
  <GridTileSelect
    onSelect={(tile) => {
      if (tile && includesLocation(props.moveOptions, tile)) {
        const direction = getDirection(props.subLocation, tile);
        if (direction) {
          props.headInDirection(direction);
        }
      }
    }}
    disabled={props.waitingForResponse || props.waitingForPlayers}
  >
    {(tile) =>
      props.waitingForPlayers ? null : (
        <GridMoveChooser mouseTile={tile} moveOptions={props.moveOptions} subLocation={props.subLocation} />
      )
    }
  </GridTileSelect>
);

export default MovePicker;
