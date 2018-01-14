import * as Immutable from 'immutable';
import { JOINED, UPDATED } from '../../common/Messages';
import { jsonToImmutable } from '../../common/util/ImmutableUtil';

export default (state, action) => {
  state = state || Immutable.Map();
  switch (action.type) {
    case JOINED:
    case UPDATED:
      return jsonToImmutable(action.game);
  }
  return state;
}
