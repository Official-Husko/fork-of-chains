// @ts-nocheck

/**
 * Formats friendship amount.
 * <<friendship>>
 * @param {number} friendship
 * @param {string} [prefix]  optional prefix text
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.friendship = function(friendship, prefix) {
  let dclass = ''
  if (friendship > 0) dclass = 'friendshipspanplus'
  if (friendship < 0) dclass = 'friendshipspanmin'

  return html`<span class="${dclass}">${prefix || ''}${(Math.abs(friendship) / 10).toFixed(1)}</span>`
}
