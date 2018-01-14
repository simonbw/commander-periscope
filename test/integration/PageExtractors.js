import { jsonToImmutable } from '../../src/common/util/ImmutableUtil';

export async function extractUserId(page) {
  // Cannot use constants here, cuz we're in browser scope
  return await page.evaluate(
    /* istanbul ignore next */
    () => window._store.getState().get('userId')
  );
}

export async function extractState(page) {
  return jsonToImmutable(await page.evaluate(
    /* istanbul ignore next */
    () => window._store.getState().toJS())
  );
}

export async function extractLobby(page) {
  // Cannot use constants here, cuz we're in browser scope
  return jsonToImmutable(await page.evaluate(
    /* istanbul ignore next */
    () => window._store.getState().get('lobby').toJS())
  );
}

export async function extractGame(page) {
  // Cannot use constants here, cuz we're in browser scope
  return jsonToImmutable(await page.evaluate(
    /* istanbul ignore next */
    () => window._store.getState().get('game').toJS())
  );
}