import { CHANGE_PAGE } from '../actions/GeneralActions';
import * as Page from '../models/Page';

export default (page, action) => {
  page = page || Page.MAIN_MENU;
  
  if (action.type === CHANGE_PAGE) {
    return action.page;
  }
  
  return page;
}
