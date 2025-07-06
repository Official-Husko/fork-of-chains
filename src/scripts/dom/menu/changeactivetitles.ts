// @ts-nocheck

/**
 * @param {setup.Unit} unit
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.changeactivetitles = function (unit) {
  const fragments = []
  fragments.push(html`
    <div>
      Change ${unit.rep()}'s active titles.
      ${setup.DOM.Util.help(html`
        <p>
          While a unit can have multiple titles, they can only have at most four active at any time:
          two titles that you can freely choose, plus their last obtained positive and negative title.
          Amongst the positive titles, only these active titles will confer their benefits
          (i.e., skill boosts).
          All negative titles will confer their penalties, however, regardless of whether they are
          active or not, but their penalties don't stack (i.e., only the highest value of each
          skill counts).
        </p>
        <p>
          Note that for the purpose of the story,
          the unit is still considered to have all the other titles, including inactive ones.
          They just won't confer their skill bonuses.
        </p>
      `)}
    </div>
  `)
  fragments.push(setup.DOM.Card.unit(unit, /* hide actions = */ true))

  const last = State.variables.titlelist.getLastTitlePositive(unit)
  const last_negative = State.variables.titlelist.getLastTitleNegative(unit)
  if (last || last_negative) {
    fragments.push(html`
      <div>
        Last obtained title${(last && last_negative) ? 's' : ''}:
        ${setup.DOM.Util.help(html`
          The last obtained positive and negative titles are always included as one of the unit's active titles, regardless of whether
          they are chosen below or not.
        `)}
        ${last ? last.rep() : ''}
        ${last_negative ? last_negative.rep() : ''}
      </div>
    `)
  }

  const assigned = State.variables.titlelist.getAssignedTitles(unit, /* base only = */ true)
  assigned.forEach(title => {
    fragments.push(html`
      <div>
        ${title.rep()}
        ${setup.DOM.Nav.link(
      `(Change active title)`,
      () => {
        setup.DevToolHelper.pickTitle(
          State.variables.titlelist.getAssignableTitles(unit),
        ).then(picked => {
          if (picked) {
            State.variables.titlelist.unassignTitle(unit, title)
            State.variables.titlelist.assignTitle(unit, picked)
            setup.DOM.Nav.goto()
          }
        })
      }
    )}
      </div>
    `)
  })

  fragments.push(html`<div>${setup.DOM.Nav.return('(finish)')}</div>`)
  setup.DOM.Nav.topLeftNavigation(setup.DOM.Nav.return('Finish'))
  return setup.DOM.create('div', {}, fragments)
}
