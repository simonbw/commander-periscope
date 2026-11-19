import type { HTMLAttributes, ReactNode } from "react";
import styles from "../../../styles/Grid/GridContainer.module.css";

interface GridContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const GridContainer = ({ children, ...props }: GridContainerProps) => (
  <div className={styles.GridContainer} {...props}>
    <svg viewBox="-1 -1 16 16">
      {/* TODO: Actual grid size*/}
      {children}
    </svg>
  </div>
);

export default GridContainer;
