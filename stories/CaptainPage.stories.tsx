import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { MAIN_PHASE } from "../shared/gamePhase";
import { getLocationFromDirection, locEq } from "../shared/grid";
import { CAPTAIN } from "../shared/role";
import { DRONE, MINE, SILENT, SONAR, TORPEDO } from "../shared/system";
import type { PlayerGameView } from "../shared/transforms";
import type { Direction, Location, SystemName } from "../shared/types";
import { UnconnectedDebugPane } from "../src/components/DebugPane";
import { UnconnectedCaptainContainer } from "../src/components/game/CaptainPage";
import { mockPlayerView } from "./mocks";

const ROUND_TRIP_TIME = 300;

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** The callbacks the captain page fires; each is logged to the Actions panel. */
interface CaptainSimulatorProps {
  detonateMine: (location: Location) => void;
  dropMine: (location: Location) => void;
  fireTorpedo: (location: Location) => void;
  goSilent: (location: Location) => void;
  headInDirection: (direction: Direction) => void;
  setStartLocation: (location: Location) => void;
  surface: () => void;
  useDrone: (sector: number) => void;
  useSonar: () => void;
}

/**
 * Renders the captain page against a fake server: each action is logged, then
 * the game state is updated after a simulated round trip (and the engineer and
 * first mate "respond" after a random delay when the sub moves).
 */
const CaptainSimulator = (actions: CaptainSimulatorProps) => {
  const [game, setGame] = useState<PlayerGameView>(() => mockPlayerView(CAPTAIN));
  const update = (updater: (game: PlayerGameView) => PlayerGameView) => setGame(updater);
  const setSystem = (name: SystemName, value: boolean) =>
    update((g) => ({ ...g, systemStatuses: { ...g.systemStatuses!, [name]: value } }));
  const setTurnInfo = (changes: Partial<NonNullable<PlayerGameView["turnInfo"]>>) =>
    update((g) => ({ ...g, turnInfo: { ...g.turnInfo!, ...changes } }));

  return (
    <>
      <UnconnectedDebugPane data={game} />
      <UnconnectedCaptainContainer
        detonateMine={async (mine) => {
          actions.detonateMine(mine);
          await delay(ROUND_TRIP_TIME);
          update((g) => ({ ...g, mineLocations: g.mineLocations!.filter((m) => !locEq(m, mine)) }));
        }}
        dropMine={(location) => {
          actions.dropMine(location);
          update((g) => ({
            ...g,
            mineLocations: [...g.mineLocations!, location],
            systemStatuses: { ...g.systemStatuses!, [MINE]: false },
          }));
        }}
        fireTorpedo={async (location) => {
          actions.fireTorpedo(location);
          await delay(ROUND_TRIP_TIME);
          setSystem(TORPEDO, false);
        }}
        gamePhase={game.phase}
        goSilent={async (location) => {
          actions.goSilent(location);
          await delay(ROUND_TRIP_TIME);
          update((g) => ({
            ...g,
            systemStatuses: { ...g.systemStatuses!, [SILENT]: false },
            subPath: [...g.subPath!, g.subLocation!],
            subLocation: location,
          }));
        }}
        grid={game.grid!}
        headInDirection={async (direction) => {
          actions.headInDirection(direction);
          await delay(ROUND_TRIP_TIME);
          update((g) => ({
            ...g,
            subLocation: getLocationFromDirection(g.subLocation!, direction),
            subPath: [...g.subPath!, g.subLocation!],
            turnInfo: { ...g.turnInfo!, waitingForEngineer: true, waitingForFirstMate: true },
          }));
          setTimeout(
            () =>
              update((g) => ({
                ...g,
                systemStatuses: { mine: true, torpedo: true, drone: true, sonar: true, silent: true },
                turnInfo: { ...g.turnInfo!, waitingForEngineer: false },
              })),
            Math.random() * 1000 + 500,
          );
          setTimeout(() => setTurnInfo({ waitingForFirstMate: false }), Math.random() * 1000 + 500);
        }}
        mines={game.mineLocations!}
        setStartLocation={async (location) => {
          actions.setStartLocation(location);
          await delay(ROUND_TRIP_TIME);
          update((g) => ({ ...g, subLocation: location, phase: MAIN_PHASE }));
        }}
        subLocation={game.subLocation}
        subPath={game.subPath!}
        surface={async () => {
          actions.surface();
          await delay(ROUND_TRIP_TIME);
          update((g) => ({ ...g, subPath: [] }));
        }}
        systems={game.systemStatuses!}
        useDrone={async (sector) => {
          actions.useDrone(sector);
          await delay(ROUND_TRIP_TIME);
          setSystem(DRONE, false);
        }}
        useSonar={async () => {
          actions.useSonar();
          await delay(ROUND_TRIP_TIME);
          setSystem(SONAR, false);
        }}
        waitingForEngineer={game.turnInfo!.waitingForEngineer}
        waitingForFirstMate={game.turnInfo!.waitingForFirstMate}
      />
    </>
  );
};

const meta = {
  title: "Components/Captain Page",
  component: CaptainSimulator,
  args: {
    detonateMine: fn(),
    dropMine: fn(),
    fireTorpedo: fn(),
    goSilent: fn(),
    headInDirection: fn(),
    setStartLocation: fn(),
    surface: fn(),
    useDrone: fn(),
    useSonar: fn(),
  },
} satisfies Meta<typeof CaptainSimulator>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Starts in the pick phase: choose a start location, then play. */
export const CaptainPage: Story = {
  name: "Captain Page",
};
