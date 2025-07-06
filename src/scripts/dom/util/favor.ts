// @ts-nocheck

/**
 * @param {number} favor 
 * @returns {string}
 */
export function repFavor(favor) {
  return (favor / 10).toFixed(1)
}

/**
 * <<favor>>
 * Formats favor amount.
 * @param {number} favor
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.favor = function (favor) {
  const base_text = repFavor(favor)
  if (favor > 0) {
    return setup.DOM.Text.successlite(base_text)
  } else if (favor < 0) {
    return setup.DOM.Text.dangerlite(base_text)
  } else {
    return html`${base_text}`
  }
}
