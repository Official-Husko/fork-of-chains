
/**
 * @param {setup.Job} job 
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.job = function(job, hide_actions) {
  return html`
  <span class='jobcard'>
    ${job.rep()}
  </span>
  `
}

