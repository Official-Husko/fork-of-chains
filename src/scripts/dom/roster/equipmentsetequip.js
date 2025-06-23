import { menuItemAction, menuItemText } from "../../ui/menu"
import { setEquipmentSetOnUnit } from "../menu/equipmentsetpickequip"

/**
 * @param {setup.EquipmentSet} equipment_set
 * 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Roster.equipmentsetequip = function (equipment_set) {
  const units = State.variables.company.player.getUnits().filter(
    unit => unit.isCanWear(equipment_set) && unit.getEquipmentSet() != equipment_set
  )

  return setup.DOM.Roster.show({
    menu: 'unitequipmentset',
    units: units,
    actions_callback: (unit) => {
      const menus = []

      menus.push(
        menuItemAction({
          text: unit.getEquipmentSet() ? `Replace` : `Equip`,
          callback: () => {
            setEquipmentSetOnUnit(equipment_set, unit)
            setup.DOM.Nav.gotoreturn()
          },
        })
      )

      if (unit.getEquipmentSet()) {
        menus.push(
          menuItemText({
            text: unit.getEquipmentSet().rep(),
          })
        )
      }

      return menus
    },
  })
}

