import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import { fn } from "storybook/test";
import { FIRST_MATE } from "../shared/role";
import type { SystemCharge, SystemName } from "../shared/types";
import { UnconnectedDebugPane } from "../src/components/DebugPane";
import { UnconnectedFirstMatePage } from "../src/components/game/FirstMatePage";
import { mockPlayerView } from "./mocks";

interface FirstMateSimulatorProps {
  chargeSystem: (systemName: SystemName) => void;
  skipCharging: () => void;
}

/**
 * The first mate page against a fake server: charging (or skipping) ends the
 * turn, and the next turn starts 1.5s later.
 */
const FirstMateSimulator = ({ chargeSystem, skipCharging }: FirstMateSimulatorProps) => {
  const [view] = useState(() => mockPlayerView(FIRST_MATE));
  const [systems, setSystems] = useState<Partial<Record<SystemName, SystemCharge>>>(view.systems ?? {});
  const [waitingForFirstMate, setWaitingForFirstMate] = useState(true);

  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timeout.current), []);

  const endTurn = () => {
    setWaitingForFirstMate(false);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setWaitingForFirstMate(true), 1500);
  };

  return (
    <>
      <UnconnectedDebugPane data={{ ...view, systems, waitingForFirstMate }} />
      <UnconnectedFirstMatePage
        chargeSystem={(systemName) => {
          chargeSystem(systemName);
          setSystems((current) => {
            const system = current[systemName];
            return system
              ? { ...current, [systemName]: { ...system, charge: Math.min(system.charge + 1, system.maxCharge) } }
              : current;
          });
          endTurn();
        }}
        hitPoints={view.hitPoints}
        readyToCharge={waitingForFirstMate}
        skipCharging={() => {
          skipCharging();
          endTurn();
        }}
        systems={systems}
      />
    </>
  );
};

const meta = {
  title: "Components/FirstMatePage",
  component: FirstMateSimulator,
  args: { chargeSystem: fn(), skipCharging: fn() },
} satisfies Meta<typeof FirstMateSimulator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FirstMatePage: Story = {};
