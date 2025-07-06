// @ts-nocheck

import { menuItemAction, menuItemDanger, menuItemExtras, menuItemText, menuItemTitle } from "../../ui/menu"
import { domCardRep } from "../util/cardnamerep"

/**
 * @param {setup.Party} party
 * @returns {setup.DOM.Node}
 */
function partyNameFragment(party) {
  return html`${domCardRep(party)}`
}

/**
 * @param {setup.Party} party
 * @param {boolean} hide_actions 
 * @returns {JQLite[]}
 */
function partyNameActionMenu(party, hide_actions) {
  /**
   * @type {JQLite[]}
   */
  const menus = []
  /**
   * @type {JQLite[]}
   */
  const extras = []

  menus.push(menuItemTitle({
    text: partyNameFragment(party),
  }))

  if (!hide_actions) {
    menus.push(menuItemAction({
      text: `Add unit`,
      tooltip: `Assign units to this party`,
      callback: () => {
        // @ts-ignore
        State.variables.gPartySelected_key = party.key
        setup.DOM.Nav.goto('PartyAddUnit')
      },
    }))
  }

  // auto assign picker
  const auto_assign_param = {
    text: `<span data-tooltip="If checked, then units on this party CAN be selected to go on quests by quest auto-assign. Regardless of this settings, the units can always be selected when using manual unit assignment.">Auto-assign pickable</span>`,
    checked: party.isCanGoOnQuestsAuto(),
  }

  if (hide_actions) {
    menus.push(menuItemText(auto_assign_param))
  } else {
    auto_assign_param.callback = () => {
      party.toggleIsCanGoOnQuestsAuto()
      setup.DOM.Nav.goto()
    }
    menus.push(menuItemAction(auto_assign_param))
  }

  if (!hide_actions) {
    extras.push(menuItemAction({
      text: `Rename`,
      tooltip: `Change this party's name`,
      callback: () => {
        // @ts-ignore
        State.variables.gParty_key = party.key
        setup.DOM.Nav.goto('PartyNameChange')
      },
    }))

    if (party.isCanDisband()) {
      extras.push(menuItemDanger({
        text: `Disband`,
        tooltip: `Delete this party`,
        callback: () => {
          State.variables.partylist.removeParty(party)
          setup.DOM.Nav.goto()
        },
      }))
    } else {
      extras.push(menuItemText({
        text: `Remove all units to disband`,
      }))
    }
  }

  if (extras.length) {
    menus.push(menuItemExtras({
      children: extras,
    }))
  }

  return menus
}

/**
 * @param {setup.Party} party 
 * @param {setup.Unit} unit 
 */
function removeUnitCallback(party, unit) {
  return () => {
    party.removeUnit(unit)
    setup.DOM.Nav.goto()
  }
}

/**
 * @param {setup.Party} party
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.party = function (party, hide_actions) {
  const fragments = []

  fragments.push(
    setup.DOM.Util.menuItemToolbar(partyNameActionMenu(party, hide_actions))
  )

  for (const unit of party.getUnits()) {
    fragments.push(html`
      <div>
        ${setup.DOM.Util.level(unit.getLevel())}
        ${unit.repLong()}
        ${!hide_actions && setup.DOM.Nav.link(
      `(remove)`,
      removeUnitCallback(party, unit)
    )}
      </div>
    `)
  }

  return setup.DOM.create('div', { class: 'partycard card' }, fragments,)
}


/**
 * @param {setup.Party} party
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.partycompact = function (party, hide_actions) {
  return setup.DOM.Util.menuItemToolbar(partyNameActionMenu(party, hide_actions))
}
