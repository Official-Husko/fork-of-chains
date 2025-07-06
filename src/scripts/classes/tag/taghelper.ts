// @ts-nocheck

import { menuItem } from "../../ui/menu"
import { getCallback } from "../filter/AAA_filter"

// Static class to help tag related stuffs
setup.TagHelper = class TagHelper extends setup.TwineClass {
  static TAG_INFO = {
    quest: {
      img_folder: 'tag_quest',
    },
    opportunity: {
      img_folder: 'tag_quest',
    },
    buildingtemplate: {
      img_folder: 'tag_building',
    },
    buildinginstance: {
      img_folder: 'tag_building',
    },
    room: {
      img_folder: 'tag_room',
    },
    unitaction: {
      img_folder: 'tag_unitaction',
    },
    lore: {
      img_folder: 'tag_lore',
    },
    sexaction: {
      img_folder: 'tag_sexaction',
    },
    trait: {
      img_folder: 'tag_trait',
    },
  }

  /**
   * @param {string} menu 
   * @returns {object}
   */
  static getTagsMap(menu) {
    const TAGS_map = {
      quest: setup.QUESTTAGS,
      opportunity: setup.QUESTTAGS,
      buildingtemplate: setup.BUILDING_TAGS,
      buildinginstance: setup.BUILDING_TAGS,
      unitaction: setup.TAG_UNITACTION,
      lore: setup.TAG_LORE,
      sexaction: setup.TAG_SEXACTION,
      trait: setup.TAG_TRAIT,
      room: setup.TAG_ROOM,
    }
    if (!(menu in TAGS_map)) throw new Error(`Unrecognized menu in tags: ${menu}`)
    return TAGS_map[menu]
  }

  /**
   * @param {string} menu
   * @param {string} tag_type 
   * @returns {Array.<string>}
   */
  static getAllTagsOfType(menu, tag_type) {
    const result = []
    const all_tags = setup.TagHelper.getTagsMap(menu)
    for (const tag in all_tags) {
      if (all_tags[tag].type == tag_type) result.push(tag)
    }
    return result
  }

  /**
   * @param {string} menu
   * @param {string} tag 
   * @param {boolean} [force]
   * @returns {string}
   */
  static tagRep(menu, tag, force) {
    const tag_map = setup.TagHelper.getTagsMap(menu)
    if (!(tag in tag_map)) throw new Error(`Unknown ${menu} tag: ${tag}`)

    const tagobj = tag_map[tag]
    if (!force && tagobj.hide) return ''

    const folder = setup.TagHelper.TAG_INFO[menu].img_folder

    return setup.repImgIcon(
      `img/${folder}/${tag}.svg`,
      tagobj.description,
    )
  }

  /**
   * @param {string} menu
   * @param {string} tag 
   * @returns {string}
   */
  static tagRepLong(menu, tag) {
    const tag_map = setup.TagHelper.getTagsMap(menu)
    if (!(tag in tag_map)) throw new Error(`Unknown ${menu} tag: ${tag}`)

    const tagobj = tag_map[tag]
    return `${setup.TagHelper.tagRep(menu, tag)}<span data-tooltip="${tagobj.description}">${tagobj.title}</span>`
  }

  /**
   * @param {string} menu 
   * @param {Array.<string>} tags
   * @returns {string}
   */
  static getTagsRep(menu, tags) {
    const tag_map = setup.TagHelper.getTagsMap(menu)
    const taglist = Object.keys(tag_map)
    const tag_copy = tags.filter(tag => true)
    tag_copy.sort((tag1, tag2) => {
      const idx1 = taglist.indexOf(tag1)
      const idx2 = taglist.indexOf(tag2)
      return idx1 - idx2
    })
    return tag_copy.map(tag => setup.TagHelper.tagRep(menu, tag)).join('')
  }

  /**
   * @param {Array<string>} tags 
   * @returns {string}
   */
  static getQuestCardClass(tags) {
    let panorama = setup.QUESTTAGS_DEFAULT_PANORAMA
    let border = ''
    for (const tag of tags) {
      if (tag in setup.QUESTTAGS_PANORAMA) panorama = setup.QUESTTAGS_PANORAMA[tag]
      if (tag in setup.QUESTTAGS_BORDER) border = setup.QUESTTAGS_BORDER[tag]
    }
    return panorama + ' ' + border
  }

}

