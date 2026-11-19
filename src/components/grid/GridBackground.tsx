import styles from "../../../styles/Grid/GridBackground.module.css";

interface GridBackgroundProps {
  height: number;
  width: number;
}

const GridBackground = ({ width, height }: GridBackgroundProps) => (
  <g>
    <rect
      className={styles.GridBackground}
      x={0}
      y={0}
      height={width}
      width={height}
      fill={"#CCDDFF"}
    />
  </g>
);

export default GridBackground;
