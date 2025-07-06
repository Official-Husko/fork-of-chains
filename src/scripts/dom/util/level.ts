// @ts-nocheck

/**
 * Formats level.
 * @param {number} level
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.level = function(level) {
  return html`
    Lv. <span class='levelspan'>${level}</span>
  `
}
