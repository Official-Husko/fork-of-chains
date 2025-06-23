/**
 * Twine-parse a passage and returns it as a node. Replace unit macros too.
 * <<include>>
 * 
 * @param {string} passage
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.include_replace = function(passage) {
  if (!Story.has(passage)) {
    throw new Error(`passage "${passage}" does not exist`)
  }

  return setup.DOM.Util.replaceUnitInFragment(setup.DOM.Util.include(passage))
}
