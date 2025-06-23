import { up, down } from "./AAA_filter"
import { MenuFilterHelper } from "./filterhelper"

function getItemClassFilter(item_class_key) {
  return item => item.getItemClass().key == item_class_key
}

function getItemClassFilters() {
  const options = []

  for (const item_class of Object.values(setup.itemclass)) {
    options.push({
      title: item_class.getImageRep(),
      filter: getItemClassFilter(item_class.key),
    })
  }

  return options
}

function getFurnitureSlotFilter(furniture_slot_key) {
  return item => item.getItemClass() == setup.itemclass.furniture && item.getSlot().key == furniture_slot_key
}

function getFurnitureSlotFilters() {
  const options = []

  for (const furniture_slot of Object.values(setup.furnitureslot)) {
    options.push({
      title: furniture_slot.getImageRep(),
      filter: getFurnitureSlotFilter(furniture_slot.key),
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
      filter: a => a instanceof setup.Furniture && a.getSkillMod(skill) > 0,
    }
  }
  return base
}


setup.MenuFilter._MENUS.item = {
  type: {
    title: 'Type',
    default: 'All',
    resets: ['furniture'],
    icon_menu: true,
    options: getItemClassFilters,
  },
  furniture: {
    title: 'Furniture',
    default: 'All',
    resets: ['type'],
    icon_menu: true,
    options: getFurnitureSlotFilters,
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
      raritydown: MenuFilterHelper.raritydown,
      rarityup: MenuFilterHelper.rarityup,
    }
  },
  display: {
    title: 'Display',
    default: 'Full',
    hardreload: true,
    options: {
      short: {
        title: 'Short',
      },
      compact: {
        title: 'Compact',
      },
    }
  },
}

setup.MenuFilter._MENUS.itemmarket = {
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

setup.MenuFilter._MENUS.itemmarket = Object.assign(setup.MenuFilter._MENUS.itemmarket, setup.MenuFilter._MENUS.item)
delete setup.MenuFilter._MENUS.itemmarket['display']

setup.MenuFilter._MENUS.itemmarket['display'] = {
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

setup.MenuFilter._MENUS.furnitureattach = {
  furniture: {
    title: 'Furniture',
    default: 'All',
    icon_menu: true,
    options: getFurnitureSlotFilters,
  },
  sortskill: setup.MenuFilter._MENUS.item.sortskill,
  sort: setup.MenuFilter._MENUS.item.sort,
}

