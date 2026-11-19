import { directionToAngle } from "../../../shared/direction";
import type { Direction, Location } from "../../../shared/types";

interface DirectionMarkerProps {
  location: Location;
  direction: Direction;
  color?: string;
}

const DirectionMarker = ({ location, direction, color = "#000000" }: DirectionMarkerProps) => (
  <polyline
    fill="none"
    points="-0.15,-0.35 0,-0.6 0.15,-0.35"
    stroke={color}
    strokeLinecap="round"
    strokeWidth={0.08}
    transform={`translate(${location.map((x) => x + 0.5).join(",")}) rotate(${directionToAngle(direction)})`}
  />
);

export default DirectionMarker;
