/**
 * Trait Tag Definitions for Units
 * -----------------------------------
 * This object defines all trait tags used to categorize and describe unit traits in the game.
 *
 * @typedef {{
 *   type: string,
 *   title: string,
 *   description: string
 * }} TraitTag
 *
 * @type {Object.<string, TraitTag>}
 *
 * Example usage:
 *   // Access the title of the "race" trait
 *   const raceTitle = setup.TAG_TRAIT.race.title;
 *
 * Expected structure:
 *   setup.TAG_TRAIT = {
 *     tagKey: {
 *       type: "type",
 *       title: "Title",
 *       description: "Description",
 *     },
 *     ...
 *   }
 */
setup.TAG_TRAIT = {
  gender: {
    type: "type",
    title: "Gender",
    description: "Which genitals the unit has",
  },
  race: {
    type: "type",
    title: "Race",
    description: "The umbrella species of the unit",
  },
  subrace: {
    type: "type",
    title: "Subrace",
    description: "The specific species of the unit",
  },
  bg: {
    type: "type",
    title: "Background",
    description: "What the unit hails from",
  },
  physical: {
    type: "type",
    title: "Physical",
    description: "Physical attributes of the unit",
  },
  per: {
    type: "type",
    title: "Personality",
    description: "The unit's personalities",
  },
  skill: {
    type: "type",
    title: "Skill",
    description: "Special skills possessed by the unit",
  },
  perk: {
    type: "type",
    title: "Perk",
    description: "Perks learnable by units at certain levels",
  },
  blessingcurse: {
    type: "type",
    title: "Blessing / Curse",
    description: "Traits that protect or amplify ailments on a unit",
  },
  equipment: {
    type: "type",
    title: "Equipment",
    description: "How the unit dresses",
  },
  training: {
    type: "type",
    title: "Training",
    description: "Slave trainings",
  },
  will: {
    type: "type",
    title: "Defiance",
    description: "Prevents slave from being trained until removed",
  },
  computed: {
    type: "type",
    title: "Computed",
    description: "Traits that are computed based on other factors",
  },
  skin: {
    type: "type",
    title: "Bodyparts",
    description: "Non-human-like bodyparts of the unit",
  },
  temporary: {
    type: "type",
    title: "Temporary",
    description: "Traits that will go away with time",
  },
};

// Freeze the object to prevent modifications during runtime
Object.freeze(setup.TAG_TRAIT);