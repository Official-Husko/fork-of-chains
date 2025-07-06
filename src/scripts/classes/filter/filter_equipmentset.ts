// @ts-nocheck

import { up, down } from "./AAA_filter"
import { MenuFilterHelper } from "./filterhelper"


function getEquipmentSetSkillSort(skill_key) {
  return (a, b) => b.getSkillMods()[skill_key] - a.getSkillMods()[skill_key]
}

function getEquipmentSetSkillsSort() {
  const base = {
  }

  for (const skill of setup.skill) {
    base[skill.keyword] = {
      title: skill.getImageRep(),
      sort: getEquipmentSetSkillSort(skill.key),
    }
  }
  return base
}


setup.MenuFilter._MENUS.equipmentset = {
  status: {
    title: 'Status',
    default: 'All',
    options: {
      used: {
        title: 'Used',
        filter: a => a.getUnit(),
      },
      free: {
        title: 'Free',
        filter: a => !a.getUnit(),
      },
    }
  },
  sort: {
    title: 'Sort',
    default: down('Obtained'),
    resets: ['sortskill'],
    options: {
      obtainedup: {
        title: up('Obtained'),
        sort: (a, b) => b.key - a.key,
      },
      namedown: MenuFilterHelper.namedown,
      nameup: MenuFilterHelper.nameup,
      valuedown: MenuFilterHelper.valuedown,
      valueup: MenuFilterHelper.valueup,
      sluttinessdown: MenuFilterHelper.sluttinessdown,
      sluttinessup: MenuFilterHelper.sluttinessup,
    }
  },

  sortskill: {
    title: 'Skill',
    default: 'None',
    resets: ['sort'],
    options: getEquipmentSetSkillsSort,
  },

  display: {
    title: 'Display',
    default: 'Full',
    hardreload: true,
    options: {
      compact: {
        title: 'Compact',
      }
    }
  },
}


setup.MenuFilter._MENUS.equipmentsetpickequip = Object.assign({}, setup.MenuFilter._MENUS.equipmentset)
setup.MenuFilter._MENUS.equipmentsetpickequip.eligibility = {
  title: 'Eligibility',
  default: 'Eligible only',
  hardreload: true,
  options: {
    all: {
      title: 'All',
    },
    not: {
      title: 'Not eligible only',
    },
  }
}
