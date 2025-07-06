// @ts-nocheck

import { menuItemAction, menuItemDanger, menuItemExtras, menuItemText, menuItemTitle } from "../../ui/menu"
import { domCardRep } from "../util/cardnamerep"

/**
 * @param {setup.Item} item 
 * @returns {setup.DOM.Node}
 */
function itemNameFragment(item) {
  const owned = item.getOwnedNumber()
  return html`
    ${domCardRep(item)}
    x ${owned}
  `
}

/**
 * @param {setup.Item} item
 * @param {boolean} hide_actions 
 * @returns {JQLite[]}
 */
function itemNameActionMenu(item, hide_actions) {
  /**
   * @type {JQLite[]}
   */
  const menus = []

  menus.push(menuItemTitle({
    text: itemNameFragment(item),
  }))

  const value = item.getValue()
  if (value) {
    menus.push(menuItemText({
      text: setup.DOM.Util.money(value)
    }))
  }

  if (!hide_actions && item.isUsable()) {
    menus.push(menuItemAction({
      text: `Use`,
      tooltip: `Consume this item to use its effect`,
      callback: () => {
        if (item instanceof setup.ItemUnitUsable) {
          // @ts-ignore
          State.variables.gUseItem_key = item.key
          setup.DOM.Nav.goto('ItemUnitUsableUse')
        } else if (item instanceof setup.ItemUsable) {
          item.use()
          setup.DOM.Nav.goto()
        }
      }
    }))
  }

  const sell_value = item.getSellValue()
  if (!hide_actions &&
    sell_value &&
    State.variables.fort.player.isHasBuilding(setup.buildingtemplate.bazaar)) {
    menus.push(menuItemDanger({
      text: html`Sell (${setup.DOM.Util.money(sell_value)})`,
      tooltip: `Sell this item for a profit`,
      callback: () => {
        State.variables.inventory.sell(item)
        setup.DOM.Nav.goto()
      }
    }))
  }

  const extras = []
  if (State.variables.gDebug) {
    extras.push(menuItemDanger({
      text: '(Debug) Remove',
      callback: () => {
        State.variables.inventory.removeItem(item)
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
 * @param {setup.Item} item 
 * @returns {setup.DOM.Node}
 */
function itemDescriptionFragment(item) {
  return html`${setup.runSugarCubeCommandAndGetOutput(item.getDescription())}`
}

/**
 * @param {setup.Item} item
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.item = function (item, hide_actions) {
  const fragments = []

  // async here?
  fragments.push(setup.DOM.Util.menuItemToolbar(
    itemNameActionMenu(item, hide_actions),
  ))

  if (item instanceof setup.Furniture) {
    const explanation = setup.SkillHelper.explainSkills(item.getSkillMods())
    fragments.push(html`
      <div>${explanation}</div>
    `)
  }

  if (item instanceof setup.ItemUsable) {
    // @ts-ignore
    const restrictions = item.getPrerequisites()
    fragments.push(setup.DOM.Card.restriction(restrictions))
  }

  if (item instanceof setup.ItemUnitUsable) {
    // @ts-ignore
    const restrictions = item.getUnitRestrictions()
    fragments.push(setup.DOM.Card.restriction(restrictions, null, /* show all = */ true))
  }

  const shorten_desc = !hide_actions && State.variables.menufilter.get('item', 'display') == 'short'
  if (shorten_desc) {
    fragments.push(setup.DOM.create('div', {}, setup.DOM.Util.message('(description)', () => {
      return itemDescriptionFragment(item)
    })))
  } else {
    fragments.push(setup.DOM.create('div', {}, itemDescriptionFragment(item)))
  }

  const divclass = `card itemcard`
  return setup.DOM.create(
    'div',
    { class: divclass },
    fragments,
  )
}

/**
 * @param {setup.Item} item
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.itemcompact = function (item, hide_actions) {
  return setup.DOM.Util.menuItemToolbar(
    itemNameActionMenu(item, hide_actions),
  )
}


