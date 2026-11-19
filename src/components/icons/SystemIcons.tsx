import { AirplanemodeActive, GpsFixed, SignalWifi4Bar, VolumeOff } from "@mui/icons-material";
import { SvgIcon } from "@mui/material";
import type { ReactElement } from "react";
import { DRONE, MINE, SILENT, SONAR, TORPEDO } from "../../../shared/system";
import type { SystemName } from "../../../shared/types";

export const DroneIcon = () => <AirplanemodeActive htmlColor="#00CC00" />;

// Same drawing as grid/MineMarker at location [0, 0]; inlined so the icon
// doesn't depend on the grid components.
const MINE_COLOR = "#CC0000";
export const MineIcon = () => (
  <SvgIcon viewBox="0.20 0.20 0.6 0.6">
    <g transform="translate(0.5,0.5)">
      <circle fill={MINE_COLOR} r={0.16} stroke="none" />
      {[0, 45, 90, 135].map((angle) => (
        <line
          key={angle}
          x1={-0.25}
          y1={0}
          x2={0.25}
          y2={0}
          stroke={MINE_COLOR}
          strokeWidth={0.05}
          strokeLinecap="round"
          transform={`rotate(${angle})`}
        />
      ))}
    </g>
  </SvgIcon>
);

export const SilentIcon = () => <VolumeOff htmlColor="#00DDFF" />;

export const SonarIcon = () => <SignalWifi4Bar htmlColor="#00CC00" />;

export const TorpedoIcon = () => <GpsFixed htmlColor="#FF0000" />;

export function getIconForSystem(system: SystemName): ReactElement {
  switch (system) {
    case DRONE:
      return <DroneIcon />;
    case MINE:
      return <MineIcon />;
    case SONAR:
      return <SonarIcon />;
    case SILENT:
      return <SilentIcon />;
    case TORPEDO:
      return <TorpedoIcon />;
    default:
      throw new Error(`Invalid system: ${system}`);
  }
}
