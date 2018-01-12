import { List } from 'immutable';
import { NORTH } from '../../../src/common/Direction';
import { getManhattanDistance, getNewLocation, isAdjacent } from '../../../src/common/Grid';
import expect from '../../expect';

describe('Grid', () => {
  it('.getNewLocation', () => {
    expect(getNewLocation(List([5, 5]), NORTH)).to.equal(List([5, 4]));
  });
  
  it('.getManhattanDistance', () => {
    expect(getManhattanDistance(List([5, 5]), List([5, 5]))).to.equal(0);
    expect(getManhattanDistance(List([1, 1]), List([3, 1]))).to.equal(2);
    expect(getManhattanDistance(List([1, 1]), List([1, 3]))).to.equal(2);
    expect(getManhattanDistance(List([1, 1]), List([3, 3]))).to.equal(4);
  });
  
  it('.isAdjacent', () => {
    expect(isAdjacent(List([1, 1]), List([3, 3]))).to.be.false;
    expect(isAdjacent(List([1, 1]), List([1, 1]))).to.be.false;
    expect(isAdjacent(List([1, 1]), List([1, 2]))).to.be.true;
    expect(isAdjacent(List([1, 1]), List([2, 1]))).to.be.true;
    expect(isAdjacent(List([1, 1]), List([2, 2]))).to.be.true;
  });
});