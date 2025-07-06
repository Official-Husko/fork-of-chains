// @ts-nocheck

import { menuItemAction, menuItemText, menuItemTitle } from "../../ui/menu"

/**
 * @param {setup.EquipmentSet} equipment_set 
 * @param {setup.Unit} unit 
 */
export function setEquipmentSetOnUnit(equipment_set, unit) {
  if (unit.getEquipmentSet()) {
    // unequip own equipment first
    unit.getEquipmentSet().unequip()
  }

  if (equipment_set.getUnit()) {
    // uenquip  previous owner
    equipment_set.unequip()
  }

  equipment_set.equip(unit)
}

/**
 * Pick an equipment set to be equipped by a unit.
 * @param {setup.Unit} unit
 * 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.equipmentsetpickequip = function (unit) {
  const outer = []

  let replace = ''
  if (unit.getEquipmentSet()) {
    replace = `, replacing ${unit.getEquipmentSet().rep()}`
  }

  outer.push(html`
    <div>
      Select equipment set to equip on ${unit.rep()}${replace}:
      ${setup.DOM.Nav.return('(cancel)')}
    </div>
  `)

  if (State.variables.armory.isCanAddNewEquipmentSet()) {
    outer.push(html`
      <div>
        ${setup.DOM.Nav.link(
      `(create a new equipment set and equip it)`,
      () => {
        const set = State.variables.armory.newEquipmentSet()
        setEquipmentSetOnUnit(set, unit)
        setup.DOM.Nav.gotoreturn()
      },
    )}
      </div>
    `)
  }

  let sets = State.variables.armory.getEquipmentSets()

  const eligibility = State.variables.menufilter.get('equipmentsetpickequip', 'eligibility')
  if (eligibility == 'all') {
  } else if (eligibility == 'not') {
    sets = sets.filter(set => !unit.isCanWear(set))
  } else {
    sets = sets.filter(set => unit.isCanWear(set))
  }

  outer.push(setup.DOM.Util.filterAll({
    menu: 'equipmentsetpickequip',
    filter_objects: sets,
    display_callback: (equipment_set) => {
      const fragments = []

      // get the menu
      const menu = []
      menu.push(menuItemTitle({
        text: equipment_set.rep()
      }))

      if (equipment_set == unit.getEquipmentSet()) {
        menu.push(menuItemText({
          text: `Already wearing this`
        }))
      } else if (!unit.isCanWear(equipment_set)) {
        menu.push(menuItemText({
          text: `Not eligible`
        }))
      } else {
        menu.push(menuItemAction({
          text: equipment_set.getUnit() ? `Replace` : `Equip`,
          callback: () => {
            setEquipmentSetOnUnit(equipment_set, unit)
            setup.DOM.Nav.gotoreturn()
          },
        }))
      }

      if (equipment_set.getUnit()) {
        menu.push(menuItemText({
          text: equipment_set.getUnit().rep()
        }))
      }

      fragments.push(setup.DOM.Util.menuItemToolbar(menu))

      if (State.variables.menufilter.get('equipmentsetpickequip', 'display') == 'compact') {
        // don't add any other extra info
      } else {
        // append set info
        fragments.push(setup.DOM.Card.equipmentset(equipment_set, /* hide actions = */ true))
      }

      return setup.DOM.create('div', {}, fragments)
    },
  }))

  return setup.DOM.create('div', {}, outer)
}

