import clsx from "clsx";
import styles from "../../../styles/Grid/GridLabels.module.css";
import { COLUMN_LABELS, ROW_LABELS } from "../../../shared/grid";

interface GridLabelsProps {
  height: number;
  width: number;
  selectedX?: number | null;
  selectedY?: number | null;
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

const GridLabels = ({ height, width, selectedX, selectedY }: GridLabelsProps) => (
  <g>
    {range(width).map((x) => (
      <text
        className={clsx(styles.GridLabel, { [styles.selected]: x === selectedX })}
        key={`x${x}`}
        stroke="none"
        textAnchor="middle"
        x={x + 0.5}
        y={-0.5}
      >
        {COLUMN_LABELS[x]}
      </text>
    ))}
    {range(height).map((y) => (
      <text
        className={clsx(styles.GridLabel, { [styles.selected]: y === selectedY })}
        key={`y${y}`}
        stroke="none"
        textAnchor="middle"
        x={-0.5}
        y={y + 0.5}
      >
        {ROW_LABELS[y]}
      </text>
    ))}
  </g>
);

export default GridLabels;
