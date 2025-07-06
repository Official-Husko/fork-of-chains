// @ts-nocheck

/**
 * @param {string | number} money 
 * @returns {string}
 */
function formatMoney(money) {
  return Number(money).toLocaleString()
}

/**
 * Formats money. Also as <<money>>
 * @param {number} amount 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.money = function(amount) {
  let span_class = ''
  if (amount > 0) span_class = 'moneyspanplus'
  if (amount < 0) span_class = 'moneyspanmin'

  return setup.DOM.create('span', {class: span_class}, 
    `${formatMoney(amount)}g`,
  )
}

/**
 * Formats money but reverse the color. Also as <<moneyloss>>
 * @param {number} amount 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.moneyloss = function(amount) {
  let span_class = ''
  if (amount > 0) span_class = 'moneyspanmin'
  if (amount < 0) span_class = 'moneyspanplus'

  return setup.DOM.create('span', {class: span_class}, 
    `${formatMoney(amount)}g`,
  )
}
