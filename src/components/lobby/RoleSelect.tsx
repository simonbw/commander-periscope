import { Divider, List, ListSubheader, Paper } from "@mui/material";
import clsx from "clsx";
import { ALL_ROLES } from "../../../shared/role";
import { getTeamDisplayName, RED } from "../../../shared/team";
import type { LobbySlotView } from "../../../shared/transforms";
import type { Role, Team } from "../../../shared/types";
import styles from "../../../styles/RoleSelect.module.css";
import RoleCard from "./RoleCard";

export interface RoleSelectTeamListProps {
  players: Record<Role, LobbySlotView>;
  /** Called with (null, null) to deselect. */
  selectRole: (role: Role | null, team: Team | null) => void;
  team: Team;
}

export const RoleSelectTeamList = ({ players, selectRole, team }: RoleSelectTeamListProps) => (
  <div className={styles.RoleSelect}>
    <Paper>
      <List>
        <ListSubheader className={clsx(styles.TeamName, team === RED ? styles.red : styles.blue)}>
          <h2>{getTeamDisplayName(team)}</h2>
        </ListSubheader>
        <Divider />

        {ALL_ROLES.filter((role) => players[role]).map((role) => {
          const player = players[role];
          return (
            <RoleCard
              isAvailable={player.isAvailable}
              isReady={player.isReady}
              isUser={player.isUser}
              key={role}
              onSelect={() => selectRole(role, team)}
              onUnSelect={() => selectRole(null, null)}
              role={role}
              team={team}
              username={player.username}
            />
          );
        })}
      </List>
    </Paper>
  </div>
);

export default RoleSelectTeamList;
