import { createGame } from './createGame';
import Resource from './Resource';

// TODO: Unit test all of this

const Games = new Resource('game', 'game', createGame, false);

export default Games;
