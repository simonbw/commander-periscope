import type { Meta, StoryObj } from "@storybook/react-vite";
import { FIRST_MATE } from "../shared/role";
import { UnconnectedDebugPane } from "../src/components/DebugPane";
import { mockPlayerView } from "./mocks";

const meta = {
  title: "Components/DebugPane",
  component: UnconnectedDebugPane,
  args: {
    data: {
      ...mockPlayerView(FIRST_MATE),
      randomPropertyWithALongName:
        "a value for a property with a long name that is even longer than the property name",
    },
  },
} satisfies Meta<typeof UnconnectedDebugPane>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DebugPane: Story = {};
