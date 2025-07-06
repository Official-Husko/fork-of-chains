// @ts-nocheck

import { up, down } from "./AAA_filter"
import { MenuFilterHelper } from "./filterhelper"

function getOpportunityTagFilter(tag) {
  return opportunity => opportunity.getTemplate().getTags().includes(tag)
}

function getOpportunityTagFilters(tag_type) {
  return () => {
    const base = {}
    for (const tag of setup.TagHelper.getAllTagsOfType('opportunity', tag_type)) {
      base[tag] = {
        title: setup.TagHelper.tagRep('opportunity', tag, /* force = */ true),
        filter: getOpportunityTagFilter(tag),
      }
    }
    return base
  }
}

setup.MenuFilter._MENUS.opportunity = {
  tag_rarity: {
    title: 'Rarity',
    default: 'All',
    icon_menu: true,
    options: getOpportunityTagFilters('rarity'),
  },
  tag_region: {
    title: 'Region',
    default: 'All',
    icon_menu: true,
    options: getOpportunityTagFilters('region'),
  },
  tag_type: {
    title: 'Type',
    default: 'All',
    icon_menu: true,
    options: getOpportunityTagFilters('type'),
  },
  tag_reward: {
    title: 'Reward',
    default: 'All',
    icon_menu: true,
    options: getOpportunityTagFilters('reward'),
  },

  sort: {
    title: 'Sort',
    default: down('Obtained'),
    options: {
      obtainedup: {
        title: up('Obtained'),
        sort: (a, b) => b.key - a.key,
      },
      leveldown: MenuFilterHelper.templateleveldown,
      levelup: MenuFilterHelper.templatelevelup,
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
    },
  },
}
