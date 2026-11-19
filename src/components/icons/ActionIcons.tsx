import { ArrowBack, ArrowDownward, ArrowForward, ArrowUpward, Forward, Settings } from "@mui/icons-material";
import type { ReactElement } from "react";
import { EAST, NORTH, SOUTH, WEST } from "../../../shared/direction";
import type { Direction } from "../../../shared/types";
import { MineIcon } from "./SystemIcons";

export const DetonateMineIcon = () => <MineIcon />;

export const MoveIcon = () => <Forward htmlColor="#1188BB" />;

export const SurfaceIcon = () => <Settings htmlColor="#1188BB" />;

export function getMoveIcon(direction: Direction): ReactElement {
  switch (direction) {
    case NORTH:
      return <ArrowUpward />;
    case EAST:
      return <ArrowForward />;
    case SOUTH:
      return <ArrowDownward />;
    case WEST:
      return <ArrowBack />;
    default:
      throw new Error(`Invalid direction: ${direction}`);
  }
}
