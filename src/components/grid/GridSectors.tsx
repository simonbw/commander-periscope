import clsx from "clsx";
import styles from "../../../styles/Grid/GridSectors.module.css";
import { SECTOR_LABELS } from "../../../shared/grid";

interface GridSectorsProps {
  selected?: number | null;
}

const SECTORS = Array.from({ length: 9 }, (_, i) => i);
// TODO: Don't hardcode these points
const SECTOR_LINES = [
  [5, 0, 5, 15],
  [10, 0, 10, 15],
  [0, 5, 15, 5],
  [0, 10, 15, 10],
];

const GridSectors = ({ selected }: GridSectorsProps) => (
  <g>
    {SECTORS.map((i) => {
      const row = Math.floor(i / 3);
      const column = i % 3;
      return (
        <g key={i}>
          <rect
            className={clsx(styles.GridSectorBack, { [styles.selected]: i === selected })}
            x={column * 5}
            y={row * 5}
            height={5}
            width={5}
          />
          <text
            className={clsx(styles.GridSectorLabel, { [styles.selected]: i === selected })}
            textAnchor="middle"
            x={column * 5 + 2.5}
            y={row * 5 + 2.5}
          >
            {SECTOR_LABELS[i]}
          </text>
        </g>
      );
    })}
    {SECTOR_LINES.map(([x1, y1, x2, y2], i) => (
      <line key={`line${i}`} className={styles.GridSectorLine} x1={x1} x2={x2} y1={y1} y2={y2} />
    ))}
  </g>
);

export default GridSectors;
