import { ID } from '../../src/common/fields/CommonFields';
import { IS_READY } from '../../src/common/fields/LobbyFields';
import { GAME, LOBBY } from '../../src/common/fields/StateFields';
import { extractLobby } from './PageExtractors';

export async function createCustomLobby(page) {
  await page.click('#create-custom-game-button');
  await page.waitForSelector('#custom-lobby-page');
  return (await extractLobby(page)).get(ID);
}

export async function joinCustomLobby(page, lobbyId) {
  await page.click('#join-custom-game-button');
  await page.waitForSelector('#custom-game-input', { timeout: 200 });
  const customGameInput = await page.$('#custom-game-input');
  await customGameInput.type(lobbyId);
  await customGameInput.press('Enter');
  await page.waitForSelector('#custom-lobby-page');
}

export async function clickReadyButton(page) {
  await page.click('#ready-button');
  await page.waitForFunction(/* istanbul ignore next */(LOBBY, IS_READY) => {
    return window._state.getIn([LOBBY, IS_READY]);
  }, {}, LOBBY, IS_READY);
}

export async function waitForJoinGame(page) {
  await page.waitForFunction(/* istanbul ignore next */(GAME) => {
    return window._state.get(GAME) != null;
  }, { timeout: 500 }, GAME);
}
