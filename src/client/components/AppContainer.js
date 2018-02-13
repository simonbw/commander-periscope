import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { State } from 'statty';
import '../../../styles/main.css';
import { LOBBY } from '../../common/fields/StateFields';
import ConnectionWarner from './ConnectionWarner';
import DebugPane from './DebugPane';
import CustomLobbyContainer from './lobby/CustomLobbyContainer';
import MainMenu from './menu/MainMenu';

// The top level component for commander periscope
const UnconnectedAppContainer = ({ isProduction, inLobby }) => {
  return (
    <Fragment>
      {!isProduction && <DebugPane/>}
      <ConnectionWarner/>
      {inLobby ? <CustomLobbyContainer/> : <MainMenu/>}
    </Fragment>
  );
};

UnconnectedAppContainer.propTypes = {
  isProduction: PropTypes.bool.isRequired,
  inLobby: PropTypes.bool.isRequired,
};

const ConnectedAppContainer = () => (
  <State
    select={(state) => ({
      inLobby: Boolean(state.get(LOBBY)),
      isProduction: window.NODE_ENV === 'production',
    })}
    render={({ isProduction, inLobby }) => (
      <UnconnectedAppContainer isProduction={isProduction} inLobby={inLobby}/>
    )}
  />
);

export default ConnectedAppContainer;