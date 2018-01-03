import * as Immutable from 'immutable';
import { JOINED, UPDATED } from '../../common/Messages';

export default (state, action) => {
  state = state || Immutable.Map();
  switch (action.type) {
    case JOINED:
    case UPDATED:
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