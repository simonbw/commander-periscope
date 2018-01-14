import { CHANGE_PAGE } from '../actions/GeneralActions';
import { MAIN_MENU_PAGE } from '../constants/Page';

export default (page, action) => {
  page = page || MAIN_MENU_PAGE;
  
  if (action.type === CHANGE_PAGE) {
    return action.page;
  }
  
  return page;
}
