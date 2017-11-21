import * as Immutable from 'immutable';
import * as GameActions from '../actions/GameActions';

export default (state, action) => {
  state = state || Immutable.Map();
  switch (action.type) {
    case GameActions.JOINED:
      return jsonToGame(action.game);
  }
  return state;
}

const jsonToGame = (json) => (
  Immutable.fromJS(json, (key, value) => {
    switch (key) {
      case 'readied':
      case 'players':
        return value.toSet();
      default:
        return Immutable.Iterable.isKeyed(value) ? value.toMap() : value.toList()
    }
  })
);