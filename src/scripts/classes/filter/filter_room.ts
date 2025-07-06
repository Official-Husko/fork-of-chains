// @ts-nocheck

import { up, down } from "./AAA_filter"
import { MenuFilterHelper } from "./filterhelper"

function getRoomTagFilter(tag) {
  return room => room.getTemplate().getTags().includes(tag)
}

function getRoomTagFilters(tag_type) {
  return () => {
    const base = {}
    for (const tag of setup.TagHelper.getAllTagsOfType('room', tag_type)) {
      base[tag] = {
        title: setup.TagHelper.tagRep('room', tag, /* force = */ true),
        filter: getRoomTagFilter(tag),
      }
    }
    return base
  }
}

setup.MenuFilter._MENUS.room = {
  tag_location: {
    title: 'Location',
    default: 'All',
    icon_menu: true,
    options: getRoomTagFilters('location'),
  },

  tag_unique: {
    title: 'Type',
    default: 'All',
    icon_menu: true,
    options: getRoomTagFilters('unique'),
  },

  tag_type: {
    title: 'Building type',
    default: 'All',
    icon_menu: true,
    options: getRoomTagFilters('type'),
  },

  status: {
    title: 'Status',
    default: 'All',
    options: {
      used: {
        title: 'Placed',
        filter: a => !State.variables.roomlist.getRoomCount(a.getTemplate()).unplaced,
      },
      free: {
        title: 'Unplaced',
        filter: a => State.variables.roomlist.getRoomCount(a.getTemplate()).unplaced,
      },
    }
  },

  sort: {
    title: 'Sort',
    default: down('Default'),
    default_sort: (a, b) => {
      const arep = `${a.getTemplate().getTags().toString()}${a.getName()}`
      const brep = `${b.getTemplate().getTags().toString()}${b.getName()}`
      return arep.localeCompare(brep)
    },
    options: {
      namedown: MenuFilterHelper.namedown,
      nameup: MenuFilterHelper.nameup,
      widthdown: {
        title: down('Width'),
        sort: (a, b) => a.getTemplate().getWidth() - b.getTemplate().getWidth(),
      },
      widthup: {
        title: up('Width'),
        sort: (a, b) => b.getTemplate().getWidth() - a.getTemplate().getWidth(),
      },
      heightdown: {
        title: down('Height'),
        sort: (a, b) => a.getTemplate().getHeight() - b.getTemplate().getHeight(),
      },
      heightup: {
        title: up('Height'),
        sort: (a, b) => b.getTemplate().getHeight() - a.getTemplate().getHeight(),
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
    }
  },
}

