import { locEq } from "../../../shared/grid";
import type { Location } from "../../../shared/types";
import TorpedoMarker from "./TorpedoMarker";

interface TorpedoChooserProps {
  torpedoOptions: Location[];
  mouseTile?: Location | null;
}

const TorpedoChooser = ({ torpedoOptions, mouseTile }: TorpedoChooserProps) => (
  <g>
    {torpedoOptions.map((location) => {
      const opacity = locEq(location, mouseTile ?? null) ? 1 : 0.2;
      return (
        <g fill={"none"} key={location.join(",")}>
          <TorpedoMarker color={"#FF0000"} fillOpacity={opacity} strokeOpacity={opacity} location={location} />
        </g>
      );
    })}
  </g>
);

export default TorpedoChooser;
