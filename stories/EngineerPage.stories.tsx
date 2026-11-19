import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import { fn } from "storybook/test";
import { ALL_DIRECTIONS } from "../shared/direction";
import { fixCircuits } from "../shared/gameUtils";
import { ENGINEER } from "../shared/role";
import type { Direction } from "../shared/types";
import { UnconnectedEngineerPage } from "../src/components/game/EngineerPage";
import { mockPlayerView } from "./mocks";

const randomDirection = (): Direction => ALL_DIRECTIONS[Math.floor(Math.random() * ALL_DIRECTIONS.length)];

/**
 * The engineer page against a fake server: tracking a breakdown records it
 * (fixing any completed circuit), then the captain "moves" again in a random
 * direction 1.5s later.
 */
const EngineerSimulator = ({ trackBreakdown }: { trackBreakdown: (breakdownIndex: number) => void }) => {
  const [subsystems] = useState(() => mockPlayerView(ENGINEER).subsystems ?? []);
  const [breakdowns, setBreakdowns] = useState<number[]>([]);
  const [waitingForEngineer, setWaitingForEngineer] = useState(true);
  const [lastDirectionMoved, setLastDirectionMoved] = useState(randomDirection);

  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timeout.current), []);

  return (
    <UnconnectedEngineerPage
      breakdowns={breakdowns}
      directionMoved={lastDirectionMoved}
      readyToTrack={waitingForEngineer}
      subsystems={subsystems}
      trackBreakdown={(breakdownIndex) => {
        trackBreakdown(breakdownIndex);
        setWaitingForEngineer(false);
        setBreakdowns((current) =>
          current.includes(breakdownIndex) ? current : fixCircuits(subsystems, [...current, breakdownIndex]),
        );
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          setWaitingForEngineer(true);
          setLastDirectionMoved(randomDirection());
        }, 1500);
      }}
    />
  );
};

const meta = {
  title: "Components/EngineerPage",
  component: EngineerSimulator,
  args: { trackBreakdown: fn() },
} satisfies Meta<typeof EngineerSimulator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EngineerPage: Story = {};
