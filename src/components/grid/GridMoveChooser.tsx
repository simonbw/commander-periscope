import clsx from "clsx";
import styles from "../../../styles/Grid/GridMoveChooser.module.css";
import { getDirection, locEq } from "../../../shared/grid";
import type { Location } from "../../../shared/types";
import DirectionMarker from "./DirectionMarker";
import SubMarker from "./SubMarker";

interface GridMoveChooserProps {
  moveOptions: Location[];
  mouseTile?: Location | null;
  subLocation: Location;
}

const GridMoveChooser = ({ subLocation, moveOptions, mouseTile }: GridMoveChooserProps) => (
  <g>
    {moveOptions.map((location) => {
      const selected = locEq(location, mouseTile ?? null);
      const direction = getDirection(subLocation, location);
      return (
        <g
          className={clsx(styles.MoveOption, { [styles.selected]: selected })}
          fill={"none"}
          key={location.join(",")}
        >
          {direction && <DirectionMarker color={"inherit"} direction={direction} location={subLocation} />}
          <SubMarker location={location} color={"inherit"} />
        </g>
      );
    })}
  </g>
);

export default GridMoveChooser;
