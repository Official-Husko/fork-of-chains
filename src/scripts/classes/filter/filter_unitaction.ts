// @ts-nocheck

import { up, down } from "./AAA_filter"
import { MenuFilterHelper } from "./filterhelper"

function getUnitActionTagFilter(tag) {
  return template => template.getTags().includes(tag)
}

function getUnitActionTagFilters(tag_type) {
  return () => {
    const base = {}
    for (const tag of setup.TagHelper.getAllTagsOfType('unitaction', tag_type)) {
      base[tag] = {
        title: setup.TagHelper.tagRep('unitaction', tag, /* force = */ true),
        filter: getUnitActionTagFilter(tag),
      }
    }
    return base
  }
}

setup.MenuFilter._MENUS.unitaction = {
  type: {
    title: 'Type',
    icon_menu: true,
    options: getUnitActionTagFilters('type'),
  },
  status: {
    title: 'Status',
    default: 'All',
    options: {
      doable: {
        title: 'Usable',
        filter: unitaction => unitaction.isCanTrain(State.temporary.unitaction_unit),
      },
      notdoable: {
        title: 'Not usable',
        filter: unitaction => !unitaction.isCanTrain(State.temporary.unitaction_unit),
      },
    }
  },
  sort: {
    title: 'Sort',
    default: 'Default',
    options: {
      namedown: MenuFilterHelper.namedown,
      nameup: MenuFilterHelper.nameup,
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
      compact : {
        title: 'Compact',
      },
    },
  },
}
