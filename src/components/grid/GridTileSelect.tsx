import type { ReactNode } from "react";
import type { Location } from "../../../shared/types";
import GridMouseLocationProvider, { type MousePosition } from "./GridMouseLocationProvider";

interface GridTileSelectProps {
  children: (tile: Location | null) => ReactNode;
  disabled?: boolean;
  onSelect?: (tile: Location | null) => void;
}

// TODO: Don't rerender children when tile doesn't change
// TODO: Figure out how to make multiple of these possible
const GridTileSelect = ({ children, disabled, onSelect }: GridTileSelectProps) => {
  const getTile = (mouseLocation: MousePosition | null): Location | null => {
    if (disabled || !mouseLocation) {
      return null;
    }
    const tile: Location = [Math.floor(mouseLocation[0]), Math.floor(mouseLocation[1])];
    if (tile.some((c) => c < 0 || c >= 15)) {
      return null;
    }
    return tile;
  };

  return (
    <GridMouseLocationProvider
      onClick={disabled || !onSelect ? undefined : (mouseLocation) => onSelect(getTile(mouseLocation))}
    >
      {(mouseLocation) => children(getTile(mouseLocation))}
    </GridMouseLocationProvider>
  );
};

export default GridTileSelect;
