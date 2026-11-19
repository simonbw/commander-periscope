import clsx from "clsx";
import styles from "../../../../styles/ChargeMeter.module.css";

interface ChargeMeterProps {
  charge: number;
  maxCharge: number;
}

const ChargeMeter = ({ charge, maxCharge }: ChargeMeterProps) => (
  <div className={styles.ChargeMeter}>
    {Array.from({ length: maxCharge }, (_, i) => (
      <div key={i} className={clsx(styles.ChargeMeterUnit, { [styles.charged]: i < charge })} />
    ))}
  </div>
);

export default ChargeMeter;
