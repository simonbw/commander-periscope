import Immutable from 'immutable';
import { ALL_DIRECTIONS, EAST, NORTH, SOUTH, WEST } from '../../common/Direction';
import { ID } from '../../common/fields/GameFields';
import {
  CIRCUIT, CIRCUITS, COMMS, DIRECTION, NUCLEAR, SPECIAL, SYSTEM_TYPE, SYSTEM_TYPES, WEAPONS
} from '../../common/System';

export function createRandomSubsystems() {
  // TODO: Deterministic random
  // TODO: Probably some more constraints/balancing
  const circuits = Immutable
    .List(CIRCUITS)
    .flatMap(circuit => Immutable.Repeat(circuit, 4)) // TODO: Maybe don't hardcode these numbers?
    .sortBy(Math.random);
  return Immutable.List(SYSTEM_TYPES)
    .flatMap(systemType => Immutable.Repeat(systemType, 6))
    .sortBy(Math.random)
    .map((systemType, i) => Immutable.Map({
      [ID]: i,
      [SYSTEM_TYPE]: systemType,
      [DIRECTION]: ALL_DIRECTIONS[i % ALL_DIRECTIONS.length],
      [CIRCUIT]: i < 12 ? circuits.get(i) : null
    }));
}

export function createStandardSubsystems() {
  return Immutable.fromJS([{
    [ID]: 0,
    [DIRECTION]: WEST,
    [SYSTEM_TYPE]: WEAPONS,
    [CIRCUIT]: 1
  }, {
    [ID]: 1,
    [DIRECTION]: WEST,
    [SYSTEM_TYPE]: SPECIAL,
    [CIRCUIT]: 1
  }, {
    [ID]: 2,
    [DIRECTION]: WEST,
    [SYSTEM_TYPE]: COMMS,
    [CIRCUIT]: 1
  }, {
    [ID]: 3,
    [DIRECTION]: WEST,
    [SYSTEM_TYPE]: COMMS,
    [CIRCUIT]: null
  }, {
    [ID]: 4,
    [DIRECTION]: WEST,
    [SYSTEM_TYPE]: NUCLEAR,
    [CIRCUIT]: null
  }, {
    [ID]: 5,
    [DIRECTION]: WEST,
    [SYSTEM_TYPE]: NUCLEAR,
    [CIRCUIT]: null
  }, {
    [ID]: 6,
    [DIRECTION]: NORTH,
    [SYSTEM_TYPE]: SPECIAL,
    [CIRCUIT]: 2
  }, {
    [ID]: 7,
    [DIRECTION]: NORTH,
    [SYSTEM_TYPE]: WEAPONS,
    [CIRCUIT]: 2
  }, {
    [ID]: 8,
    [DIRECTION]: NORTH,
    [SYSTEM_TYPE]: SPECIAL,
    [CIRCUIT]: 2
  }, {
    [ID]: 9,
    [DIRECTION]: NORTH,
    [SYSTEM_TYPE]: COMMS,
    [CIRCUIT]: null
  }, {
    [ID]: 10,
    [DIRECTION]: NORTH,
    [SYSTEM_TYPE]: WEAPONS,
    [CIRCUIT]: null
  }, {
    [ID]: 11,
    [DIRECTION]: NORTH,
    [SYSTEM_TYPE]: NUCLEAR,
    [CIRCUIT]: null
  }, {
    [ID]: 12,
    [DIRECTION]: SOUTH,
    [SYSTEM_TYPE]: COMMS,
    [CIRCUIT]: 3
  }, {
    [ID]: 13,
    [DIRECTION]: SOUTH,
    [SYSTEM_TYPE]: SPECIAL,
    [CIRCUIT]: 3
  }, {
    [ID]: 14,
    [DIRECTION]: SOUTH,
    [SYSTEM_TYPE]: WEAPONS,
    [CIRCUIT]: 3
  }, {
    [ID]: 15,
    [DIRECTION]: SOUTH,
    [SYSTEM_TYPE]: WEAPONS,
    [CIRCUIT]: null
  }, {
    [ID]: 16,
    [DIRECTION]: SOUTH,
    [SYSTEM_TYPE]: NUCLEAR,
    [CIRCUIT]: null
  }, {
    [ID]: 17,
    [DIRECTION]: SOUTH,
    [SYSTEM_TYPE]: SPECIAL,
    [CIRCUIT]: null
  }, {
    [ID]: 18,
    [DIRECTION]: EAST,
    [SYSTEM_TYPE]: COMMS,
    [CIRCUIT]: 2
  }, {
    [ID]: 19,
    [DIRECTION]: EAST,
    [SYSTEM_TYPE]: SPECIAL,
    [CIRCUIT]: 3
  }, {
    [ID]: 20,
    [DIRECTION]: EAST,
    [SYSTEM_TYPE]: WEAPONS,
    [CIRCUIT]: 1
  }, {
    [ID]: 21,
    [DIRECTION]: EAST,
    [SYSTEM_TYPE]: NUCLEAR,
    [CIRCUIT]: null
  }, {
    [ID]: 22,
    [DIRECTION]: EAST,
    [SYSTEM_TYPE]: COMMS,
    [CIRCUIT]: null
  }, {
    [ID]: 23,
    [DIRECTION]: EAST,
    [SYSTEM_TYPE]: NUCLEAR,
    [CIRCUIT]: null
  },]);
}