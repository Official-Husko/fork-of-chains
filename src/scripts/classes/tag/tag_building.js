export const EXPORTABLE = true

/**
 * Building Tag Definitions
 * -----------------------------------------------------------------------------
 * This object defines all tags used to categorize and describe building properties and improvements in the game.
 *
 * @typedef {{
 *   type: string,
 *   title: string,
 *   description: string
 * }} BuildingTag
 *
 * @type {Record<string, BuildingTag>}
 *
 * Example usage:
 *   // Access the title of the "critical" tag
 *   const criticalTitle = setup.BUILDING_TAGS.critical.title;
 *
 * Expected structure:
 *   setup.BUILDING_TAGS = {
 *     tagKey: {
 *       type: "unique" | "type", // etc.
 *       title: "Title",
 *       description: "Description",
 *     },
 *     ...
 *   }
 */

/**
 * Supported building tag definitions.
 * @type {readonly [string, BuildingTag][]}
 */
const BUILDING_TAGS = Object.freeze([
  ["critical", { type: "unique", title: "Key Improvement", description: "A critical improvement for any slaving company" }],
  ["unlocker", { type: "unique", title: "Unlocker", description: "Improvements that unlocks other improvements" }],
  ["structural", { type: "type", title: "Structural", description: "Foundations of your fort" }],
  ["accomodation", { type: "type", title: "Accomodation", description: "A place to call home" }],
  ["hiring", { type: "type", title: "Hiring", description: "Helps in recruiting slavers and obtaining slaves" }],
  ["office", { type: "type", title: "Office", description: "Desk job and red tape" }],
  ["scout", { type: "type", title: "Scout", description: "Enables you to scout more quests" }],
  ["storage", { type: "type", title: "Inventory", description: "Dealing with items and equipments" }],
  ["training", { type: "type", title: "Slave Training", description: "For training your slaves" }],
  ["recreation", { type: "type", title: "Recreation", description: "Recreation Wing and its upgrades" }],
  ["heal", { type: "type", title: "Heal", description: "Healing and treating your units" }],
  ["corruption", { type: "type", title: "Corruption", description: "Ritual chamber and its upgrades, for corrupting your units" }],
  ["purification", { type: "type", title: "Purification", description: "Temple and its upgrades, for purifying your units" }],
  ["biolab", { type: "type", title: "Flesh-shaping", description: "Biolab and its upgrades, for transforming your units" }],
  ["decoration", { type: "type", title: "Decoration", description: "Fort decoration and minor skill boosts" }],
  ["misc", { type: "type", title: "Miscellaneous", description: "Other improvements essentials for your fort" }],
]);

/** @type {Record<string, BuildingTag>} */
setup.BUILDING_TAGS = {};
for (const [key, value] of BUILDING_TAGS) {
  setup.BUILDING_TAGS[key] = value;
}
Object.freeze(setup.BUILDING_TAGS)

