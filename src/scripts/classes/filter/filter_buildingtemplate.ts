// @ts-nocheck

import { up, down } from "./AAA_filter"
import { MenuFilterHelper } from "./filterhelper"

function getBuildingTagFilter(tag) {
  return template => template.getTags().includes(tag)
}

function getBuildingTagFilters(tag_type) {
  return () => {
    const base = {}
    for (const tag of setup.TagHelper.getAllTagsOfType('buildingtemplate', tag_type)) {
      base[tag] = {
        title: setup.TagHelper.tagRep('buildingtemplate', tag, /* force = */ true),
        filter: getBuildingTagFilter(tag),
      }
    }
    return base
  }
}


setup.MenuFilter._MENUS.buildingtemplate = {
  tag_unique: {
    title: 'Unique',
    default: 'All',
    icon_menu: true,
    options: getBuildingTagFilters('unique'),
  },
  tag_type: {
    title: 'Type',
    default: 'All',
    icon_menu: true,
    options: getBuildingTagFilters('type'),
  },
  status: {
    title: 'Can build?',
    default: 'All',
    options: {
      buildable: {
        title: 'Buildable',
        filter: template => template.isBuildable(0),
      },
      notbuildable: {
        title: 'Not buildable',
        filter: template => !template.isBuildable(0),
      },
    }
  },
  hidden: {
    title: 'Hidden',
    default: 'Hide',
    default_filter: template => !State.variables.fort.player.isTemplateIgnored(template),
    options: {
      show: {
        title: 'Show',
      },
      onlyhidden: {
        title: 'Only hidden',
        filter: template => State.variables.fort.player.isTemplateIgnored(template),
      },
    },
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
      compact: {
        title: 'Compact',
      },
    }
  },
}
