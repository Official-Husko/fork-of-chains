// @ts-nocheck

/*
Originally from:
http://twinery.org/forum/discussion/comment/17617/
*/

/**
 * Tooltip unit status, e.g., "busy icon"
 * This is slightly duplicated with setup.DOM.Card.unit, because there we want it inline,
 * while here we want it verbose.
 * @param {setup.Unit} unit
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.tooltipunitstatus= function(unit) {
  const fragments = []
  const unit_status = unit.busyInfo()
  fragments.push(html`
    <header>
      ${unit_status.icon} <b>${setup.capitalize(unit_status.title)}</b>
    </header>
  `)

  const quest = unit.getQuest()
  if (quest) {
    fragments.push(html`
      <div>
        Busy with ${quest.rep()}
      </div>
    `)
  }

  const opportunity = unit.getOpportunity()
  if (opportunity) {
    fragments.push(html`
      <div>
        Busy with ${opportunity.rep()}
      </div>
    `)
  }

  const is_on_leave = State.variables.leave.isOnLeave(unit)
  if (is_on_leave) {
    fragments.push(html`
      <div>
        ${setup.DOM.Card.leave(unit)}
      </div>
    `)
  }

  const is_injured = unit.isInjured()
  if (is_injured) {
    fragments.push(html`
      <div>
        Injured: ${setup.DOM.Card.injury(unit)}
      </div>
    `)
  }

  const duty = unit.getDuty()
  if (duty) {
    fragments.push(html`
      <div>
        Duty: ${duty.rep()}
      </div>
    `)
  }

  return setup.DOM.create(
    'div',
    {},
    fragments,
  )
}
