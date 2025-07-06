// @ts-nocheck

import { up, down } from "./AAA_filter"
import { MenuFilterHelper } from "./filterhelper"

function getEquipmentSlotFilter(equipment_slot_key) {
  return equipment => equipment.getSlot().key == equipment_slot_key
}

function getEquipmentSlotFilters() {
  const options = []

  for (const equipment_slot of Object.values(setup.equipmentslot)) {
    options.push({
      title: equipment_slot.getImageRep(),
      filter: getEquipmentSlotFilter(equipment_slot.key),
    })
  }

  return options
}

/**
 * @param {number} skill_key 
 * @returns {Function}
 */
function getSkillModSort(skill_key) {
  const skill = setup.skill[skill_key]
  return (a, b) => b.getSkillMod(skill) - a.getSkillMod(skill)
}

function getSkillModsSort() {
  const base = {}

  for (const skill of setup.skill) {
    base[skill.keyword] = {
      title: skill.getImageRep(),
      sort: getSkillModSort(skill.key),
      filter: a => a.getSkillMod(skill) > 0,
    }
  }
  return base
}


setup.MenuFilter._MENUS.equipment = {
  sextoy: {
    title: 'Class',
    default: 'All',
    icon_menu: true,
    options: () => {
      return {
        sex: {
          title: setup.Equipment.repSexIcon(),
          filter: equipment => equipment.getTags().includes('sextoy'),
        },
        nonsex: {
          title: setup.Equipment.repNonSexIcon(),
          filter: equipment => !equipment.getTags().includes('sextoy'),
        },
      }
    },
  },
  type: {
    title: 'Type',
    default: 'All',
    icon_menu: true,
    options: getEquipmentSlotFilters,
  },
  rarity: {
    title: 'Rarity',
    default: 'All',
    icon_menu: true,
    options: MenuFilterHelper.rarityFilters,
  },
  sortskill: {
    title: 'Skill',
    default: 'All',
    options: getSkillModsSort,
  },
  sort: {
    title: 'Sort',
    default: down('Default'),
    options: {
      namedown: MenuFilterHelper.namedown,
      nameup: MenuFilterHelper.nameup,
      valuedown: MenuFilterHelper.valuedown,
      valueup: MenuFilterHelper.valueup,
      sluttinessdown: MenuFilterHelper.sluttinessdown,
      sluttinessup: MenuFilterHelper.sluttinessup,
      raritydown: MenuFilterHelper.raritydown,
      rarityup: MenuFilterHelper.rarityup,
    }
  },
  display: {
    title: 'Display',
    default: 'Full',
    hardreload: true,
    options: {
      compact: {
        title: 'Compact',
      },
    }
  },
}

setup.MenuFilter._MENUS.equipmentmarket = {}
/*
  availability: {
    title: 'Availability',
    default: 'All',
    hardreload: true,
    options: {
      limited: {
        title: 'Limited only',
      },
      unlimited: {
        title: 'Unlimited only',
      },
    }
  }
}
*/

setup.MenuFilter._MENUS.equipmentmarket = Object.assign(setup.MenuFilter._MENUS.equipmentmarket, setup.MenuFilter._MENUS.equipment)
delete setup.MenuFilter._MENUS.equipmentmarket['display']

setup.MenuFilter._MENUS.equipmentmarket['display'] = {
  title: 'Display',
  default: 'Full',
  hardreload: true,
  // @ts-ignore
  options: {
    compact: {
      title: 'Compact',
    },
  }
}

setup.MenuFilter._MENUS.equipmentattach = Object.assign({}, setup.MenuFilter._MENUS.equipment)
delete setup.MenuFilter._MENUS.equipmentattach.display
