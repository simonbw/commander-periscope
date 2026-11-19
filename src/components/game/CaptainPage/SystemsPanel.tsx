import { List, ListItemButton, ListItemIcon, ListItemText, Paper } from "@mui/material";
import clsx from "clsx";
import type { ReactNode } from "react";
import styles from "../../../../styles/CaptainPage.module.css";
import { DRONE, MINE, SILENT, SONAR, TORPEDO } from "../../../../shared/system";
import type { Location, SystemName } from "../../../../shared/types";
import { MoveIcon, SurfaceIcon } from "../../icons/ActionIcons";
import { DroneIcon, MineIcon, SilentIcon, SonarIcon, TorpedoIcon } from "../../icons/SystemIcons";
import {
  DETONATE_MINE_MODE,
  DRONE_MODE,
  DROP_MINE_MODE,
  type Mode,
  MOVE_MODE,
  PICK_START_LOCATION_MODE,
  SILENT_MODE,
  TORPEDO_MODE,
} from "./ModeWrapper";

interface SystemsPanelProps {
  mines: Location[];
  mode: Mode;
  setMode: (mode: Mode) => void;
  surface: () => void;
  systems: Record<SystemName, boolean>;
  useSonar: () => void;
}

// material-ui beta put a 16px gap between an icon and its ListItemText.
const iconSx = { minWidth: 40 };

const SystemsPanel = (props: SystemsPanelProps) => (
  <Paper className={styles.SystemsPanel}>
    <List>
      <ModeButton
        mode={MOVE_MODE}
        currentMode={props.mode}
        setMode={props.setMode}
        disabled={props.mode === PICK_START_LOCATION_MODE}
      >
        <ListItemIcon sx={iconSx}>
          <MoveIcon />
        </ListItemIcon>
        <ListItemText primary={"Move"} />
      </ModeButton>

      <ModeButton
        mode={TORPEDO_MODE}
        currentMode={props.mode}
        setMode={props.setMode}
        disabled={!props.systems[TORPEDO]}
      >
        <ListItemIcon sx={iconSx}>
          <TorpedoIcon />
        </ListItemIcon>
        <ListItemText primary={"Fire Torpedo"} />
      </ModeButton>

      <ModeButton
        mode={DROP_MINE_MODE}
        currentMode={props.mode}
        setMode={props.setMode}
        disabled={!props.systems[MINE]}
      >
        <ListItemIcon sx={iconSx}>
          <MineIcon />
        </ListItemIcon>
        <ListItemText primary={"Drop Mine"} />
      </ModeButton>

      <ModeButton
        mode={DETONATE_MINE_MODE}
        currentMode={props.mode}
        setMode={props.setMode}
        disabled={props.mines.length === 0}
      >
        <ListItemIcon sx={iconSx}>
          <MineIcon />
        </ListItemIcon>
        <ListItemText primary={"Detonate Mine"} />
      </ModeButton>

      <ModeButton
        mode={DRONE_MODE}
        currentMode={props.mode}
        setMode={props.setMode}
        disabled={!props.systems[DRONE]}
      >
        <ListItemIcon sx={iconSx}>
          <DroneIcon />
        </ListItemIcon>
        <ListItemText primary={"Launch Drone"} />
      </ModeButton>

      <ListItemButton dense disabled={!props.systems[SONAR]} onClick={() => props.useSonar()}>
        <ListItemIcon sx={iconSx}>
          <SonarIcon />
        </ListItemIcon>
        <ListItemText primary={"Use Sonar"} />
      </ListItemButton>

      <ModeButton
        mode={SILENT_MODE}
        currentMode={props.mode}
        setMode={props.setMode}
        disabled={!props.systems[SILENT]}
      >
        <ListItemIcon sx={iconSx}>
          <SilentIcon />
        </ListItemIcon>
        <ListItemText primary={"Go Silent"} />
      </ModeButton>

      <ListItemButton
        dense
        onClick={() => props.surface()}
        disabled={props.mode === PICK_START_LOCATION_MODE}
      >
        <ListItemIcon sx={iconSx}>
          <SurfaceIcon />
        </ListItemIcon>
        <ListItemText primary={"Surface"} />
      </ListItemButton>
    </List>
  </Paper>
);

interface ModeButtonProps {
  children: ReactNode;
  currentMode: Mode;
  disabled?: boolean;
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeButton = ({ mode, currentMode, setMode, disabled, children }: ModeButtonProps) => (
  <ListItemButton
    dense
    disabled={disabled}
    className={clsx(styles.SystemButton, { [styles.active]: mode === currentMode })}
    onClick={() => setMode(mode)}
  >
    {children}
  </ListItemButton>
);

export default SystemsPanel;
