import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { UnconnectedDamageFlash } from "../src/components/game/DamageFlash";
import { mockPlayerView } from "./mocks";

/** Loses a hit point every `interval` ms, so the flash fires repeatedly. */
const DamageFlashDemo = ({ interval }: { interval: number }) => {
  const [hitPoints, setHitPoints] = useState(() => mockPlayerView().hitPoints);
  useEffect(() => {
    const id = setInterval(() => setHitPoints((hp) => hp - 1), interval);
    return () => clearInterval(id);
  }, [interval]);
  return <UnconnectedDamageFlash hitPoints={hitPoints} />;
};

const meta = {
  title: "Components/DamageFlash",
  component: DamageFlashDemo,
  args: { interval: 1500 },
} satisfies Meta<typeof DamageFlashDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DamageFlash: Story = {};
