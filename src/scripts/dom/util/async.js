 /**
  * Returns a node that will be filled with children asynchronously.
  * <<foctimed>>
  * 
  * @callback nodeCallback
  * @returns {setup.DOM.Node}
  * 
  * @param {nodeCallback} callback
  * @param {boolean} [transition]
  * @returns {setup.DOM.Node}
  */
setup.DOM.Util.async = function(callback, transition) {

  if (State.temporary.foctimed_is_tooltip) {
    return setup.DOM.create(
      'span',
      {},
      callback(),
    )
  }

  let eleclass = ''
  if (transition) {
    eleclass = 'macro-timed-insert macro-timed-in'
  }

  const element = setup.DOM.create(
    'span',
    {class: eleclass},
    [],
  )

  setTimeout(() => {
    const node = callback()
    element.append(node)
  }, 1)

  if (transition) {
    setTimeout(() => $(element).removeClass('macro-timed-in'), Engine.minDomActionDelay);
  }

  return element
}

