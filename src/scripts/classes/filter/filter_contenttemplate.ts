// @ts-nocheck

import { up, down } from "./AAA_filter"
import { MenuFilterHelper } from "./filterhelper"

function getTemplateTagFilter(tag) {
  return template => template.getTags().includes(tag)
}

function getTemplateTagFilters(tag_type) {
  return () => {
    const base = {}
    for (const tag of setup.TagHelper.getAllTagsOfType('quest', tag_type)) {
      base[tag] = {
        title: setup.TagHelper.tagRep('quest', tag, /* force = */ true),
        filter: getTemplateTagFilter(tag),
      }
    }
    return base
  }
}


function getSubraceFilter(subrace) {
  return template => template.getActorSubraces().includes(subrace)
}

function getSubraceFilters() {
  const base = {}
  for (const subrace of setup.TraitHelper.getAllTraitsOfTags(['subrace'])) {
    base[subrace.key] = {
      title: subrace.rep(),
      filter: getSubraceFilter(subrace),
    }
  }
  return base
}


function getSkillFilter(skill) {
  return /** @param {setup.QuestTemplate} template */ template => template.getMainSkills().includes(skill)
}

function getSkillFilters() {
  const base = {}
  for (const skill of setup.skill) {
    base[skill.keyword] = {
      title: skill.rep(),
      filter: getSkillFilter(skill),
    }
  }
  return base
}

function getAuthorFilter(author) {
  return template => template.getAuthor().name == author
}

function getAuthorFilters() {
  const author_credits = setup.getAuthorCredits()
  const author_names = Object.keys(author_credits)
  author_names.sort()
  const base = {}
  for (const author_name of author_names) {
    base[author_name] = {
      title: author_name,
      filter: getAuthorFilter(author_name)
    }
  }
  return base
}


function getLevelFilter(level_min, level_max) {
  return template => template.getDifficulty().getLevel() >= level_min && template.getDifficulty().getLevel() <= level_max
}

function getLevelFilters() {
  const gap = 5
  const max_level = setup.DIFFICULTY_MAX_LEVEL
  let current = 1
  const base = {}
  while (current <= max_level) {
    base[current] = {
      title: `Lv. ${current} - ${current + gap - 1}`,
      filter: getLevelFilter(current, current + gap - 1),
    }
    current += gap
  }
  return base
}


setup.MenuFilter._MENUS.questtemplate = {
  tag_rarity: {
    title: 'Rarity',
    default: 'All',
    icon_menu: true,
    options: getTemplateTagFilters('rarity'),
  },
  tag_region: {
    title: 'Region',
    default: 'All',
    icon_menu: true,
    options: getTemplateTagFilters('region'),
  },
  tag_type: {
    title: 'Type',
    default: 'All',
    icon_menu: true,
    options: getTemplateTagFilters('type'),
  },
  tag_reward: {
    title: 'Reward',
    default: 'All',
    icon_menu: true,
    options: getTemplateTagFilters('reward'),
  },
  subrace: {
    title: 'Subrace',
    default: 'All',
    icon_menu: true,
    options: getSubraceFilters,
  },
  skill: {
    title: 'Skill',
    default: 'All',
    icon_menu: true,
    options: getSkillFilters,
  },
  author: {
    title: 'Author',
    default: 'All',
    options: getAuthorFilters,
  },
  level: {
    title: 'Level',
    default: 'All',
    options: getLevelFilters,
  },
  sort: {
    title: 'Sort',
    default: down('Name'),
    default_sort: (a, b) => a.getName().localeCompare(b.getName()),
    options: {
      nameup: MenuFilterHelper.nameup,
      leveldown: MenuFilterHelper.difficultyleveldown,
      levelup: MenuFilterHelper.difficultylevelup,
    }
  },
}

setup.MenuFilter._MENUS.opportunitytemplate = Object.assign({}, setup.MenuFilter._MENUS.questtemplate)
delete setup.MenuFilter._MENUS.opportunitytemplate.skill
setup.MenuFilter._MENUS.event = setup.MenuFilter._MENUS.opportunitytemplate

setup.MenuFilter._MENUS.activitytemplate = Object.assign({}, setup.MenuFilter._MENUS.opportunitytemplate)
delete setup.MenuFilter._MENUS.activitytemplate['level']
setup.MenuFilter._MENUS.interaction = setup.MenuFilter._MENUS.activitytemplate
