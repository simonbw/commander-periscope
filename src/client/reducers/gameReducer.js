import Immutable from 'immutable';
import { PHASE } from '../../common/fields/GameFields';
import { GAME_JOINED_MESSAGE, GAME_UPDATED_MESSAGE } from '../../common/messages/GameMessages';
import { LOADING_PHASE } from '../../common/models/GamePhase';
import { jsonToImmutable } from '../../common/util/ImmutableUtil';

export default (state, action) => {
  state = state || Immutable.Map({ [PHASE]: LOADING_PHASE });
  switch (action.type) {
    case GAME_JOINED_MESSAGE:
    case GAME_UPDATED_MESSAGE:
      return jsonToImmutable(action.game); // TODO: Don't just always replace everything
  }
  return state;
}
