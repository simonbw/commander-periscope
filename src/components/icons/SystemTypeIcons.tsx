import { Clear, GpsFixed, RssFeed, VolumeOff } from "@mui/icons-material";
import { SvgIcon } from "@mui/material";
import type { ReactElement } from "react";
import { COMMS, NUCLEAR, SPECIAL, WEAPONS } from "../../../shared/system";
import type { SystemType } from "../../../shared/types";

export const CommsIcon = () => <RssFeed htmlColor="#00CC00" />;

export const SpecialIcon = () => <VolumeOff htmlColor="#00DDFF" />;

export const WeaponsIcon = () => <GpsFixed htmlColor="#FF0000" />;

export const NuclearIcon = () => (
  <SvgIcon viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="9" fill="#000000" />
    <circle
      cx="50"
      cy="50"
      r="30"
      fill="none"
      stroke="#000000"
      strokeWidth="32"
      strokeDasharray="31.41592, 31.41592" /* (pi / 3 * 30) */
    />
  </SvgIcon>
);

function getColorForSystemType(systemType: SystemType): string {
  switch (systemType) {
    case WEAPONS:
      return "#FF0000";
    case COMMS:
      return "#00CC00";
    case SPECIAL:
      return "#00DDFF";
    case NUCLEAR:
      return "#000000";
    default:
      throw Error(`Unrecognized system type: ${systemType}`);
  }
}

export function getIconForSystemType(systemType: SystemType, broken = false): ReactElement {
  if (broken) {
    return <Clear htmlColor={getColorForSystemType(systemType)} />;
  }
  switch (systemType) {
    case WEAPONS:
      return <WeaponsIcon />;
    case COMMS:
      return <CommsIcon />;
    case SPECIAL:
      return <SpecialIcon />;
    case NUCLEAR:
      return <NuclearIcon />;
    default:
      throw Error(`Unrecognized system type: ${systemType}`);
  }
}
