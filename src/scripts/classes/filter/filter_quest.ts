// @ts-nocheck

import { up, down } from "./AAA_filter"
import { MenuFilterHelper } from "./filterhelper"

function getQuestTagFilter(tag) {
  return quest => quest.getTemplate().getTags().includes(tag)
}

function getQuestTagFilters(tag_type) {
  return () => {
    const base = {}
    for (const tag of setup.TagHelper.getAllTagsOfType('quest', tag_type)) {
      base[tag] = {
        title: setup.TagHelper.tagRep('quest', tag, /* force = */ true),
        filter: getQuestTagFilter(tag),
      }
    }
    return base
  }
}

setup.MenuFilter._MENUS.quest = {
  tag_rarity: {
    title: 'Rarity',
    default: 'All',
    icon_menu: true,
    options: getQuestTagFilters('rarity'),
  },
  tag_region: {
    title: 'Region',
    default: 'All',
    icon_menu: true,
    options: getQuestTagFilters('region'),
  },
  tag_type: {
    title: 'Type',
    default: 'All',
    icon_menu: true,
    options: getQuestTagFilters('type'),
  },
  tag_reward: {
    title: 'Reward',
    default: 'All',
    icon_menu: true,
    options: getQuestTagFilters('reward'),
  },

  status: {
    title: 'Status',
    default: 'All',
    options: {
      assigned: {
        title: 'Assigned',
        filter: quest => quest.getTeam(),
      },
      free: {
        title: 'Free',
        filter: quest => !quest.getTeam(),
      },
    },
  },
  history: {
    title: 'History',
    default: 'All',
    options: {
      new: {
        title: 'New',
        filter: quest => !State.variables.statistics.isHasSuccess(quest.getTemplate()),
      },
      free: {
        title: 'Cleared',
        filter: quest => State.variables.statistics.isHasSuccess(quest.getTemplate()),
      },
    },
  },
  ignored: {
    title: 'Ignored',
    default: 'Hide',
    default_filter: quest => !State.variables.company.player.isIgnored(quest.getTemplate()),
    options: {
      show: {
        title: 'Show',
      },
      ignoredonly: {
        title: 'Ignored only',
        filter: quest => State.variables.company.player.isIgnored(quest.getTemplate()),
      },
    },
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

      expiresdown: {
        title: down('Expires'),
        sort: (a, b) => a.getWeeksUntilExpired() - b.getWeeksUntilExpired(),
      },
      expiresup: {
        title: up('Expires'),
        sort: (a, b) => b.getWeeksUntilExpired() - a.getWeeksUntilExpired(),
      },

      weeksdown: {
        title: down('Weeks'),
        sort: (a, b) => a.getTemplate().getWeeks() - b.getTemplate().getWeeks(),
      },
      weeksup: {
        title: up('Weeks'),
        sort: (a, b) => b.getTemplate().getWeeks() - a.getTemplate().getWeeks(),
      },

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
      compact: {
        title: 'Compact',
      },
    },
  },
  text: {
    title: 'Story',
    default: 'Full',
    hardreload: true,
    options: {
      new: {
        title: 'New only',
      },
      hidden: {
        title: 'Hidden',
      },
    },
  },
}
