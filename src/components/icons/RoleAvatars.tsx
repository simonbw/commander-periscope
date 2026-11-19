import { Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { ReactElement } from "react";
import { CAPTAIN, ENGINEER, FIRST_MATE, RADIO_OPERATOR } from "../../../shared/role";
import type { Role } from "../../../shared/types";

const RoleAvatar = styled(Avatar)({
  fontFamily: "sans-serif",
});

export const CaptainAvatar = () => <RoleAvatar>C</RoleAvatar>;

export const FirstMateAvatar = () => <RoleAvatar>FM</RoleAvatar>;

export const EngineerAvatar = () => <RoleAvatar>E</RoleAvatar>;

export const RadioOperatorAvatar = () => <RoleAvatar>RO</RoleAvatar>;

export const getAvatarForRole = (role: Role): ReactElement => {
  switch (role) {
    case CAPTAIN:
      return <CaptainAvatar />;
    case FIRST_MATE:
      return <FirstMateAvatar />;
    case RADIO_OPERATOR:
      return <RadioOperatorAvatar />;
    case ENGINEER:
      return <EngineerAvatar />;
  }
  throw new Error(`Invalid role: ${role}`);
};
