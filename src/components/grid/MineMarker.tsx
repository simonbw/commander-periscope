import type { SVGAttributes } from "react";
import type { Location } from "../../../shared/types";

interface MineMarkerProps extends SVGAttributes<SVGGElement> {
  location: Location;
  color?: string;
}

const MineMarker = ({ location, color = "#CC0000", ...otherProps }: MineMarkerProps) => (
  <g transform={`translate(${location[0] + 0.5},${location[1] + 0.5})`} {...otherProps}>
    <circle fill={color} r={0.16} stroke="none" />
    {[0, 45, 90, 135].map((angle) => (
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
  </g>
);

export default MineMarker;
