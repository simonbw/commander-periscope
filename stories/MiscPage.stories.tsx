import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import GameOverPage from "../src/components/game/GameOverPage";
import SurfacedPage from "../src/components/game/SurfacedPage";
import LoadingPage from "../src/components/LoadingPage";

const meta = {
  title: "Components/Misc Pages",
  component: GameOverPage,
  args: {
    goToMainMenu: fn(),
    isWinner: true,
  },
  // Call the spy without the click event (logging a SyntheticEvent makes
  // Storybook serialize the window and warn).
  render: ({ goToMainMenu, ...args }) => <GameOverPage {...args} goToMainMenu={() => goToMainMenu()} />,
} satisfies Meta<typeof GameOverPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  name: "LoadingPage",
  render: () => <LoadingPage />,
};

export const Surfaced: Story = {
  name: "SurfacedPage",
  render: () => <SurfacedPage />,
};

export const WinPage: Story = {
  name: "WinPage",
  args: { isWinner: true },
};

export const LosePage: Story = {
  name: "LosePage",
  args: { isWinner: false },
};
