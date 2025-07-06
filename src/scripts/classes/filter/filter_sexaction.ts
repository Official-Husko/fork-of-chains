// @ts-nocheck

import { up, down } from "./AAA_filter"
import { MenuFilterHelper } from "./filterhelper"

function getSexActionTagFilter(tag) {
  return action => action.getTags().includes(tag)
}

function getSexActionTagFilters(tag_type) {
  return () => {
    const base = {}
    for (const tag of setup.TagHelper.getAllTagsOfType('sexaction', tag_type)) {
      base[tag] = {
        title: setup.TagHelper.tagRep('sexaction', tag, /* force = */ true),
        filter: getSexActionTagFilter(tag),
      }
    }
    return base
  }
}

setup.MenuFilter._MENUS.sexaction = {
  tag_subdom: {
    title: 'Sub/Dom',
    default: 'All',
    icon_menu: true,
    options: getSexActionTagFilters('subdom'),
  },
  tag_type: {
    title: 'Type',
    default: 'All',
    icon_menu: true,
    options: getSexActionTagFilters('type'),
  },
  tag_bodypart: {
    title: 'Bodypart',
    default: 'All',
    icon_menu: true,
    options: getSexActionTagFilters('bodypart'),
  },
  sort: {
    title: 'Sort',
    default: down('Name'),
    default_sort: (a, b) => a.desc().localeCompare(b.desc()),
    options: {
      nameup: {
        title: up('Name'),
        sort: (a, b) => b.desc().localeCompare(a.desc()),
      },
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
    },
  },
}
