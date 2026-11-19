import type { Location } from "../../../shared/types";

interface SubMarkerProps {
  location: Location;
  color?: string;
}

const SubMarker = ({ location, color = "#000000" }: SubMarkerProps) => (
  <g>
    <circle cx={location[0] + 0.5} cy={location[1] + 0.5} r={0.12} fill={color} stroke={"none"} />
    <circle
      cx={location[0] + 0.5}
      cy={location[1] + 0.5}
      r={0.22}
      fill={"none"}
      stroke={color}
      strokeWidth={0.04}
    />
  </g>
);

export default SubMarker;
