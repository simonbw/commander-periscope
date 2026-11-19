import { Paper } from "@mui/material";
import clsx from "clsx";
import styles from "../../../../styles/HitPointMeter.module.css";
import { MAX_HIT_POINTS } from "../../../../shared/gameFactory";

const HitPointMeter = ({ hitPoints }: { hitPoints: number }) => (
  <Paper className={styles.HitPointMeterPaper}>
    <h2>Hit Points</h2>
    <div className={styles.HitPointMeter}>
      {Array.from({ length: MAX_HIT_POINTS }, (_, i) => (
        <div key={i} className={clsx(styles.HitPointMeterUnit, { [styles.charged]: i < hitPoints })} />
      ))}
    </div>
  </Paper>
);

export default HitPointMeter;
