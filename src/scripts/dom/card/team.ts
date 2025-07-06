// @ts-nocheck

import { menuItemDanger, menuItemExtras, menuItemText, menuItemTitle } from "../../ui/menu"
import { domCardRep } from "../util/cardnamerep"

/**
 * @param {setup.Team} team
 * @returns {setup.DOM.Node}
 */
function teamNameFragment(team) {
  return html`${domCardRep(team)}`
}


/**
 * @param {setup.Team} team
 * @returns {setup.DOM.Node}
 */
function teamStatusFragment(team) {
  if (team.getQuest()) {
    return html`
      <span data-tooltip="<<questcardkey '${team.getQuest().key}' 1>>">
        ${setup.DOM.Text.dangerlite(`[Quest]`)}
      </span>
    `
  }
  return html``
}


/**
 * @param {setup.Team} team
 * @param {boolean} hide_actions 
 * @returns {JQLite[]}
 */
function teamNameActionMenu(team, hide_actions) {
  /**
   * @type {JQLite[]}
   */
  const menus = []
  /**
   * @type {JQLite[]}
   */
  const extras = []

  menus.push(menuItemTitle({
    text: teamNameFragment(team),
  }))
  const status = teamStatusFragment(team)
  if (status) {
    menus.push(menuItemText({
      text: status,
    }))
  }

  const quest = team.getQuest()
  if (quest && !hide_actions && quest.isCanChangeTeam()) {
    menus.push(menuItemDanger({
      text: `Cancel quest`,
      tooltip: `Cancel this quest team assignment`,
      callback: () => {
        quest.cancelAssignTeam()
        setup.DOM.Nav.goto()
      },
    }))
  }

  if (extras.length) {
    menus.push(menuItemExtras({
      children: extras,
    }))
  }

  return menus
}


/**
 * @param {setup.Team} team 
 * @param {setup.Unit} unit 
 */
function removeUnitCallback(team, unit) {
  return () => {
    team.removeUnit(unit)
    setup.DOM.Nav.goto()
  }
}


/**
 * @param {setup.Team} team
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.team = function (team, hide_actions) {
  const fragments = []

  fragments.push(
    setup.DOM.Util.menuItemToolbar(teamNameActionMenu(team, hide_actions))
  )

  const quest = team.getQuest()
  if (quest) {
    const inner = []
    inner.push(html`
      On ${quest.rep()} for ${quest.getRemainingWeeks()} more weeks.
    `)
    fragments.push(setup.DOM.create('div', {}, inner))
  }

  for (const unit of team.getUnits()) {
    fragments.push(html`
      <div>
        ${setup.DOM.Util.level(unit.getLevel())}
        ${unit.repLong()}
        ${!hide_actions && !team.getQuest() && setup.DOM.Nav.link(
      `(remove)`,
      removeUnitCallback(team, unit)
    )}
      </div>
    `)
  }

  return setup.DOM.create('div', { class: 'teamcard' }, fragments,)
}


/**
 * @param {setup.Team} team
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.teamcompact = function (team, hide_actions) {
  return setup.DOM.Util.menuItemToolbar(teamNameActionMenu(team, hide_actions))
}
