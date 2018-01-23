import { validateLobbyId } from '../../src/common/Validation';
import expect from '../expect';

describe('Validation', () => {
  it('validteLobbyId', () => {
    expect(() => validateLobbyId('')).to.throw();
    expect(() => validateLobbyId(`can't have spaces`)).to.throw();
    expect(() => validateLobbyId('asdf')).not.to.throw();
  })
});