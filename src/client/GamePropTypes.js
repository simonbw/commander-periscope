import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ALL_DIRECTIONS } from '../common/models/Direction';

export const LocationPropType = ImmutablePropTypes.listOf(PropTypes.number);
export const GridPropType = ImmutablePropTypes.listOf(ImmutablePropTypes.listOf(PropTypes.number));
export const LocationListPropType = ImmutablePropTypes.listOf(LocationPropType);
export const DirectionPropType = PropTypes.oneOf(ALL_DIRECTIONS);
