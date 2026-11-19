import { getDirection } from "../../../shared/grid";
import type { Location } from "../../../shared/types";
import DirectionMarker from "./DirectionMarker";

interface GridPathProps {
  path: Location[];
  showDirection?: boolean;
}

const GridPath = ({ path, showDirection = true }: GridPathProps) => {
  if (path.length === 0) {
    return null;
  }
  const color = "#000000";
  return (
    <g>
      <polyline
        fill="none"
        points={path.map((p) => p.map((x) => x + 0.5).join(",")).join(" ")}
        stroke={color}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth={0.08}
      />
      {showDirection &&
        path.slice(0, -1).map((location, i) => {
          const direction = getDirection(location, path[i + 1]);
          return direction && <DirectionMarker key={i} direction={direction} location={location} />;
        })}
    </g>
  );
};

export default GridPath;
