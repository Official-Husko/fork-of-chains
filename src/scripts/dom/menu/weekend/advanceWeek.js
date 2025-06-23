/**
 * @returns {setup.DOM.Node}
 */
export function advanceWeekBeforeResolvingQuests() {

  // advance quest timers
  for (const quest of State.variables.company.player.getQuests()) {
    quest.advanceQuestOneWeek()
  }

  for (const market of Object.values(State.variables.market)) {
    market.advanceWeek()
  }

  const to_advance_week = [
    State.variables.slaveorderlist,
    State.variables.contactlist,
    State.variables.opportunitylist,
    setup.Interaction,
    State.variables.dutylist,
    State.variables.leave,
    State.variables.hospital,
    State.variables.trauma,
    State.variables.favor,
  ]

  for (const to_advance of to_advance_week) {
    to_advance.advanceWeek()
  }

  return null
}

/**
 * @returns {setup.DOM.Node}
 */
function expireQuests() {
  const expired = State.variables.company.player.expireQuests()
  if (expired.length) {
    return html`
      ${setup.DOM.Util.message(
      `${expired.length} quests`,
      () => {
        return html`
            <div class='helpcard'>
              ${expired.map(quest => `<div>Quest ${quest.rep()} expired.</div>`)}
            </div>
          `
      },
    )}
      ${setup.DOM.Text.dangerlite('expired...')}
    `
  } else {
    return null
  }
}

/**
 * @returns {setup.DOM.Node}
 */
export function advanceWeekAfterResolvingQuests() {
  // quest generation is delayed until here
  State.variables.questgen.generate()

  State.variables.varstore.advanceWeek()
  State.variables.calendar.advanceWeek()

  for (const unit of Object.values(State.variables.unit)) {
    unit.advanceWeek()
  }

  const fragment = expireQuests()

  State.variables.unitimage.advanceWeek()
  setup.MarketItem.advanceWeek()
  State.variables.activitylist.advanceWeek()

  // auto-answer generated opportunities
  State.variables.opportunitylist.autoAnswer()

  return fragment
}
