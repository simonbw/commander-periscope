import { ID } from '../../src/common/fields/CommonFields';
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
  await page.waitForFunction(/* istanbul ignore next */() => {
    // Cannot use constants here, cuz we're in browser scope
    return window._store.getState().getIn(['lobby', 'isReady']);
  });
}

export async function waitForJoinGame(page) {
  await page.waitForFunction(/* istanbul ignore next */() => {
    // Cannot use constants here, cuz we're in browser scope
    return window._store.getState().get('game') != null;
  }, { timeout: 500 });
}
