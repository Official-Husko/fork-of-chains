/**
 * @file bedchamber.js
 * @module Bedchamber
 * @description
 * Provides the Bedchamber class and configuration objects for managing slave quarters, their rules, furniture, and owner/slaver relationships in the game.
 * Includes option definitions, chance tables for auto-assignment, and all logic for furniture, kindness/cruelty, and UI menu construction.
 *
 * @typedef {Object} BedchamberOption
 *   Represents a single rule/option for a bedchamber (e.g., walk, orgasm, speech).
 * @property {string} text - Human-readable description of the rule.
 * @property {number} kindness - Kindness score for this rule (used for mood/relationship calculations).
 * @property {number} cruelty - Cruelty score for this rule (used for mood/relationship calculations).
 *
 * @typedef {Object} BedchamberOptionSet
 *   Maps option keys (e.g., 'walk', 'orgasm') to their possible values and rule objects.
 *
 * @typedef {Object} BedchamberOptionChances
 *   Maps slaver personality keys to option chance tables for auto-assignment.
 *
 * @typedef {any} JQLite
 *   Placeholder for the JQLite type used in UI rendering.
 *
 * @typedef {Readonly<Record<string, Readonly<Record<string, {text: string, kindness: number, cruelty: number}>>>>} BedchamberOptions
 * Structure for bedchamber options config object.
 */

import { domCardRep } from "../../dom/util/cardnamerep"
import { menuItemAction, menuItemExtras, menuItemText, menuItemTitle } from "../../ui/menu"

/**
 * Allowed option keys for bedchamber rules. Use this constant to avoid typos and for iteration.
 * @type {ReadonlyArray<string>}
 */
const BEDCHAMBER_OPTION_KEYS = Object.freeze([
  "walk",
  "orgasm",
  "speech",
  "food",
  "share",
]);

/**
 * Bedchamber options configuration. Deeply frozen for immutability.
 * @type {BedchamberOptions}
 */
setup.BEDCHAMBER_OPTIONS = /** @type {BedchamberOptions} */ (Object.freeze({
  walk: Object.freeze({
    walk: Object.freeze({ text: "can walk freely", kindness: 1, cruelty: 0 }),
    crawl: Object.freeze({ text: "must crawl on all fours", kindness: 0, cruelty: 1 }),
  }),
  orgasm: Object.freeze({
    yes: Object.freeze({ text: "can reach orgasm", kindness: 1, cruelty: 0 }),
    no: Object.freeze({ text: "are denied all orgasms", kindness: 0, cruelty: 1 }),
  }),
  speech: Object.freeze({
    full: Object.freeze({ text: "can talk like normal", kindness: 1, cruelty: 0 }),
    animal: Object.freeze({ text: "can only make animal-like noises", kindness: 0, cruelty: 1 }),
    none: Object.freeze({ text: "are not allowed to make any humanlike noises", kindness: 0, cruelty: 0 }),
  }),
  food: Object.freeze({
    normal: Object.freeze({ text: "eat normal food", kindness: 1, cruelty: 0 }),
    cum: Object.freeze({ text: "can only eat food splattered with cum", kindness: 0, cruelty: 1 }),
    milk: Object.freeze({ text: "can only eat food mixed with humanlike milk", kindness: 0, cruelty: 1 }),
  }),
  share: Object.freeze({
    yes: Object.freeze({ text: "can be used by other slavers", kindness: 0, cruelty: 0 }),
    no: Object.freeze({ text: "not usable by other slavers", kindness: 0, cruelty: 0 }),
  }),
}));

/**
 * Chance tables for auto-assigning bedchamber options based on slaver personality.
 * @type {BedchamberOptionChances}
 */
setup.BEDCHAMBER_OPTION_CHANCES = Object.freeze({
  friendly: Object.freeze({
    walk: Object.freeze({ walk: 0.9, crawl: 0.1 }),
    orgasm: Object.freeze({ yes: 0.9, no: 0.1 }),
    speech: Object.freeze({ full: 0.9, animal: 0.05, none: 0.05 }),
    food: Object.freeze({ normal: 0.9, cum: 0.05, milk: 0.05 }),
    share: Object.freeze({ yes: 0.95, no: 0.05 }),
  }),
  bold: Object.freeze({
    walk: Object.freeze({ walk: 0.5, crawl: 0.5 }),
    orgasm: Object.freeze({ yes: 0.5, no: 0.5 }),
    speech: Object.freeze({ full: 0.45, animal: 0.05, none: 0.5 }),
    food: Object.freeze({ normal: 0.8, cum: 0.1, milk: 0.1 }),
    share: Object.freeze({ yes: 0.5, no: 0.5 }),
  }),
  cool: Object.freeze({
    walk: Object.freeze({ walk: 0.5, crawl: 0.5 }),
    orgasm: Object.freeze({ yes: 0.1, no: 0.9 }),
    speech: Object.freeze({ full: 0.01, animal: 0.09, none: 0.9 }),
    food: Object.freeze({ normal: 0.9, cum: 0.05, milk: 0.05 }),
    share: Object.freeze({ yes: 0.7, no: 0.3 }),
  }),
  witty: Object.freeze({
    walk: Object.freeze({ walk: 0.3, crawl: 0.7 }),
    orgasm: Object.freeze({ yes: 0.2, no: 0.8 }),
    speech: Object.freeze({ full: 0.25, animal: 0.7, none: 0.05 }),
    food: Object.freeze({ normal: 0.35, cum: 0.35, milk: 0.35 }),
    share: Object.freeze({ yes: 0.8, no: 0.2 }),
  }),
  debauched: Object.freeze({
    walk: Object.freeze({ walk: 0.1, crawl: 0.9 }),
    orgasm: Object.freeze({ yes: 0.1, no: 0.9 }),
    speech: Object.freeze({ full: 0.1, animal: 0.4, none: 0.5 }),
    food: Object.freeze({ normal: 0.1, cum: 0.45, milk: 0.45 }),
    share: Object.freeze({ yes: 0.6, no: 0.4 }),
  }),
});

// Freeze config objects for immutability and safety
setup.BEDCHAMBER_OPTIONS = Object.freeze(setup.BEDCHAMBER_OPTIONS)
setup.BEDCHAMBER_OPTION_CHANCES = Object.freeze(setup.BEDCHAMBER_OPTION_CHANCES)

// Define and freeze the allowed option keys for consistency and to avoid typos

/**
 * The Bedchamber class represents a slave room, its owner, rules, furniture, and assigned slaves.
 * Provides methods for managing furniture, rules, kindness/cruelty, and UI menu construction.
 */
setup.Bedchamber = class Bedchamber extends setup.TwineClass {
  /**
   * @type {{ [key: string]: string | null }}
   * Holds the furniture key for each slot.
   */
  furniture_map;

  /**
   * @type {{ walk: string; orgasm: string; speech: string; food: string; share: string; [key: string]: string }}
   * Holds the current option value for each rule.
   */
  option_map;

  /**
   * Constructs a new Bedchamber instance, assigns a unique key, initializes rules and furniture, and registers itself in the global state.
   */
  constructor() {
    super()

    this.key = State.variables.Bedchamber_keygen
    State.variables.Bedchamber_keygen += 1

    this.name = `Bedchamber ${this.key}`

    this.furniture_map = {};
    for (const slot_key in setup.furnitureslot) {
      this.furniture_map[slot_key] = null;
    }

    this.option_map = {
      walk: 'walk',
      orgasm: 'yes',
      speech: 'full',
      food: 'normal',
      share: 'yes',
    };

    this.slaver_key = State.variables.unit.player.key;

    if (this.key in State.variables.bedchamber) throw new Error(`Bedchamber ${this.key} already exists`)
    State.variables.bedchamber[this.key] = this

    this.duty_keys = []
    for (let i = 0; i < 2; ++i) {
      // @ts-ignore
      const duty = State.variables.dutylist.addDuty(
        new setup.DutyInstanceBedchamberSlave({
          bedchamber: this,
          index: i,
        })
      )
      this.duty_keys.push(duty.key)
    }
  }

  /**
   * Returns a UI representation of this bedchamber for display.
   * @returns {string|JQLite} The rendered representation.
   */
  rep() {
    return setup.repMessage(this, 'bedchambercardkey')
  }

  /**
   * Returns the current option map (rules) for this bedchamber.
   * @returns {Object<string, string>} The option map.
   */
  getOptionMap() { return this.option_map }

  /**
   * Returns the slaver (owner) unit object for this bedchamber.
   * @returns {setup.Unit} The slaver unit.
   */
  getSlaver() {
    if (!(this.slaver_key)) throw new Error(`null slaver key at ${this.key}`)
    return State.variables.unit[this.slaver_key]
  }

  /**
   * Sets the slaver (owner) for this bedchamber and updates options if needed.
   * @param {setup.Unit} unit - The new slaver unit.
   */
  setSlaver(unit) {
    if (!unit) throw new Error(`must have unit for set slaver at ${this.key}`)
    const old_slaver = this.getSlaver()
    this.slaver_key = unit.key
    if (unit != State.variables.unit.player) {
      this.autoSetOptions()
    }
    old_slaver.resetCache()
    unit.resetCache()
  }

  /**
   * Returns all duty instances (slave assignments) for this bedchamber.
   * @returns {setup.DutyInstanceBedchamberSlave[]}
   */
  getDuties() {
    // @ts-ignore
    return this.duty_keys.map(a => State.variables.duty[a])
  }

  /**
   * Returns all currently available slave units in this bedchamber.
   * @returns {setup.Unit[]}
   */
  getSlaves() {
    return this.getDuties()
      .map(duty => duty.getUnitIfAvailable())
      .filter(unit => !!unit)
  }

  /**
   * Returns all assigned slave units (even if not currently available).
   * @returns {setup.Unit[]}
   */
  getAssignedSlaves() {
    return this.getDuties()
      .map(duty => duty.getAssignedUnit())
      .filter(unit => !!unit)
  }

  /**
   * Returns the furniture object for a given slot, or the default if none is assigned.
   * @param {setup.FurnitureSlot} slot
   * @returns {setup.Furniture|null|undefined} The furniture object or undefined if not found.
   */
  getFurniture(slot) {
    let item;
    let key = this.furniture_map[slot.key];
    if (key) {
      item = setup.item[key];
    } else {
      item = slot.getBasicFurniture();
    }
    return item && (item instanceof setup.Furniture) ? item : undefined;
  }

  /**
   * Checks if this bedchamber contains the given furniture.
   * @param {setup.Furniture} furniture
   * @returns {boolean}
   */
  isHasFurniture(furniture) {
    return this.getFurniture(furniture.getSlot()) === furniture;
  }

  /**
   * Automatically assigns the best available furniture to each slot based on stat modifiers.
   */
  autoAssignFurniture() {
    /** @type {setup.Furniture[]} */
    // @ts-ignore
    const furnitures = State.variables.inventory.getItems().map(item_obj => item_obj.item).filter(
      item => item instanceof setup.Furniture
    );
    for (const slot of Object.values(setup.furnitureslot)) {
      const matches = furnitures.filter(furniture => furniture.getSlot() === slot);
      if (!matches.length) continue;
      matches.sort((f1, f2) => {
        const sum1 = f1.getSkillMods().reduce((a, b) => a + b, 0);
        const sum2 = f2.getSkillMods().reduce((a, b) => a + b, 0);
        return sum2 - sum1;
      });
      const best_match = matches[0];
      const current = this.getFurniture(slot);
      const current_sum = current && current.getSkillMods ? current.getSkillMods().reduce((a, b) => a + b, 0) : -Infinity;
      const best_match_sum = best_match.getSkillMods().reduce((a, b) => a + b, 0);
      if (current_sum < best_match_sum) {
        this.setFurniture(slot, best_match);
      }
    }
  }

  /**
   * Sets the furniture for a given slot, handling inventory and cache updates.
   * @param {setup.FurnitureSlot} slot
   * @param {setup.Furniture|null} furniture
   */
  setFurniture(slot, furniture) {
    if (furniture && furniture.getSlot() !== slot) throw new Error(`furniture at wrong slot: ${furniture.key} not at ${slot.key}`);
    let existing = this.getFurniture(slot);
    if (existing && !existing.isBasic()) {
      State.variables.notification.disable();
      State.variables.inventory.addItem(existing);
      State.variables.notification.enable();
    }
    if (furniture) {
      State.variables.notification.disable();
      State.variables.inventory.removeItem(furniture);
      State.variables.notification.enable();
      this.furniture_map[slot.key] = furniture.key;
    } else {
      this.furniture_map[slot.key] = null;
    }
    this.getSlaver().resetCache();
  }

  /**
   * Calculates the total skill addition from all furniture and assigned slaves in this bedchamber.
   * @returns {number[]} Array of skill additions for each skill index.
   */
  getSkillAddition() {
    let additions = Array(setup.skill.length).fill(0);
    for (const slot of Object.values(setup.furnitureslot)) {
      const furniture = this.getFurniture(slot);
      if (!furniture) continue;
      const furnitureadd = furniture.getSkillMods();
      for (let i = 0; i < additions.length; ++i) {
        additions[i] += furnitureadd[i];
      }
    }
    let unit = this.getSlaver();
    if (unit) {
      let slaves = this.getSlaves();
      for (let i = 0; i < slaves.length; ++i) {
        let slave = slaves[i];
        let friendship = State.variables.friendship.getFriendship(unit, slave);
        let statgain = 0;
        for (let j = 0; j < setup.BEDCHAMBER_SLAVE_SKILL_GAIN.length; ++j) {
          let thres = setup.BEDCHAMBER_SLAVE_SKILL_GAIN[j];
          if (Math.abs(friendship) >= thres) ++statgain;
        }
        for (let j = 0; j < additions.length; ++j) {
          additions[j] += statgain;
        }
      }
    }
    return additions;
  }

  /**
   * Automatically sets bedchamber options based on the current slaver's personality and the option chance tables.
   */
  autoSetOptions() {
    let slaver = this.getSlaver();
    if (!slaver) throw new Error(`missing slaver??`);
    let speechkey = slaver.getSpeech().key;
    if (!(speechkey in setup.BEDCHAMBER_OPTION_CHANCES)) throw new Error(`Missing ${speechkey} in setup bedchamber options chances`);
    let optionobj = /** @type {any} */ (setup.BEDCHAMBER_OPTION_CHANCES)[speechkey];
    for (const optionkey in optionobj) {
      let chance_obj = optionobj[optionkey];
      this.option_map[optionkey] = setup.rng.sampleObject(chance_obj, /* force_return = */ true);
    }
  }

  /**
   * Returns the current value for a given option name.
   * @param {string} option_name
   * @returns {string}
   */
  getOption(option_name) {
    if (!(option_name in setup.BEDCHAMBER_OPTIONS)) throw new Error(`invalid option for bedchamber: ${option_name}`);
    return this.option_map[option_name];
  }

  /**
   * Calculates the total kindness score for this bedchamber based on its rules.
   * @returns {number}
   */
  getKindness() {
    let kindness = 0;
    for (const [optionkey, optionval] of Object.entries(this.option_map)) {
      if (!BEDCHAMBER_OPTION_KEYS.includes(optionkey)) continue;
      const opt = setup.BEDCHAMBER_OPTIONS[optionkey]?.[optionval];
      kindness += opt ? opt.kindness : 0;
    }
    return kindness;
  }

  /**
   * Calculates the total cruelty score for this bedchamber based on its rules.
   * @returns {number}
   */
  getCruelty() {
    let cruelty = 0;
    for (const [optionkey, optionval] of Object.entries(this.option_map)) {
      if (!BEDCHAMBER_OPTION_KEYS.includes(optionkey)) continue;
      const opt = setup.BEDCHAMBER_OPTIONS[optionkey]?.[optionval];
      cruelty += opt ? opt.cruelty : 0;
    }
    return cruelty;
  }

  /**
   * Returns the display name of this bedchamber.
   * @returns {string}
   */
  getName() { return this.name }

  /**
   * Returns true if this bedchamber is private (not shared with other slavers).
   * @returns {boolean}
   */
  isPrivate() { return this.getOption('share') === 'no' }

  /**
   * Constructs the UI menu for this bedchamber, including actions and extra options.
   * @param {boolean} [show_actions] - Whether to include action buttons.
   * @returns {Array<JQLite>} The menu items for rendering.
   */
  getMenu(show_actions) {
    const toolbar_items = []

    toolbar_items.push(menuItemTitle({
      text: domCardRep(this),
    }))

    toolbar_items.push(menuItemText({
      text: `${this.getSlaver().rep()}`,
    }))

    if (show_actions) {
      if (State.variables.gPassage != 'BedchamberChangeFurniture') {
        toolbar_items.push(menuItemAction({
          text: `Edit`,
          tooltip: `Add / remove furnitures from this room`,
          callback: () => {
            // @ts-ignore
            State.variables.gBedchamber_key = this.key
            // @ts-ignore
            State.variables.gBedchamberChangeFurnitureReturnPassage = State.variables.gPassage
            setup.DOM.Nav.goto('BedchamberChangeFurniture')
          }
        }))
      }

      toolbar_items.push(menuItemAction({
        text: `Auto-Furnish`,
        tooltip: `Automatically put the best furnitures for this room`,
        callback: () => {
          this.autoAssignFurniture()
          setup.DOM.Nav.goto()
        }
      }))

      toolbar_items.push(menuItemExtras({
        children: [
          menuItemAction({
            text: `Change rules`,
            tooltip: `Change the slave rules of your bedroom, which may change whether the slaves will like you or be afraid of you.`,
            callback: () => {
              // @ts-ignore
              State.variables.gBedchamber_key = this.key
              setup.DOM.Nav.goto('BedchamberOptionsChange')
            },
          }),
          menuItemAction({
            text: `Change owner`,
            tooltip: `Give the room a different slaver owner`,
            callback: () => {
              // @ts-ignore
              State.variables.gBedchamber_key = this.key
              setup.DOM.Nav.goto('BedchamberOwnerChange')
            },
          }),
          menuItemAction({
            text: `Rename`,
            tooltip: `Rename the room`,
            callback: () => {
              // @ts-ignore
              State.variables.gBedchamber_key = this.key
              setup.DOM.Nav.goto('BedchamberRename')
            },
          }),
        ],
      }))
    }

    return toolbar_items
  }

}
