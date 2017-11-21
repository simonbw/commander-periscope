import React from 'react';
import { connect } from 'react-redux';
import '../../../styles/main.css';
import * as Page from '../models/Page';
import GamePage from './game/GamePage';
import CustomGameLobby from './lobby/CustomLobbyPage';
import MainMenu from './MainMenu';

const PageContainer = ({ page, connected }) => (
  <div>
    {!connected && <div><i>Connecting...</i></div>}
    <PageChooser page={page}/>
  </div>
);

const PageChooser = ({ page }) => {
  switch (page) {
    case Page.MAIN_MENU:
      return <MainMenu/>;
    case Page.CUSTOM_LOBBY:
      return <CustomGameLobby/>;
    case Page.GAME:
      return <GamePage/>;
    default:
      return <div>Unknown Page {page}</div>
  }
};

export default connect(
  (state) => ({
    page: state.get('page'),
    connected: state.get('connected')
  }),
  (dispatch) => ({})
)(PageContainer);