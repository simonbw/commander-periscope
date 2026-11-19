import { Divider, Paper } from "@mui/material";
import clsx from "clsx";
import styles from "../../../../styles/EngineerPage.module.css";
import { getDirectionArrow } from "../../../../shared/direction";
import type { Direction, Subsystem } from "../../../../shared/types";
import SubsystemButton from "./SubsystemButton";

interface DirectionPaneProps {
  active: boolean;
  breakdowns: number[];
  direction: Direction;
  subsystems: Subsystem[];
  trackBreakdown: (subsystemId: number) => void;
}

const circuitOrder = (subsystem: Subsystem) => subsystem.circuit ?? Infinity;

const DirectionPane = ({ active, breakdowns, direction, subsystems, trackBreakdown }: DirectionPaneProps) => {
  const subsystemButtons = [...subsystems]
    .sort((a, b) => circuitOrder(a) - circuitOrder(b) || 0) // `|| 0`: Infinity - Infinity is NaN
    .map((subsystem) => (
      <SubsystemButton
        active={active}
        broken={breakdowns.includes(subsystem.id)}
        key={subsystem.id}
        onClick={() => trackBreakdown(subsystem.id)}
        subsystem={subsystem}
      />
    ));
  return (
    <Paper className={clsx(styles.DirectionPanel, { [styles.active]: active })} elevation={active ? 16 : undefined}>
      <h2>
        {direction} {getDirectionArrow(direction)}
      </h2>
      <Divider />
      <section className={styles.ButtonRow}>{subsystemButtons.slice(0, 3)}</section>
      <Divider />
      <section className={styles.ButtonRow}>{subsystemButtons.slice(3)}</section>
    </Paper>
  );
};

export default DirectionPane;
