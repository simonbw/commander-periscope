import Immutable, { List } from 'immutable';
import { deepFind } from '../../../src/common/util/ImmutableUtil';
import expect from '../../expect';

describe('ImmutableUtil', () => {
  describe('.deepFind', () => {
    it('should work for maps', () => {
      const map = Immutable.fromJS({ a: 1, b: { c: 2, d: 3 }, e: 4 });
      
      expect(deepFind(map, 5)).to.equal(undefined);
      expect(deepFind(map, 1)).to.eql(List.of('a'));
      expect(deepFind(map, 3)).to.eql(List.of('b', 'd'));
    });
    it('should work for with lists', () => {
      const mapWithList = Immutable.fromJS({ a: 1, b: ['x', 3, 4, 'y'] });
      expect(deepFind(mapWithList, 5)).to.equal(undefined);
      expect(deepFind(mapWithList, 3)).to.eql(List.of('b', 1));
    });
  });
});
