import type { ReactNode } from "react";
import { getGridSize, tileToSector } from "../../../shared/grid";
import GridMouseLocationProvider from "./GridMouseLocationProvider";

interface GridSectorSelectProps {
  children: (sector: number | null) => ReactNode;
  disabled?: boolean;
  onSelect?: (sector: number | null) => void;
}

// TODO: Don't rerender children when sector doesn't change
// TODO: Figure out how to make multiple of these possible
const GridSectorSelect = ({ children, disabled, onSelect }: GridSectorSelectProps) => (
  <GridMouseLocationProvider
    onClick={
      disabled || !onSelect
        ? undefined
        : (mouseLocation) => onSelect(tileToSector(mouseLocation, getGridSize())) /*TODO: Real grid size*/
    }
  >
    {(mouseLocation) => children(disabled ? null : tileToSector(mouseLocation, getGridSize())) /*TODO: Real grid size*/}
  </GridMouseLocationProvider>
);

export default GridSectorSelect;
