// import '../../images/roles'

export const CAPTAIN = 'captain';
export const FIRST_MATE = 'first_mate';
export const RADIO_OPERATOR = 'radio_operator';
export const ENGINEER = 'engineer';

export const all = [CAPTAIN, FIRST_MATE, RADIO_OPERATOR, ENGINEER];

export const getDisplayName = (role) => {
  switch (role) {
    case CAPTAIN:
      return 'Captain';
    case FIRST_MATE:
      return 'First Mate';
    case RADIO_OPERATOR:
      return 'Radio Operator';
    case ENGINEER:
      return 'Engineer';
  }
  throw new Error(`Invalid role: ${role}`);
};

export const getImageSrc = (role) => {
  switch (role) {
    case CAPTAIN:
      return 'Captain';
    case FIRST_MATE:
      return 'First Mate';
    case RADIO_OPERATOR:
      return 'Radio Operator';
    case ENGINEER:
      return 'Engineer';
  }
  throw new Error(`Invalid role: ${role}`);
};