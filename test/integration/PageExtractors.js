import { GAME, LOBBY, USER_ID } from '../../src/common/fields/StateFields';
import { jsonToImmutable } from '../../src/common/util/ImmutableUtil';

export async function extractUserId(page) {
  return await page.evaluate(
    /* istanbul ignore next */
    (USER_ID) => window._state.get(USER_ID), USER_ID
  );
}

export async function extractLobby(page) {
  return jsonToImmutable(await page.evaluate(
    /* istanbul ignore next */
    (LOBBY) => window._state.get(LOBBY).toJS(), LOBBY
  ));
}
