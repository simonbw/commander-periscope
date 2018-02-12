import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import '../../../styles/main.css';
import { LOBBY } from '../../common/fields/StateFields';
import ConnectionWarner from './ConnectionWarner';
import DebugPane from './DebugPane';
import CustomLobbyContainer from './lobby/CustomLobbyContainer';
import MainMenu from './menu/MainMenu';
import ThemeProvider from './ThemeProvider';

// The top level component for commander periscope
const UnconnectedAppContainer = ({ isProduction, inLobby }) => {
  return (
    <ThemeProvider>
      <Fragment>
        {!isProduction && <DebugPane/>}
        <ConnectionWarner/>
        {inLobby ? <CustomLobbyContainer/> : <MainMenu/>}
      </Fragment>
    </ThemeProvider>
  );
};

export default connect(
  (state) => ({
    inLobby: Boolean(state.get(LOBBY)),
    isProduction: window.NODE_ENV === 'production',
  }),
  () => ({})
)(UnconnectedAppContainer);