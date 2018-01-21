export const SEND_MESSAGE = 'send_message';
export const CONNECTED = 'connected';
export const DISCONNECTED = 'disconnected';

// TODO: Come up with some sort of strategy for dealing with pending and failed actions.

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