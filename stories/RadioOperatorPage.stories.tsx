import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { RADIO_OPERATOR } from "../shared/role";
import type { Notification } from "../shared/types";
import { UnconnectedRadioOperatorPage } from "../src/components/game/RadioOperatorPage";
import { mockNotification, mockPlayerView } from "./mocks";

const MAX_NOTIFICATIONS = 20;

/** The radio operator page with a random notification arriving every `interval` ms. */
const RadioOperatorSimulator = ({ interval }: { interval: number }) => {
  const [view] = useState(() => mockPlayerView(RADIO_OPERATOR));
  const [notifications, setNotifications] = useState<Notification[]>(view.notifications ?? []);
  useEffect(() => {
    const id = setInterval(
      () => setNotifications((current) => [mockNotification(), ...current].slice(0, MAX_NOTIFICATIONS)),
      interval,
    );
    return () => clearInterval(id);
  }, [interval]);
  return <UnconnectedRadioOperatorPage grid={view.grid ?? []} notifications={notifications} team={view.team} />;
};

const meta = {
  title: "Components/RadioOperatorPage",
  component: RadioOperatorSimulator,
  args: { interval: 1500 },
} satisfies Meta<typeof RadioOperatorSimulator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RadioOperatorAdding: Story = {
  name: "RadioOperator Adding",
};
