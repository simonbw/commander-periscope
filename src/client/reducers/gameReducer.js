import * as Immutable from 'immutable';
import { JOINED, UPDATED } from '../../common/Messages';
import { PLAYERS, READIED } from '../../common/StateFields';

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
      case READIED:
      case PLAYERS:
        return value.toSet();
      default:
        return Immutable.Iterable.isKeyed(value) ? value.toMap() : value.toList()
    }
  })
);