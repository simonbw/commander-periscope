import React from 'react';
import { connect } from 'react-redux';
import '../../../styles/main.css';
import { CONNECTED, PAGE } from '../../common/StateFields';
import { CUSTOM_LOBBY_PAGE, GAME_PAGE, MAIN_MENU_PAGE } from '../constants/Page';
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
    case MAIN_MENU_PAGE:
      return <MainMenu/>;
    case CUSTOM_LOBBY_PAGE:
      return <CustomGameLobby/>;
    case GAME_PAGE:
      return <GamePage/>;
    default:
      return <div>Unknown Page {page}</div>
  }
};

export default connect(
  (state) => ({
    page: state.get(PAGE),
    connected: state.get(CONNECTED)
  }),
  (dispatch) => ({})
)(PageContainer);