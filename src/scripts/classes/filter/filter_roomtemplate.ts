// @ts-nocheck

import { up, down } from "./AAA_filter"
import { MenuFilterHelper } from "./filterhelper"

function getRoomTemplateTagFilter(tag) {
  return template => template.getTags().includes(tag)
}

function getRoomTemplateTagFilters(tag_type) {
  return () => {
    const base = {}
    for (const tag of setup.TagHelper.getAllTagsOfType('room', tag_type)) {
      base[tag] = {
        title: setup.TagHelper.tagRep('room', tag, /* force = */ true),
        filter: getRoomTemplateTagFilter(tag),
      }
    }
    return base
  }
}


/**
 * @param {number} skill_key 
 * @returns {Function}
 */
function getSkillFilter(skill_key) {
  return (a) => a.isHasSkillBonusOn(setup.skill[skill_key])
}

function getSkillFilters() {
  const base = {}

  for (const skill of setup.skill) {
    base[skill.keyword] = {
      title: skill.getImageRep(),
      filter: getSkillFilter(skill.key),
    }
  }
  return base
}


setup.MenuFilter._MENUS.roomtemplate = {
  tag_location: {
    title: 'Location',
    default: 'All',
    icon_menu: true,
    options: getRoomTemplateTagFilters('location'),
  },

  tag_unique: {
    title: 'Type',
    default: 'All',
    icon_menu: true,
    options: getRoomTemplateTagFilters('unique'),
  },

  tag_type: {
    title: 'Building type',
    default: 'All',
    icon_menu: true,
    options: getRoomTemplateTagFilters('type'),
  },

  skill: {
    title: 'Skill',
    default: 'All',
    options: getSkillFilters,
  },

  sort: {
    title: 'Sort',
    default: down('Default'),
    default_sort: (a, b) => {
      const arep = `${a.getTags().toString()}${a.getName()}`
      const brep = `${b.getTags().toString()}${b.getName()}`
      return arep.localeCompare(brep)
    },
    options: {
      namedown: MenuFilterHelper.namedown,
      nameup: MenuFilterHelper.nameup,
      widthdown: {
        title: down('Width'),
        sort: (a, b) => a.getWidth() - b.getWidth(),
      },
      widthup: {
        title: up('Width'),
        sort: (a, b) => b.getWidth() - a.getWidth(),
      },
      heightdown: {
        title: down('Height'),
        sort: (a, b) => a.getHeight() - b.getHeight(),
      },
      heightup: {
        title: up('Height'),
        sort: (a, b) => b.getHeight() - a.getHeight(),
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

