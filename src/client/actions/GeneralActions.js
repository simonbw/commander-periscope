export const CONNECTED = 'connected';
export const DISCONNECTED = 'disconnected';

export const connected = () => ({
  type: CONNECTED
});

export const disconnected = () => ({
  type: DISCONNECTED
});