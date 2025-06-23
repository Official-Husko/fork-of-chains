
/**
 * Explain a cost array.
 * <<costcard>>
 * 
 * @param {Array<setup.Cost>} costs
 * @param {any} [obj]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.cost = function(costs, obj) {
  return html`
    <span class='restrictioncard'>
      ${costs.map(cost => cost.explain(obj)).filter(explanation => explanation).join(' | ')}
    </span>
  `
}

