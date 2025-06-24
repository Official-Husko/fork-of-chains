/**
 * Room Tag Definitions
 * -----------------------------------
 * This object defines all tags used to categorize and describe room properties in the game.
 *
 * @typedef {{
 *   type: string,
 *   title: string,
 *   description: string,
 *   hide?: boolean
 * }} RoomTag
 *
 * @typedef {{ [key: string]: RoomTag }} RoomTagMap
 *
 * @type {RoomTagMap}
 *
 * Example usage:
 *   // Access the title of the "indoors" tag
 *   const indoorsTitle = setup.TAG_ROOM.indoors.title;
 *
 * Expected structure:
 *   setup.TAG_ROOM = {
 *     tagKey: {
 *       type: "location" | "hidden" | "unique" | "type", // etc.
 *       title: "Title",
 *       description: "Description",
 *       hide?: boolean,
 *     },
 *     ...
 *   }
 */
import { } from "./tag_building"

/** @type {RoomTagMap} */
setup.TAG_ROOM = {
  // Hidden tags: used for internal logic or UI control
  hidename: {
    type: "hidden",
    title: "Hide name",
    description: "Hide name",
    hide: true,
  },
  hideskill: {
    type: "hidden",
    title: "Hide skills",
    description: "Hide skills",
    hide: true,
  },

  // Differentiating tags: describe room placement or type
  indoors: {
    type: "location",
    title: "Indoors",
    description: "Must be build indoors",
  },
  outdoors: {
    type: "location",
    title: "Indoors",
    description: "Must be build outdoors",
  },

  // Unique tags: special room properties
  nodoor: {
    type: "unique",
    title: "Object",
    description: "Not a room and does not have an entrance",
  },
  passable: {
    type: "unique",
    title: "Passable",
    description: "Act like an empty space and can be a part of a path",
  },
  optional: {
    type: "unique",
    title: "Optional",
    description: "Can be optionally removed from your fort",
  },
  fixed: {
    type: "unique",
    title: "Fixed",
    description: "Cannot be moved",
  },
};

// Attach type tags from building tags (imported from tag_building)
for (const building_tag in setup.BUILDING_TAGS) {
  const tag_obj = setup.BUILDING_TAGS[building_tag];
  if (tag_obj.type == "type") {
    if (building_tag in setup.TAG_ROOM) {
      throw new Error(`Duplicated room/building tag: ${building_tag}`);
    }
    setup.TAG_ROOM[building_tag] = tag_obj;
  }
}

// Freeze the object to prevent modifications during runtime
Object.freeze(setup.TAG_ROOM);
