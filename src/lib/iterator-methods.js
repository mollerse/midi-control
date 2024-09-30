/**
 * @template T
 * @param {(el: T) => boolean} findFn
 * @param {IterableIterator<T>} iterator
 * @returns {T=}
 */
export function find(findFn, iterator) {
  let { value, done } = iterator.next();
  while (!done) {
    if (findFn(value)) return value;

    ({ value, done } = iterator.next());
  }
}

/**
 * @template T,V
 * @param {(el: T) => V} mapFn
 * @param {IterableIterator<T>} iterator
 * @returns {V[]}
 */
export function map(mapFn, iterator) {
  let ret = /** @type {V[]} */ ([]);
  let { value, done } = iterator.next();
  while (!done) {
    let v = mapFn(value);
    ret.push(v);

    ({ value, done } = iterator.next());
  }

  return ret;
}
