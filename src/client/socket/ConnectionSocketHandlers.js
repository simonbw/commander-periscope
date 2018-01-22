import { connected, disconnected } from '../actions/GeneralActions';

export function getConnectionHandlers(dispatch) {
  return [[
    'connect', () => {
      dispatch(connected());
    }
  ], [
    'disconnect', () => {
      dispatch(disconnected());
    }
  ]];
}