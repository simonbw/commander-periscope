export const RED = 'RED';
export const BLUE = 'BLUE';

export const getDisplayName = (team) => {
  switch (team) {
    case RED:
      return 'Red Team';
    case BLUE:
      return 'Blue Team';
  }
};