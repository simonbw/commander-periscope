import type { Location } from "../../../shared/types";
import MineMarker from "./MineMarker";

interface GridMinesProps {
  mines: Location[];
}

const GridMines = ({ mines }: GridMinesProps) => (
  <g>
    {mines.map((location) => (
      <MineMarker location={location} key={location.join(",")} />
    ))}
  </g>
);

export default GridMines;
