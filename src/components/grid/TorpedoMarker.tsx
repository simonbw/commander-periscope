import type { SVGAttributes } from "react";
import type { Location } from "../../../shared/types";

interface TorpedoMarkerProps extends SVGAttributes<SVGGElement> {
  location: Location;
  color?: string;
}

const TorpedoMarker = ({ location, color = "#CC0000", ...otherProps }: TorpedoMarkerProps) => (
  <g transform={`translate(${location[0] + 0.5},${location[1] + 0.5})`} {...otherProps}>
    {[0, 90].map((angle) => (
      <line
        key={angle}
        x1={-0.25}
        y1={0}
        x2={0.25}
        y2={0}
        stroke={color}
        strokeWidth={0.05}
        strokeLinecap="round"
        transform={`rotate(${angle})`}
      />
    ))}
    <circle fill="none" r={0.25} stroke={color} strokeWidth={0.05} />
  </g>
);

export default TorpedoMarker;
