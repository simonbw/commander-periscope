import { StyledEngineProvider } from "@mui/material";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";

export const theme = createTheme({
  typography: {
    fontFamily: '"Source Sans Pro", "Helvetica Neue", sans-serif',
  },
  palette: {
    primary: { main: "#1188BB" },
    background: { paper: "#FFFFFF", default: "#FFFFFF" },
    action: { disabledBackground: "#E0E0E0" },
    text: { primary: "#114477" },
  },
});

/**
 * `injectFirst` puts MUI's emotion styles before our CSS modules, so the
 * stylesheets in styles/ can override MUI — the job the old JSS
 * insertion-point hack did.
 */
export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
}
