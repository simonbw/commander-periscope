export const CHANGE_PAGE = 'change_page';
export const SEND_MESSAGE = 'send_message';
export const CONNECTED = 'connected';
export const DISCONNECTED = 'disconnected';

// TODO: History and stuff
export const changePage = (page) => ({
  type: CHANGE_PAGE,
  page
});

export const sendMessage = (messageType, messageData) => ({
  type: SEND_MESSAGE,
  messageType,
  messageData
});

export const connected = () => ({
  type: CONNECTED
});

export const disconnected = () => ({
  type: DISCONNECTED
});