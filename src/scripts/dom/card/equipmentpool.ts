// @ts-nocheck

import { menuItemAction, menuItemDanger, menuItemExtras, menuItemText, menuItemTitle } from "../../ui/menu"
import { domCardRep } from "../util/cardnamerep"

/**
 * @param {setup.EquipmentPool | setup.EquipmentPoolGroup} pool
 * @returns {setup.DOM.Node}
 */
function equipmentPoolNameFragment(pool) {
  return html`${domCardRep(pool)}`
}

/**
 * @param {setup.EquipmentPool | setup.EquipmentPoolGroup} pool
 * @param {boolean} hide_actions 
 * @returns {JQLite[]}
 */
function equipmentPoolNameActionMenu(pool, hide_actions) {
  /**
   * @type {JQLite[]}
   */
  const menus = []

  menus.push(menuItemTitle({
    text: equipmentPoolNameFragment(pool),
  }))

  const average_value = pool.getAverageValue()
  menus.push(menuItemText({
    text: html`Average value: ${setup.DOM.Util.money(average_value)}`
  }))

  const extras = []

  if (extras.length) {
    menus.push(menuItemExtras({
      children: extras,
    }))
  }

  return menus
}


/**
 * @param {setup.EquipmentPool | setup.EquipmentPoolGroup} pool
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.equipmentpool = function (pool, hide_actions) {
  const fragments = []

  fragments.push(setup.DOM.Util.menuItemToolbar(
    equipmentPoolNameActionMenu(pool, hide_actions),
  ))

  if (pool instanceof setup.EquipmentPoolGroup) {
    for (const [pool_key, chance] of pool.getEquipmentPoolChances(/* normalize = */ true)) {
      fragments.push(html`
        <div>
          ${setup.equipmentpool[pool_key].rep()}: ${setup.DOM.Text.percentage(chance)}
        </div>
      `)
    }
  } else if (pool instanceof setup.EquipmentPool) {
    for (const [equipment_key, chance] of pool.getEquipmentChances(/* normalize = */ true)) {
      fragments.push(html`
        <div>
          ${setup.equipment[equipment_key].rep()}: ${setup.DOM.Text.percentage(chance)}
        </div>
      `)
    }
  } else {
    throw new Error(`Unknown equipment pool/group: ${pool}`)
  }

  const divclass = `card equipmentcard`
  return setup.DOM.create(
    'div',
    { class: divclass },
    fragments,
  )
}
