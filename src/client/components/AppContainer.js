import React from 'react';
import { connect } from 'react-redux';
import '../../../styles/main.css';
import { LOBBY } from '../../common/StateFields';
import ConnectionWarner from './ConnectionWarner';
import CustomLobbyContainer from './lobby/CustomLobbyContainer';
import MainMenu from './MainMenu';

// The top level component for commander periscope
const UnconnectedAppContainer = ({ inLobby }) => {
  return (
    <div>
      <ConnectionWarner/>
      {inLobby ? <CustomLobbyContainer/> : <MainMenu/>}
    </div>
  );
};

export default connect(
  (state) => ({
    inLobby: Boolean(state.get(LOBBY))
  }),
  () => ({})
)(UnconnectedAppContainer);