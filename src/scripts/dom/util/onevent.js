/**
 * Listen on the specified even for its first element child,
 * and runs a certain callback when that event is triggered
 * Example:
 *   setup.DOM.Util.onEvent('change', element, () => {console.log("hi")})
 * 
 * If the target element has a 'value' field, will pass it as a parameter to the callback.
 * 
 * returns to_listen back, so it can be chained
 */

/**
 * @param {string} event
 * @param {setup.DOM.Attachable} children
 * @param {Function} callback 
 * 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.onEvent = function (event, children, callback) {
  const actions = {}
  actions[event] = (ev) => {
    if (ev.currentTarget && 'value' in ev.currentTarget) {
      callback(ev.currentTarget.value)
    } else {
      callback(ev)
    }
  }
  return setup.DOM.create(
    'span',
    actions,
    children
  )
}
