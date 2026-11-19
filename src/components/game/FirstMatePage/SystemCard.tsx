import { Button, Tooltip } from "@mui/material";
import clsx from "clsx";
import styles from "../../../../styles/FirstMatePage.module.css";
import { getSystemType } from "../../../../shared/system";
import type { SystemName } from "../../../../shared/types";
import { getIconForSystemType } from "../../icons/SystemTypeIcons";
import ChargeMeter from "./ChargeMeter";

interface SystemCardProps {
  name: SystemName;
  charge: number;
  maxCharge: number;
  onCharge: () => void;
  readyToCharge: boolean;
}

const SystemCard = ({ name, charge, maxCharge, onCharge, readyToCharge }: SystemCardProps) => {
  const systemType = getSystemType(name);
  return (
    <Button
      className={clsx(styles.SystemPanel, { [styles.charged]: charge === maxCharge })}
      disabled={!readyToCharge || charge === maxCharge}
      onClick={onCharge}
      variant="contained"
    >
      <div className={styles.SystemPanelPaper}>
        <ChargeMeter charge={charge} maxCharge={maxCharge} />
        <div className={styles.SystemPanelRight}>
          <div className={styles.SystemName}>{name}</div>
          <Tooltip title={systemType} placement="right" enterDelay={300}>
            {/* Tooltip needs a ref-able child; the span guarantees one whatever the icon is. */}
            <span style={{ display: "inline-flex" }}>{getIconForSystemType(systemType)}</span>
          </Tooltip>
        </div>
      </div>
    </Button>
  );
};

export default SystemCard;
