import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import styles from "../../../styles/DamageFlash.module.css";
import { useGame } from "./GameContext";

const FLASH_DURATION_MS = 100;

/** Flashes the screen red whenever hit points change. */
export const UnconnectedDamageFlash = ({ hitPoints }: { hitPoints: number }) => {
  const [changing, setChanging] = useState(false);
  const previousHitPoints = useRef(hitPoints);

  useEffect(() => {
    if (previousHitPoints.current === hitPoints) {
      return;
    }
    previousHitPoints.current = hitPoints;
    setChanging(true);
    const timeout = setTimeout(() => setChanging(false), FLASH_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [hitPoints]);

  return <div className={clsx(styles.DamageFlash, { [styles.open]: changing })} />;
};

const DamageFlash = () => {
  const { hitPoints } = useGame();
  return <UnconnectedDamageFlash hitPoints={hitPoints} />;
};

export default DamageFlash;
