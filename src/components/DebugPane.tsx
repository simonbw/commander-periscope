import clsx from "clsx";
import { useState } from "react";
import styles from "../../styles/DebugPane.module.css";

export interface DebugPaneProps {
  data: unknown;
  initiallyOpen?: boolean;
}

/** A collapsible JSON dump of `data`, for development. Click to toggle. */
export const UnconnectedDebugPane = ({ data, initiallyOpen = false }: DebugPaneProps) => {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <div onClick={() => setOpen(!open)} className={clsx(styles.DebugPane, { [styles.open]: open })}>
      {open ? <pre>{JSON.stringify(data, null, 2)}</pre> : "Debug"}
    </div>
  );
};

/**
 * The old version read the whole statty state; there's no single client state
 * now, so whoever renders this passes the data to show.
 */
const DebugPane = ({ data }: { data: unknown }) => <UnconnectedDebugPane data={data} />;

export default DebugPane;
