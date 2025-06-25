/**
 * @file rarity.js
 * @module Rarity
 * @description
 * Provides the Rarity class and the rarity registry for deck-building and event/quest systems.
 * Handles rarity metadata, frequency, forced status, and utility methods for sorting and weighted selection.
 */

/**
 * Represents the rarity of a card, event, or quest in the game.
 * Includes metadata, frequency, forced status, and utility methods for display and sorting.
 *
 * @class Rarity
 * @extends setup.TwineClass
 * @property {string} key - Unique identifier for this rarity.
 * @property {string} name - Display name for this rarity.
 * @property {string} description - Description of this rarity.
 * @property {number|undefined} frequency - How many times this rarity appears in a deck (if applicable).
 * @property {boolean|undefined} is_forced - If true, this rarity is always included.
 */
setup.Rarity = class Rarity extends setup.TwineClass {
  /**
   * Constructs a new Rarity instance.
   * @param {Object} args - Arguments for rarity construction.
   * @param {string} args.key - Unique key for this rarity.
   * @param {string} args.name - Display name.
   * @param {string} args.description - Description.
   * @param {number} [args.frequency] - Frequency in deck (optional).
   * @param {boolean} [args.is_forced] - If true, always included (optional).
   * @throws {Error} If key or name is missing.
   */
  constructor({ key, name, description, frequency, is_forced }) {
    super();
    if (!key) throw new Error("null key for rarity");
    this.key = key;
    if (!name) throw new Error(`null name for rarity ${key}`);
    this.name = name;
    this.description = description;
    this.frequency = frequency;
    this.is_forced = is_forced;
  }

  /**
   * Returns the display name for this rarity.
   * @returns {string}
   */
  getName() { return this.name; }

  /**
   * Returns the description for this rarity.
   * @returns {string}
   */
  getDescription() { return this.description; }

  /**
   * Returns a debug string for this rarity.
   * @returns {string}
   */
  text() { return `setup.rarity.${this.key}`; }

  /**
   * Returns the CSS class for the triangle icon representing this rarity.
   * @returns {string}
   */
  getIconTriangleClass() { return `rarity-${this.key}`; }

  /**
   * Returns the CSS class for the text color of this rarity.
   * @returns {string}
   */
  getTextColorClass() { return `text-rarity-${this.key}`; }

  /**
   * Returns the CSS class for the border color of this rarity.
   * @returns {string}
   */
  getBorderColorClass() { return `border-rarity-${this.key}`; }

  /**
   * Returns the image path for this rarity's icon.
   * @returns {string}
   */
  getImage() { return `img/rarity/${this.key}.svg`; }

  /**
   * Returns an HTML string for the rarity's icon with a tooltip.
   * @returns {string}
   */
  getImageRep() {
    const img = `<img src="${setup.escapeHtml(setup.resolveImageUrl(this.getImage()))}" />`;
    return `<span class="trait" data-tooltip="${this.getName()}">${img}</span>`;
  }

  /**
   * Returns an HTML string for the rarity (icon with tooltip).
   * @returns {string}
   */
  rep() { return this.getImageRep(); }

  /**
   * Returns the frequency for this rarity (number of times in a deck).
   * Returns 0 if not set.
   * @returns {number}
   */
  getFrequency() { return typeof this.frequency === "number" ? this.frequency : 0; }

  /**
   * Returns true if this rarity is forced (always included).
   * @returns {boolean}
   */
  isForced() { return !!this.is_forced; }

  /**
   * Returns a weighted, sorted list of non-forced rarities (most to least common), with forced rarities first.
   * Used for deck-building and event/quest selection.
   * @returns {setup.Rarity[]}
   */
  static getRandomRarityOrderWeighted() {
    const allRarities = Object.values(setup.rarity);
    const forced = [];
    const nonForced = [];
    for (const rarity of allRarities) {
      if (rarity.isForced()) forced.push(rarity);
      else if (rarity.getFrequency()) nonForced.push(rarity);
    }
    nonForced.sort((a, b) => b.getFrequency() - a.getFrequency());
    const max_frequency = setup.rarity.rare.getFrequency();
    const rarity_sampled = setup.rng.sampleArray(
      nonForced.map(rarity => [rarity, Math.min(max_frequency, rarity.getFrequency())]), true
    );
    const idx = nonForced.indexOf(rarity_sampled);
    if (idx !== -1) nonForced.splice(idx, 1);
    return forced.concat(nonForced);
  }

  /**
   * Compares two rarities by their order in the rarity registry.
   * @param {setup.Rarity} rarity1 - The first rarity to compare.
   * @param {setup.Rarity} rarity2 - The second rarity to compare.
   * @returns {number} Negative if rarity1 < rarity2, positive if >, 0 if equal.
   */
  static RarityCmp(rarity1, rarity2) {
    const keys = Object.keys(setup.rarity);
    const idx1 = keys.indexOf(rarity1.key);
    const idx2 = keys.indexOf(rarity2.key);
    return idx1 - idx2;
  }
}

// Rarity registry: defines all available rarities in the game.
// Each rarity is registered as a property of setup.rarity.
setup.rarity.always = new setup.Rarity({
  key: "always",
  name: "Always",
  description: "Will triggered/scouted whenever possible",
  is_forced: true,
});

setup.rarity.common = new setup.Rarity({
  key: "common",
  name: "Common",
  description: "1 every 2 quests/events",
  frequency: setup.RARITY_COMMON_FREQUENCY,
});

setup.rarity.uncommon = new setup.Rarity({
  key: "uncommon",
  name: "Uncommon",
  description: "1 every 4 quests/events",
  frequency: setup.RARITY_UNCOMMON_FREQUENCY,
});

setup.rarity.rare = new setup.Rarity({
  key: "rare",
  name: "Rare",
  description: "1 every 8 quests/events",
  frequency: setup.RARITY_RARE_FREQUENCY,
});

setup.rarity.epic = new setup.Rarity({
  key: "epic",
  name: "Epic",
  description: "1 every 16 quests/events",
  frequency: setup.RARITY_EPIC_FREQUENCY,
});

setup.rarity.legendary = new setup.Rarity({
  key: "legendary",
  name: "Legendary",
  description: "1 every 32 quests/events",
  frequency: setup.RARITY_LEGENDARY_FREQUENCY,
});

setup.rarity.never = new setup.Rarity({
  key: "never",
  name: "Never",
  description: "Never gets scouted/triggered",
  frequency: setup.RARITY_NEVER_FREQUENCY,
});
