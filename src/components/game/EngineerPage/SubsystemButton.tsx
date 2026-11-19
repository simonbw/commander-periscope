import { IconButton } from "@mui/material";
import type { Subsystem } from "../../../../shared/types";
import { getIconForSystemType } from "../../icons/SystemTypeIcons";
import CircuitBadge from "./CircuitBadge";

interface SubsystemButtonProps {
  active: boolean;
  broken: boolean;
  onClick: () => void;
  subsystem: Subsystem;
}

const SubsystemButton = ({ active, subsystem, broken, onClick }: SubsystemButtonProps) => {
  const { circuit, systemType } = subsystem;

  const inside =
    circuit != null ? (
      <CircuitBadge active={active} circuit={circuit}>
        {getIconForSystemType(systemType, broken)}
      </CircuitBadge>
    ) : (
      getIconForSystemType(systemType, broken)
    );

  return (
    <IconButton disabled={broken || !active} onClick={onClick}>
      {/* TODO: Figure out how to make tooltips work */}
      {inside}
    </IconButton>
  );
};

export default SubsystemButton;
