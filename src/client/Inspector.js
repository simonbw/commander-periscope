// Exists almost exclusively for integration tests
window._state = {};

export function inspect(oldState, newState, updaterFn) {
  window._state = newState;
  try {
    console.group(
      '%c statty%c ' + (updaterFn.name || 'Anonymous updater'),
      'color: #AAAAAA',
      'color: #001B44'
    )
  } catch (e) {
    console.log('action')
  }
  console.log('%c old state', 'color: #E7040F', oldState.toJS());
  console.log('%c new state', 'color: #19A974', newState.toJS());
  try {
    console.groupEnd()
  } catch (e) {
    console.log('== end ==')
  }
}