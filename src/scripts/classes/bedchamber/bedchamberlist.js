/**
 * @file bedchamberlist.js
 * @module BedchamberList
 * @description
 * Provides the BedchamberList class for managing a collection of Bedchamber instances.
 * Handles creation, storage, and filtered retrieval of bedchambers.
 */

/**
 * BedchamberList manages a list of Bedchamber keys and provides methods to create and retrieve bedchambers.
 * @class
 */
setup.BedchamberList = class BedchamberList extends setup.TwineClass {
  /**
   * @type {number[]}
   * Array of bedchamber keys managed by this list.
   */
  bedchamber_keys;

  /**
   * Constructs a new BedchamberList instance.
   */
  constructor() {
    super();
    this.bedchamber_keys = [];
  }

  /**
   * Creates a new Bedchamber, adds it to the list, and returns it.
   * @returns {setup.Bedchamber}
   */
  newBedchamber() {
    const bedchamber = new setup.Bedchamber();
    this.bedchamber_keys.push(bedchamber.key);
    return bedchamber;
  }

  /**
   * Returns all bedchambers, optionally filtered by a filter object.
   * Supported filters: { slaver: setup.Unit }
   * @param {Object} [filter_dict] - Optional filter criteria.
   * @param {setup.Unit} [filter_dict.slaver] - Only return bedchambers owned by this slaver.
   * @returns {setup.Bedchamber[]}
   */
  getBedchambers(filter_dict) {
    return this.bedchamber_keys
      .map(key => State.variables.bedchamber[key])
      .filter(bedchamber => {
        if (!bedchamber) return false;
        if (filter_dict && 'slaver' in filter_dict && bedchamber.getSlaver() !== filter_dict.slaver) {
          return false;
        }
        return true;
      });
  }
};
