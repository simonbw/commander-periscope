import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { UnconnectedMainMenu } from "../src/components/menu/MainMenu";

const meta = {
  title: "Components/MainMenu",
  component: UnconnectedMainMenu,
  args: {
    createCustomLobby: fn(),
    creatingLobby: false,
    joinCustomLobby: fn(),
  },
  // Call the spy without the click event (logging a SyntheticEvent makes
  // Storybook serialize the window and warn).
  render: ({ createCustomLobby, ...args }) => (
    <UnconnectedMainMenu {...args} createCustomLobby={() => createCustomLobby()} />
  ),
} satisfies Meta<typeof UnconnectedMainMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MainMenu: Story = {};
