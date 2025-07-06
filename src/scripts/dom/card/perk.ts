// @ts-nocheck

import { menuItemAction, menuItemExtras, menuItemText, menuItemTitle } from "../../ui/menu"
import { getTraitEtcFragment } from "./trait"

/**
 * @param {setup.Perk} perk
 * @param {setup.Unit} unit
 * @returns {setup.DOM.Node}
 */
function perkNameFragment(perk, unit) {
  return html`${perk.repFull()}${State.variables.gDebug ? ` (key: '${perk.key}')` : ''}`
}

/**
 * @param {setup.Perk} perk
 * @param {setup.Unit} unit
 * @param {boolean} hide_actions 
 * @returns {JQLite[]}
 */
function perkNameActionMenu(perk, unit, hide_actions) {
  /**
   * @type {JQLite[]}
   */
  const menus = []
  /**
   * @type {JQLite[]}
   */
  const extras = []

  menus.push(menuItemTitle({
    text: perkNameFragment(perk, unit),
  }))

  if (!hide_actions) {
    if (unit.getLearnablePerks().includes(perk)) {
      menus.push(menuItemAction({
        text: `Learn`,
        callback: () => {
          unit.addTrait(perk)
          if (!unit.isCanLearnNewPerk()) {
            setup.DOM.Nav.gotoreturn()
          } else {
            setup.DOM.Nav.goto()
          }
        },
      }))
    } else {
      menus.push(menuItemText({
        text: `Limit reached`,
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
 * @param {setup.Perk} perk
 * @param {setup.Unit} [unit]
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.perk = function (perk, unit, hide_actions) {
  const fragments = []

  fragments.push(
    setup.DOM.Util.menuItemToolbar(perkNameActionMenu(perk, unit, hide_actions))
  )

  fragments.push(html`
    <div>
      ${getTraitEtcFragment(perk)}
    </div>
  `)

  let perkclass
  if (unit.getLearnablePerks().includes(perk)) {
    perkclass = 'perkcard'
  } else {
    perkclass = 'perkcardinactive'
  }

  return setup.DOM.create('div', { class: `${perkclass} card` }, fragments)
}
