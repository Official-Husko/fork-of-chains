/**
 * Unit Action Tag Definitions
 * -----------------------------------------------------------------------------
 * This object defines all tags used to categorize and describe unit actions in the game.
 *
 * @typedef {{
 *   type: string,
 *   title: string,
 *   description: string
 * }} UnitActionTag
 *
 * @type {Object.<string, UnitActionTag>}
 *
 * Example usage:
 *   // Access the title of the "training" action
 *   const trainingTitle = setup.TAG_UNITACTION.training.title;
 *
 * Expected structure:
 *   setup.TAG_UNITACTION = {
 *     tagKey: {
 *       type: "type",
 *       title: "Title",
 *       description: "Description",
 *     },
 *     ...
 *   }
 */

/**
 * Supported unit action tag definitions.
 * @type {readonly [string, UnitActionTag][]}
 */
const UNIT_ACTION_TAGS = Object.freeze([
  ["training", {
    type: "type",
    title: "Training",
    description: "Trains the slave in the art of servicing their betters",
  }],
  ["purification", {
    type: "type",
    title: "Purification",
    description: "Restores a unit's body to its original and uncorrupted state",
  }],
  ["corruption", {
    type: "type",
    title: "Corruption",
    description: "Corrupts the unit, replacing their bodyparts with something of demonic origin",
  }],
  ["treatment", {
    type: "type",
    title: "Treatment",
    description: "Various procedures to heal a unit in both body and mind",
  }],
  ["fleshshape", {
    type: "type",
    title: "Flesh-Shaping",
    description: "A collection of invasive procedure to alter the physique of a unit",
  }],
]);

/** @type {Object.<string, UnitActionTag>} */
setup.TAG_UNITACTION = {};
for (const [key, value] of UNIT_ACTION_TAGS) {
  setup.TAG_UNITACTION[key] = value;
}
Object.freeze(setup.TAG_UNITACTION);

