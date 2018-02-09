import { create } from 'jss';
import { createMuiTheme, MuiThemeProvider } from 'material-ui';
import { createGenerateClassName, jssPreset } from 'material-ui/styles';
import React from 'react';
import JssProvider from 'react-jss/lib/JssProvider';

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Source Sans Pro", "Helvetica Neue", sans-serif',
  },
  palette: {
    primary: {
      main: '#1188BB',
    },
    background: {
      paper: '#FFFFFF',
      default: '#FFFFFF',
      chip: '#FFFFFF',
    },
    grey: {
      300: '#FFFFFF'
    },
    action: {
      disabledBackground: '#E0E0E0'
    },
    text: {
      primary: '#114477'
    }
  },
});

// Inject these styles earlier so my styles can override them. See issue #22.
const styleNode = document.createComment("jss-insertion-point");
document.head.insertBefore(styleNode, document.head.firstChild);

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
jss.options.insertionPoint = 'jss-insertion-point';

// The top level component for commander periscope
const ThemeProvider = ({ children }) => {
  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </JssProvider>
  );
};

export default ThemeProvider;