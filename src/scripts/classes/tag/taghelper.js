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
   * Maps menu types to their corresponding image folder for tag icons.
   * Used to determine the correct image path for each tag type.
   */
  static TAG_INFO = {
    quest: { img_folder: 'tag_quest' },
    opportunity: { img_folder: 'tag_quest' },
    buildingtemplate: { img_folder: 'tag_building' },
    buildinginstance: { img_folder: 'tag_building' },
    room: { img_folder: 'tag_room' },
    unitaction: { img_folder: 'tag_unitaction' },
    lore: { img_folder: 'tag_lore' },
    sexaction: { img_folder: 'tag_sexaction' },
    trait: { img_folder: 'tag_trait' },
  }

  /**
   * @typedef {Object} TagObject
   * @property {string} type - The type/category of the tag (e.g., 'region', 'rarity', etc).
   * @property {string} description - A short description of the tag, used for tooltips.
   * @property {string} title - The display name/title of the tag.
   * @property {boolean} [hide] - If true, the tag is hidden from normal display.
   */

  /**
   * Returns the tag map object for a given menu type.
   * The tag map contains all tag definitions for that menu (e.g., all quest tags, all trait tags).
   *
   * @param {string} menu - The menu type (e.g., 'quest', 'trait', 'buildingtemplate', etc).
   * @returns {Object.<string, TagObject>|object} The tag map for the menu.
   * @throws {Error} If the menu type is not recognized.
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
    // @ts-ignore
    return TAGS_map[menu]
  }

  /**
   * Returns all tag keys of a given type for a menu.
   * This is useful for filtering tags by their type/category (e.g., all 'rarity' tags).
   *
   * @param {string} menu - The menu type (e.g., 'quest', 'trait', etc).
   * @param {string} tag_type - The tag type to filter by (e.g., 'rarity', 'region').
   * @returns {Array.<string>} Array of tag keys matching the given type.
   */
  static getAllTagsOfType(menu, tag_type) {
    const result = []
    const all_tags = setup.TagHelper.getTagsMap(menu)
    for (const tag in all_tags) {
      // @ts-ignore
      if (all_tags[tag].type == tag_type) result.push(tag)
    }
    return result
  }

  /**
   * Sorts an array of tag keys according to their order in the tag map.
   * This ensures tags are displayed in a consistent, canonical order in the UI.
   *
   * @param {Array<string>} tags - The tag keys to sort.
   * @param {object} tag_map - The tag map to use for sorting (from getTagsMap).
   * @returns {Array<string>} Sorted array of tag keys.
   */
  static sortTagsByMap(tags, tag_map) {
    const taglist = Object.keys(tag_map);
    return tags.slice().sort((tag1, tag2) => {
      const idx1 = taglist.indexOf(tag1);
      const idx2 = taglist.indexOf(tag2);
      return idx1 - idx2;
    });
  }

  /**
   * Retrieves a tag object from a tag map, throwing if the tag is not found.
   * This is the canonical way to get tag metadata for rendering or logic.
   *
   * @param {Object.<string, TagObject>|object} tag_map - The tag map (from getTagsMap).
   * @param {string} tag - The tag key to look up.
   * @param {string} menu - The menu type (for error messages).
   * @returns {TagObject} The tag object for the given key.
   * @throws {Error} If the tag is not found in the map.
   */
  static getTagObject(tag_map, tag, menu) {
    if (!(tag in tag_map)) throw new Error(`Unknown ${menu} tag: ${tag}`);
    // @ts-ignore
    return /** @type {TagObject} */ (tag_map[tag]);
  }

  /**
   * Renders a list of tag icons as HTML for a given menu and tag array.
   * Tags are sorted in canonical order before rendering.
   *
   * @param {string} menu - The menu type (e.g., 'quest', 'trait', etc).
   * @param {Array.<string>} tags - The tag keys to render.
   * @returns {string} HTML string of tag icons.
   */
  static getTagsRep(menu, tags) {
    if (!Array.isArray(tags) || tags.length === 0) return '';
    const tag_map = setup.TagHelper.getTagsMap(menu);
    const sorted = setup.TagHelper.sortTagsByMap(tags, tag_map);
    return sorted.map(tag => setup.TagHelper.tagRep(menu, tag)).join('');
  }

  /**
   * Renders a single tag icon as HTML for a given menu and tag key.
   * Optionally forces display of hidden tags.
   *
   * @param {string} menu - The menu type (e.g., 'quest', 'trait', etc).
   * @param {string} tag - The tag key to render.
   * @param {boolean} [force] - If true, show the tag even if marked as hidden.
   * @returns {string} HTML string for the tag icon.
   */
  static tagRep(menu, tag, force) {
    /** @type {Object.<string, TagObject>|object} */
    const tag_map = setup.TagHelper.getTagsMap(menu);
    const tagobj = setup.TagHelper.getTagObject(tag_map, tag, menu);
    if (!force && tagobj.hide) return '';
    // @ts-ignore
    const folder = setup.TagHelper.TAG_INFO[menu].img_folder;
    return setup.repImgIcon(
      `img/${folder}/${tag}.svg`,
      tagobj.description,
    );
  }

  /**
   * Renders a tag icon and its tooltip/title as HTML for a given menu and tag key.
   * Used for displaying both the icon and a human-readable label with tooltip.
   *
   * @param {string} menu - The menu type (e.g., 'quest', 'trait', etc).
   * @param {string} tag - The tag key to render.
   * @returns {string} HTML string for the tag icon and tooltip/title.
   */
  static tagRepLong(menu, tag) {
    /** @type {Object.<string, TagObject>|object} */
    const tag_map = setup.TagHelper.getTagsMap(menu);
    const tagobj = setup.TagHelper.getTagObject(tag_map, tag, menu);
    return `${setup.TagHelper.tagRep(menu, tag)}<span data-tooltip="${tagobj.description}">${tagobj.title}</span>`;
  }

  /**
   * Computes the CSS class string for a quest card based on its tags.
   * This determines the background and border style for quest cards in the UI.
   *
   * @param {Array<string>} tags - The tags for the quest.
   * @returns {string} CSS class string for the quest card (e.g., 'panorama-vale border-rare').
   */
  static getQuestCardClass(tags) {
    if (!Array.isArray(tags) || tags.length === 0) return setup.QUESTTAGS_DEFAULT_PANORAMA;
    const panorama = setup.QUESTTAGS_DEFAULT_PANORAMA;
    let border = '';
    for (const tag of tags) {
      // @ts-ignore
      if (tag in setup.QUESTTAGS_PANORAMA) panorama = setup.QUESTTAGS_PANORAMA[tag];
      // @ts-ignore
      if (tag in setup.QUESTTAGS_BORDER) border = setup.QUESTTAGS_BORDER[tag];
    }
    return `${panorama} ${border}`.trim();
  }
}

