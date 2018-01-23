import { GAME_JOINED_MESSAGE, GAME_UPDATED_MESSAGE } from '../../common/Messages';
import { jsonToImmutable } from '../../common/util/ImmutableUtil';

export default (state, action) => {
  state = state || null;
  switch (action.type) {
    case GAME_JOINED_MESSAGE:
    case GAME_UPDATED_MESSAGE:
      return jsonToImmutable(action.game);
  }
  return state;
}
