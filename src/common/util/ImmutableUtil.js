import * as Immutable from 'immutable/dist/immutable';
import { BREAKDOWNS, PLAYERS, READIED } from '../StateFields';

export function deepFind(root, value, path = Immutable.List()) {
  if (root === value) {
    return path;
  }
  
  if (!Immutable.isImmutable(root)) { // this is a leaf node, and it's not the value we want.
    return undefined;
  }
  
  for (const [key, child] of root.toKeyedSeq()) {
    const result = deepFind(child, value, path.push(key));
    if (result) {
      return result;
    }
  }
  
  // no path is found
  return undefined;
}

export const jsonToImmutable = (json) => (
  Immutable.fromJS(json, (key, value) => {
    switch (key) {
      case READIED:
      case PLAYERS:
      case BREAKDOWNS:
        return value.toSet();
      default:
        return Immutable.Iterable.isKeyed(value) ? value.toMap() : value.toList()
    }
  })
);
