import { locEq } from "../../../shared/grid";
import type { Location } from "../../../shared/types";
import MineMarker from "./MineMarker";

interface MineChooserProps {
  mineOptions: Location[];
  mouseTile?: Location | null;
}

const MineChooser = ({ mineOptions, mouseTile }: MineChooserProps) => (
  <g>
    {mineOptions.map((location) => {
      const opacity = locEq(location, mouseTile ?? null) ? 1 : 0.2;
      return (
        <g fill={"none"} key={location.join(",")}>
          <MineMarker color={"#FF0000"} fillOpacity={opacity} strokeOpacity={opacity} location={location} />
        </g>
      );
    })}
  </g>
);

export default MineChooser;
