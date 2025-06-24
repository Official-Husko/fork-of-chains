/**
 * Lore Tag Definitions
 * -----------------------------------
 * This object defines all tags used to categorize and describe lore entries in the game.
 *
 * @typedef {{
 *   type: string,
 *   title: string,
 *   description: string
 * }} LoreTag
 *
 * @type {Record<string, LoreTag>}
 *
 * Example usage:
 *   // Access the title of the "region" tag
 *   const regionTitle = setup.TAG_LORE.region.title;
 *
 * Expected structure:
 *   setup.TAG_LORE = {
 *     tagKey: {
 *       type: "type",
 *       title: "Title",
 *       description: "Description",
 *     },
 *     ...
 *   }
 */
setup.TAG_LORE = {
  concept: {
    type: "type",
    title: "Concept",
    description: "Important concepts and principles of the workings of this world",
  },
  region: {
    type: "type",
    title: "Region",
    description: "A scoutable region",
  },
  race: {
    type: "type",
    title: "Race",
    description: "The various races coexisting in the world",
  },
  location: {
    type: "type",
    title: "Location",
    description: "Man-made landmark of the land",
  },
  person: {
    type: "type",
    title: "Person",
    description: "A person of particular importance",
  },
  geo: {
    type: "type",
    title: "Geo",
    description: "Geographical features of the land",
  },
  history: {
    type: "type",
    title: "history",
    description: "A thing of the past",
  },
  culture: {
    type: "type",
    title: "Culture",
    description: "A way of life",
  },
};

// Freeze the object to prevent modifications during runtime
Object.freeze(setup.TAG_LORE);
