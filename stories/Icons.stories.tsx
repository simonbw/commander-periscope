import { Divider, Paper, Tooltip } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { EAST, NORTH, SOUTH, WEST } from "../shared/direction";
import { DetonateMineIcon, getMoveIcon, MoveIcon, SurfaceIcon } from "../src/components/icons/ActionIcons";
import {
  CaptainAvatar,
  EngineerAvatar,
  FirstMateAvatar,
  RadioOperatorAvatar,
} from "../src/components/icons/RoleAvatars";
import { DroneIcon, MineIcon, SilentIcon, SonarIcon, TorpedoIcon } from "../src/components/icons/SystemIcons";
import { CommsIcon, NuclearIcon, SpecialIcon, WeaponsIcon } from "../src/components/icons/SystemTypeIcons";

const IconRow = ({ children }: { children: ReactNode }) => <div style={{ display: "flex" }}>{children}</div>;

const IconBox = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ padding: 10 }}>
    <Tooltip title={title}>
      <div>{children}</div>
    </Tooltip>
  </div>
);

const AllIcons = () => (
  <Paper style={{ display: "inline-block", margin: 40, padding: 20 }}>
    <IconRow>
      <IconBox title="Comms"><CommsIcon /></IconBox>
      <IconBox title="Nuclear"><NuclearIcon /></IconBox>
      <IconBox title="Special"><SpecialIcon /></IconBox>
      <IconBox title="Weapons"><WeaponsIcon /></IconBox>
    </IconRow>

    <Divider />

    <IconRow>
      <IconBox title="Drone"><DroneIcon /></IconBox>
      <IconBox title="Mine"><MineIcon /></IconBox>
      <IconBox title="Silent"><SilentIcon /></IconBox>
      <IconBox title="Sonar"><SonarIcon /></IconBox>
      <IconBox title="Torpedo"><TorpedoIcon /></IconBox>
    </IconRow>

    <Divider />

    <IconRow>
      <IconBox title="Detonate Mine"><DetonateMineIcon /></IconBox>
      <IconBox title="Move"><MoveIcon /></IconBox>
      <IconBox title="Surface"><SurfaceIcon /></IconBox>
      <IconBox title="North">{getMoveIcon(NORTH)}</IconBox>
      <IconBox title="East">{getMoveIcon(EAST)}</IconBox>
      <IconBox title="South">{getMoveIcon(SOUTH)}</IconBox>
      <IconBox title="West">{getMoveIcon(WEST)}</IconBox>
    </IconRow>

    <Divider />

    <IconRow>
      <IconBox title="Captain"><CaptainAvatar /></IconBox>
      <IconBox title="Engineer"><EngineerAvatar /></IconBox>
      <IconBox title="First Mate"><FirstMateAvatar /></IconBox>
      <IconBox title="Radio Operator"><RadioOperatorAvatar /></IconBox>
    </IconRow>
  </Paper>
);

const meta = {
  title: "Components/Icons",
  component: AllIcons,
} satisfies Meta<typeof AllIcons>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Icons: Story = {};
