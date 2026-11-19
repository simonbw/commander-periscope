import { FormControl, FormLabel, Paper, Switch } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { UnconnectedConnectionWarner } from "../src/components/ConnectionWarner";

/** The warner plus a switch to fake the connection dropping. */
const ConnectionWarnerDemo = ({ initiallyConnected }: { initiallyConnected: boolean }) => {
  const [connected, setConnected] = useState(initiallyConnected);
  return (
    <>
      <Paper style={{ display: "inline-block", margin: "20px", padding: "10px" }}>
        <FormControl>
          <FormLabel>Connection</FormLabel>
          <Switch checked={connected} onChange={() => setConnected(!connected)} />
        </FormControl>
      </Paper>
      <UnconnectedConnectionWarner connected={connected} />
    </>
  );
};

const meta = {
  title: "Components/ConnectionWarner",
  component: ConnectionWarnerDemo,
  args: { initiallyConnected: true },
} satisfies Meta<typeof ConnectionWarnerDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ConnectionWarner: Story = {};
