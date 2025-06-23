/**
 * Format a table.
 * 
 * @param {Array<Array<setup.DOM.Node>>} entries
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.table = function (entries) {
  const rows = []
  for (const entry_row of entries) {
    rows.push(setup.DOM.create('tr', {}, entry_row.map(node => setup.DOM.create('td', {}, node))))
  }
  return setup.DOM.create('table', { class: 'table' }, setup.DOM.create('tbody', {}, rows))
}
