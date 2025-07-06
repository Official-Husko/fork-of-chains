// @ts-nocheck

/**
 * Formats object's name. <<nameof>>
 * @param {object} object
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.namebold = function(object) {
  return html`
    <span class='namespan'>${object.getName()}</span>
  `
}


/**
 * Formats object's name. <<nameof>>
 * @param {object} object
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.name = function(object) {
  return html`${object.getName()}`
}
