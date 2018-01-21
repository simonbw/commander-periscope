import * as Immutable from 'immutable';
import { JOINED_MESSAGE, UPDATED_MESSAGE } from '../../common/Messages';
import { jsonToImmutable } from '../../common/util/ImmutableUtil';

export default (state, action) => {
  state = state || Immutable.Map();
  switch (action.type) {
    case JOINED_MESSAGE:
    case UPDATED_MESSAGE:
      return jsonToImmutable(action.game);
  }
  return state;
}
