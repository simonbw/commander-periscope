import { PLAYERS, READIED } from '../../../src/common/fields/LobbyFields';
import { shouldStartGame } from '../../../src/server/resources/CustomLobbyUtils';
import expect from '../../expect';
import { mockLobby } from '../../mocks';

describe('CustomLobbyUtils', () => {
  it('.shouldStartGame', () => {
    const unreadyLobby = mockLobby();
    expect(shouldStartGame(unreadyLobby)).to.equal(false);
    const readyLobby = unreadyLobby.set(READIED, unreadyLobby.get(PLAYERS).toSet());
    expect(shouldStartGame(readyLobby)).to.equal(true);
  });
});