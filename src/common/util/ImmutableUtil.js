import Immutable from 'immutable';

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

export const createList = (length, value = undefined) => {
  return Immutable.List(new Array(length).fill(value));
};

export const createRange = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return Immutable.List(result);
};