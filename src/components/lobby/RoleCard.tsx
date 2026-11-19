import { Clear, Done } from "@mui/icons-material";
import { IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemText, Tooltip } from "@mui/material";
import clsx from "clsx";
import { getRoleDisplayName } from "../../../shared/role";
import type { Role, Team } from "../../../shared/types";
import styles from "../../../styles/RoleSelect.module.css";
import { getAvatarForRole } from "../icons/RoleAvatars";

export interface RoleCardProps {
  isAvailable: boolean;
  isReady: boolean;
  isUser: boolean;
  onSelect: () => void;
  onUnSelect: () => void;
  role: Role;
  team: Team;
  username?: string;
}

const RoleCard = ({ isAvailable, isReady, isUser, onSelect, onUnSelect, role, team, username }: RoleCardProps) => {
  const isOther = !isAvailable && !isUser;

  const content = (
    <>
      <ListItemAvatar>{getAvatarForRole(role)}</ListItemAvatar>
      <ListItemText
        primary={getRoleDisplayName(role)}
        secondary={
          <span className={isAvailable ? styles.Available : styles.Username}>
            {isAvailable ? "Available" : username}
          </span>
        }
      />
    </>
  );

  return (
    <ListItem
      className={clsx(styles.RoleCard, {
        [styles.isOther]: isOther,
        [styles.isReady]: isReady,
        [styles.isUser]: isUser,
      })}
      disablePadding={!isOther}
      id={`${team}-${role}`}
      secondaryAction={
        <>
          {isUser && (
            <Tooltip enterDelay={300} title="Deselect Role">
              <IconButton onClick={onUnSelect}>
                <Clear />
              </IconButton>
            </Tooltip>
          )}
          {!isUser && isReady && (
            <IconButton style={{ cursor: "default", color: "#00CC00" }} disableRipple>
              <Tooltip enterDelay={300} title="User is Ready">
                <Done />
              </Tooltip>
            </IconButton>
          )}
        </>
      }
    >
      {isOther ? (
        content
      ) : (
        <ListItemButton
          onClick={() => {
            if (isAvailable && !isUser) {
              onSelect();
            }
          }}
        >
          {content}
        </ListItemButton>
      )}
    </ListItem>
  );
};

export default RoleCard;
