import { Button } from "@mui/material";
import { api } from "../../../../convex/_generated/api";
import styles from "../../../../styles/FirstMatePage.module.css";
import { ALL_SYSTEMS } from "../../../../shared/system";
import type { SystemCharge, SystemName } from "../../../../shared/types";
import { useGame, useGameAction } from "../GameContext";
import HitPointMeter from "./HitPointMeter";
import SystemCard from "./SystemCard";

interface FirstMatePageProps {
  chargeSystem: (systemName: SystemName) => void;
  hitPoints: number;
  readyToCharge: boolean;
  skipCharging: () => void;
  systems: Partial<Record<SystemName, SystemCharge>>;
}

export const UnconnectedFirstMatePage = (props: FirstMatePageProps) => {
  return (
    <div id="first-mate-page" className={styles.FirstMatePage}>
      <div className={styles.HitPointMeterBox}>
        <HitPointMeter hitPoints={props.hitPoints} />
      </div>
      <div className={styles.SystemPanels}>
        {ALL_SYSTEMS.map((name) => {
          const system = props.systems[name];
          return system ? (
            <SystemCard
              charge={system.charge}
              key={name}
              maxCharge={system.maxCharge}
              name={name}
              onCharge={() => props.chargeSystem(name)}
              readyToCharge={props.readyToCharge}
            />
          ) : null;
        })}
        <Button
          className={styles.SkipChargingButton}
          color="secondary"
          disabled={!props.readyToCharge}
          onClick={props.skipCharging}
          variant="contained"
        >
          Skip Charging
        </Button>
      </div>
    </div>
  );
};

const ConnectedFirstMatePage = () => {
  const game = useGame();
  const chargeSystem = useGameAction(api.games.chargeSystem);
  return (
    <UnconnectedFirstMatePage
      chargeSystem={(systemName) => void chargeSystem({ systemName })}
      skipCharging={() => void chargeSystem({})}
      readyToCharge={game.waitingForFirstMate ?? false}
      hitPoints={game.hitPoints}
      systems={game.systems ?? {}}
    />
  );
};

export default ConnectedFirstMatePage;
