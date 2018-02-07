import Immutable from 'immutable';
import { PHASE } from '../../common/fields/GameFields';
import { LOADING_PHASE } from '../../common/GamePhase';
import { GAME_JOINED_MESSAGE, GAME_UPDATED_MESSAGE } from '../../common/Messages';
import { jsonToImmutable } from '../../common/util/ImmutableUtil';

export default (state, action) => {
  state = state || Immutable.Map({ [PHASE]: LOADING_PHASE });
  switch (action.type) {
    case GAME_JOINED_MESSAGE:
    case GAME_UPDATED_MESSAGE:
      return jsonToImmutable(action.game);
  }
  return state;
}
