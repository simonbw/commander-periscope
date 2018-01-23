import { createMuiTheme, MuiThemeProvider } from 'material-ui';
import React from 'react';

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Source Sans Pro", "Helvetica Neue", sans-serif',
  },
  palette: {
    primary: {
      main: '#1188BB',
    },
    // secondary: {},
    // error: {}
    background: {
      paper: '#FFFFFF',
      default: '#FFFFFF',
      chip: '#FFFFFF',
    },
    grey: {
      300: '#FFFFFF' // TODO: hack
    },
    types: {
      light: {
        background: {
          chip: '#FFFFFF',
          default: '#FFFFFF',
        }
      }
    },
    text: {
      primary: '#114477'
    }
  },
});

// The top level component for commander periscope
const ThemeProvider = ({ children }) => {
  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;