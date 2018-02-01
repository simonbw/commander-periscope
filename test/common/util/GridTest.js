import { List } from 'immutable';
import { EAST, NORTH, SOUTH } from '../../../src/common/Direction';
import { WEST } from '../../../src/common/Direction';
import {
  getDirection,
  getManhattanDistance, getNewLocation, isAdjacent} from '../../../src/common/Grid';
import expect from '../../expect';

describe('Grid', () => {
  it('.getNewLocation', () => {
    expect(() => getNewLocation(List([5, 5]), 'butts')).to.throw(); // invalid
    
    expect(getNewLocation(List([5, 5]), NORTH)).to.equal(List([5, 4]));
    expect(getNewLocation(List([5, 5]), SOUTH)).to.equal(List([5, 6]));
    expect(getNewLocation(List([5, 5]), EAST)).to.equal(List([6, 5]));
    expect(getNewLocation(List([5, 5]), WEST)).to.equal(List([4, 5]));
  });
  
  it('.getDirection', () => {
    expect(getDirection(List([5, 5]), List([9, 5]))).to.equal(EAST);
    expect(getDirection(List([5, 5]), List([5, 6]))).to.equal(SOUTH);
    expect(getDirection(List([5, 5]), List([5, 1]))).to.equal(NORTH);
    expect(getDirection(List([5, 5]), List([2, 5]))).to.equal(WEST);
    expect(getDirection(List([5, 5]), List([5, 5]))).to.equal(null);
  });
  
  it('.getManhattanDistance', () => {
    expect(getManhattanDistance(List([5, 5]), List([5, 5]))).to.equal(0);
    expect(getManhattanDistance(List([1, 1]), List([3, 1]))).to.equal(2);
    expect(getManhattanDistance(List([1, 1]), List([1, 3]))).to.equal(2);
    expect(getManhattanDistance(List([1, 1]), List([3, 3]))).to.equal(4);
  });
  
  it('.isAdjacent', () => {
    expect(isAdjacent(List([1, 1]), List([3, 3]))).to.equal(false);
    expect(isAdjacent(List([1, 1]), List([1, 3]))).to.equal(false);
    expect(isAdjacent(List([1, 1]), List([3, 1]))).to.equal(false);
    expect(isAdjacent(List([3, 1]), List([1, 1]))).to.equal(false);
    expect(isAdjacent(List([1, 3]), List([1, 1]))).to.equal(false);
    
    expect(isAdjacent(List([1, 1]), List([1, 1]))).to.equal(false);
    
    expect(isAdjacent(List([1, 1]), List([1, 2]))).to.equal(true);
    expect(isAdjacent(List([1, 1]), List([2, 1]))).to.equal(true);
    expect(isAdjacent(List([1, 1]), List([2, 2]))).to.equal(true);
  });
});