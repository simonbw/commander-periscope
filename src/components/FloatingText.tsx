import clsx from "clsx";
import type { HTMLAttributes } from "react";
import styles from "../../styles/FloatingText.module.css";

const FloatingText = ({ children, className, ...otherProps }: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx(styles.FloatingText, className)} {...otherProps}>
    {children}
  </div>
);

export default FloatingText;
