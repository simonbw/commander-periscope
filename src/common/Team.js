import Immutable from 'immutable';

export const RED = 'red';
export const BLUE = 'blue';

export const BOTH_TEAMS = [RED, BLUE];
export const TEAMS_MAP = Immutable.Map({ [RED]: RED, [BLUE]: BLUE });

export const getDisplayName = (team) => {
  switch (team) {
    case RED:
      return 'Red Team';
    case BLUE:
      return 'Blue Team';
  }
};