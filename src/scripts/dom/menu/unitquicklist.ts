// @ts-nocheck

/*
Originally from:
http://twinery.org/forum/discussion/comment/17617/
*/

/**
 * Display list of units on the right sidebar on wide screens.
 * 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.unitquicklist = function () {
  const units = State.variables.company.player.getUnits({})
  // put slaver on top
  units.sort((a, b) => {
    if (a.isSlaver() && !b.isSlaver()) return -1
    if (b.isSlaver() && !a.isSlaver()) return 1
    return a.getName().localeCompare(b.getName())
  })

  return setup.DOM.Util.filterAll({
    menu: 'unitquick',
    filter_objects: units,
    display_callback: unit => html`
        <div>
          ${unit.isSlaver() ? unit.repBusyState(/* duty = */ true) : ''}${unit.repLong()}<span class='toprightspan'>${unit.getSubrace().rep()}</span>
        </div>
      `,
  })
}

