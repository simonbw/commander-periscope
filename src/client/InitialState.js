import Immutable from 'immutable';
import { CONNECTED, GAME, LOBBY, USER_ID } from '../common/fields/StateFields';
import { getUserId } from './user';

export const initialState = Immutable.Map({
  [CONNECTED]: false,
  [LOBBY]: null,
  [GAME]: null,
  [USER_ID]: getUserId(),
});