/**
 * Formats level.
 * @param {number} prestige
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.prestige = function(prestige) {
  let spanclass = ''
  if (prestige > 0) {
    spanclass = 'prestigespanplus'
  } else if (prestige < 0) {
    spanclass = 'prestigespanmin'
  }
  return setup.DOM.create('span', {class: spanclass}, `${prestige} prestige`)
}
