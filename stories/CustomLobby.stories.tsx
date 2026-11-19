import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { mockLobby } from "../shared/testMocks";
import { transformLobbyForPlayer } from "../shared/transforms";
import { UnconnectedCustomLobbyPage } from "../src/components/lobby/CustomLobbyPage";
import { LobbyProvider } from "../src/components/lobby/LobbyContext";

// A full lobby as seen by p3 (red radio operator).
const lobby = transformLobbyForPlayer(mockLobby(), "p3");

const meta = {
  title: "Components/CustomLobby",
  component: UnconnectedCustomLobbyPage,
  // UsernameInput and ReadyButton are connected components that read the lobby
  // from context (their mutations go to the dummy Convex client and fail).
  decorators: [
    (Story) => (
      <LobbyProvider lobby={lobby}>
        <Story />
      </LobbyProvider>
    ),
  ],
  args: {
    goToMainMenu: fn(),
    lobbyCode: lobby.code,
    selectRole: fn(),
    teams: lobby.teams,
  },
  // Call the spy without the click event (logging a SyntheticEvent makes
  // Storybook serialize the window and warn).
  render: ({ goToMainMenu, ...args }) => (
    <UnconnectedCustomLobbyPage {...args} goToMainMenu={() => goToMainMenu()} />
  ),
} satisfies Meta<typeof UnconnectedCustomLobbyPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CustomLobby: Story = {};
