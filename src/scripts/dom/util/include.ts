// @ts-nocheck

/**
 * Twine-parse a passage and returns it as a node.
 * <<include>>
 * 
 * @param {string} passage
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.include = function (passage) {
  if (!Story.has(passage)) {
    throw new Error(`Passage "${passage}" does not exist`)
  }

  const passage_content = Story.get(passage)

  const fragment = document.createDocumentFragment()
  new Wikifier(fragment, passage_content.processText())
  return fragment
}

