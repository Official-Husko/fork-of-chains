/**
 * @file taghelper.js
 * @module TagHelper
 * @description
 * Provides typedefs and type safety for tag-related data structures used throughout the game UI.
 *
 * @typedef {Object} TagObject
 *   Represents a single tag definition.
 * @property {string} type - The category/type of the tag (e.g., 'region', 'rarity', etc).
 * @property {string} description - A short description of the tag, used for tooltips and accessibility.
 * @property {string} title - The display name/title of the tag, shown in the UI.
 * @property {boolean} [hide] - If true, the tag is hidden from normal display but may be shown with force.
 *
 * @typedef {"quest"|"opportunity"|"buildingtemplate"|"buildinginstance"|"room"|"unitaction"|"lore"|"sexaction"|"trait"} TagMenuType
 *   Enumerates all valid menu types that can have tags.
 *
 * @typedef {Object} TagInfo
 *   Metadata for a tag menu type, including the image folder for icons.
 * @property {string} img_folder - The folder under /img/ containing SVG icons for this tag type.
 *
 * @typedef {Object.<TagMenuType, TagInfo>} TagInfoMap
 *   Maps each TagMenuType to its TagInfo metadata.
 */

// @ts-ignore
import { menuItem } from "../../ui/menu"
// @ts-ignore
import { getCallback } from "../filter/AAA_filter"

/**
 * TagHelper is a static utility class for managing and rendering tags in the game UI.
 * Tags are used to categorize and visually represent various game elements (quests, buildings, traits, etc).
 * This class provides methods for retrieving tag metadata, sorting tags, rendering tag icons, and generating CSS classes for quest cards.
 *
 * Tag data is expected to be defined in the global `setup` object (e.g., setup.QUESTTAGS, setup.BUILDING_TAGS, etc).
 *
 * Usage examples:
 *   - Rendering a list of tag icons for a quest: TagHelper.getTagsRep('quest', quest.tags)
 *   - Getting a CSS class for a quest card: TagHelper.getQuestCardClass(quest.tags)
 *   - Getting a tag's metadata: TagHelper.getTagObject(setup.QUESTTAGS, 'rare', 'quest')
 */
setup.TagHelper = class TagHelper extends setup.TwineClass {
  /**
   * Immutable mapping of menu types to their corresponding image folder for tag icons.
   * Used to determine the correct image path for each tag type when rendering icons.
   *
   * @type {Readonly<TagInfoMap>}
   */
  static TAG_INFO = Object.freeze({
    quest: { img_folder: "tag_quest" },
    opportunity: { img_folder: "tag_quest" },
    buildingtemplate: { img_folder: "tag_building" },
    buildinginstance: { img_folder: "tag_building" },
    room: { img_folder: "tag_room" },
    unitaction: { img_folder: "tag_unitaction" },
    lore: { img_folder: "tag_lore" },
    sexaction: { img_folder: "tag_sexaction" },
    trait: { img_folder: "tag_trait" },
  })

  /**
   * Retrieves the tag map object for a given menu type.
   * The tag map contains all tag definitions for that menu (e.g., all quest tags, all trait tags).
   *
   * @param {TagMenuType} menu - The menu type for which to retrieve the tag map.
   * @returns {Object.<string, TagObject>} The tag map for the specified menu type.
   * @throws {Error} If the menu type is not recognized or not supported.
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
    if (!(menu in TAGS_map)) {
      throw new Error(`Unrecognized menu in tags: ${menu}`)
    }
    // @ts-ignore
    return TAGS_map[menu]
  }

  /**
   * Returns all tag keys of a given type/category for a specific menu.
   * Useful for filtering tags by their type (e.g., all 'rarity' tags for quests).
   *
   * @param {TagMenuType} menu - The menu type to search within.
   * @param {string} tag_type - The tag type/category to filter by (e.g., 'rarity', 'region').
   * @returns {string[]} Array of tag keys matching the given type within the menu.
   */
  static getAllTagsOfType(menu, tag_type) {
    const result = []
    const all_tags = setup.TagHelper.getTagsMap(menu)
    for (const tag in all_tags) {
      // @ts-ignore
      if (all_tags[tag].type === tag_type) result.push(tag)
    }
    return result
  }

  /**
   * Sorts an array of tag keys according to their canonical order in the tag map.
   * Ensures tags are displayed in a consistent, predictable order in the UI.
   *
   * @param {string[]} tags - The tag keys to sort.
   * @param {Object.<string, TagObject>} tag_map - The tag map to use for sorting (from getTagsMap).
   * @returns {string[]} Sorted array of tag keys, matching the order in the tag map.
   */
  static sortTagsByMap(tags, tag_map) {
    const taglist = Object.keys(tag_map)
    return tags.slice().sort((tag1, tag2) => {
      const idx1 = taglist.indexOf(tag1)
      const idx2 = taglist.indexOf(tag2)
      return idx1 - idx2
    })
  }

  /**
   * Retrieves a tag object from a tag map, throwing an error if the tag is not found.
   * This is the canonical way to get tag metadata for rendering or logic.
   *
   * @param {Object.<string, TagObject>} tag_map - The tag map (from getTagsMap).
   * @param {string} tag - The tag key to look up.
   * @param {TagMenuType} menu - The menu type (for error messages and context).
   * @returns {TagObject} The tag object for the given key.
   * @throws {Error} If the tag is not found in the map.
   */
  static getTagObject(tag_map, tag, menu) {
    if (!(tag in tag_map)) {
      throw new Error(`Unknown ${menu} tag: ${tag}`)
    }
    // @ts-ignore
    return /** @type {TagObject} */ (tag_map[tag])
  }

  /**
   * Renders a list of tag icons as HTML for a given menu and tag array.
   * Tags are sorted in canonical order before rendering. Each icon includes a tooltip for accessibility.
   *
   * @param {TagMenuType} menu - The menu type (e.g., 'quest', 'trait', etc).
   * @param {string[]} tags - The tag keys to render as icons.
   * @returns {string} HTML string of tag icons, or an empty string if no tags are provided.
   */
  static getTagsRep(menu, tags) {
    if (!Array.isArray(tags) || tags.length === 0) return ''
    const tag_map = setup.TagHelper.getTagsMap(menu)
    const sorted = setup.TagHelper.sortTagsByMap(tags, tag_map)
    return sorted.map(tag => setup.TagHelper.tagRep(menu, tag)).join('')
  }

  /**
   * Renders a single tag icon as HTML for a given menu and tag key.
   * Optionally forces display of hidden tags. The icon includes a tooltip for accessibility.
   *
   * @param {TagMenuType} menu - The menu type (e.g., 'quest', 'trait', etc).
   * @param {string} tag - The tag key to render as an icon.
   * @param {boolean} [force=false] - If true, show the tag even if marked as hidden.
   * @returns {string} HTML string for the tag icon, or an empty string if hidden and not forced.
   */
  static tagRep(menu, tag, force) {
    /** @type {Object.<string, TagObject>} */
    const tag_map = setup.TagHelper.getTagsMap(menu)
    const tagobj = setup.TagHelper.getTagObject(tag_map, tag, menu)
    if (!force && tagobj.hide) return ''
    // @ts-ignore
    const folder = setup.TagHelper.TAG_INFO[menu].img_folder
    return setup.repImgIcon(
      `img/${folder}/${tag}.svg`,
      tagobj.description,
    )
  }

  /**
   * Renders a tag icon and its tooltip/title as HTML for a given menu and tag key.
   * Used for displaying both the icon and a human-readable label with tooltip for clarity.
   *
   * @param {TagMenuType} menu - The menu type (e.g., 'quest', 'trait', etc).
   * @param {string} tag - The tag key to render.
   * @returns {string} HTML string for the tag icon and its label with tooltip.
   */
  static tagRepLong(menu, tag) {
    /** @type {Object.<string, TagObject>} */
    const tag_map = setup.TagHelper.getTagsMap(menu)
    const tagobj = setup.TagHelper.getTagObject(tag_map, tag, menu)
    return `${setup.TagHelper.tagRep(menu, tag)}<span data-tooltip="${tagobj.description}">${tagobj.title}</span>`
  }

  /**
   * Computes the CSS class string for a quest card based on its tags.
   * Determines the background and border style for quest cards in the UI, using tag-based mappings.
   *
   * @param {string[]} tags - The tags for the quest.
   * @returns {string} CSS class string for the quest card (e.g., 'panorama-vale border-rare').
   */
  static getQuestCardClass(tags) {
    if (!Array.isArray(tags) || tags.length === 0) return setup.QUESTTAGS_DEFAULT_PANORAMA
    let panorama = setup.QUESTTAGS_DEFAULT_PANORAMA
    let border = ''
    for (const tag of tags) {
      // @ts-ignore
      if (tag in setup.QUESTTAGS_PANORAMA) panorama = setup.QUESTTAGS_PANORAMA[tag]
      // @ts-ignore
      if (tag in setup.QUESTTAGS_BORDER) border = setup.QUESTTAGS_BORDER[tag]
    }
    return `${panorama} ${border}`.trim()
  }
}

