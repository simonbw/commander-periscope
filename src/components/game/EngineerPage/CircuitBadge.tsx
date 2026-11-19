import { Badge, badgeClasses, type BadgeProps, styled } from "@mui/material";

const createColoredBadge = (color: string, borderRadius = "50%") =>
  styled(Badge)({
    [`& .${badgeClasses.badge}`]: {
      color: "#FFF",
      backgroundColor: color,
      fontFamily: "sans-serif",
      borderRadius,
    },
  });

const GreenBadge = createColoredBadge("#2C2", "50%");
const RedBadge = createColoredBadge("#C22", "25%"); // TODO: Try to get a different shape like triangle or diamond
const BlueBadge = createColoredBadge("#22C", "0");

interface CircuitBadgeProps extends Omit<BadgeProps, "badgeContent"> {
  active: boolean;
  circuit: number;
}

const CircuitBadge = ({ circuit, active: _active, ...props }: CircuitBadgeProps) => {
  switch (circuit) {
    case 1:
      return <GreenBadge badgeContent={circuit} {...props} />;
    case 2:
      return <RedBadge badgeContent={circuit} {...props} />;
    case 3:
      return <BlueBadge badgeContent={circuit} {...props} />;
    default:
      return null;
  }
};

export default CircuitBadge;
