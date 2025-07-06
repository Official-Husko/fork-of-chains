// @ts-nocheck

/**
 * @param {setup.DOM.Node} fragment 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.replaceUnitInFragment = function (fragment) {
  let last_text = '';

  [fragment,
    ...fragment.querySelectorAll("*:not(script):not(noscript):not(style)")
  ].reverse().forEach(
    ({ childNodes: [...nodes] }) => nodes
      .filter(({ nodeType }) => nodeType === document.TEXT_NODE)
      .reverse()
      .forEach((textNode) => {
        textNode.textContent = setup.Text.fixArticles(setup.Text.replaceUnitMacros(textNode.textContent), last_text)
        if (textNode.textContent.trim()) {
          last_text = textNode.textContent
        }
      })
  )

  return fragment
}

/**
 * String to twine fragment
 * 
 * @param {string} twine_string
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.twine = function (twine_string) {
  const fragment = document.createDocumentFragment()
  new Wikifier(fragment, setup.DevToolHelper.stripNewLine(twine_string));
  return fragment
}

