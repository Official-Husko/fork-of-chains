// @ts-nocheck

/**
 * <<favor>>
 * Formats favor amount.
 * @param {'crit' | 'success' | 'failure' | 'disaster'} outcome
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.outcome = function (outcome) {
  if (outcome == 'crit') {
    return setup.DOM.Text.success('Critical Success')
  } else if (outcome == 'success') {
    return setup.DOM.Text.successlite('Success')
  } else if (outcome == 'failure') {
    return setup.DOM.Text.dangerlite('Failure')
  } else {
    return setup.DOM.Text.danger('Disaster')
  }
}
