/**
 * @file banterinstance.js
 * @module BanterInstance
 * @description
 * Represents the result and context of a banter event between two units, including the initiator, target, friendship change, and generated flavor text.
 * Provides methods to access the involved units, the friendship delta, and the generated banter text for display or further logic.
 */

setup.BanterInstance = class BanterInstance {
  /**
   * Constructs a BanterInstance representing a banter event between two units.
   * Stores the keys of the initiator and target, the friendship change, and generates the flavor text.
   *
   * @param {setup.Unit} initiator - The unit initiating the banter.
   * @param {setup.Unit} target - The target unit of the banter.
   * @param {number} friendship_amt - The amount of friendship gained or lost as a result of the banter.
   */
  constructor(
    initiator,
    target,
    friendship_amt,
  ) {
    this.initiator_key = initiator.key
    this.target_key = target.key
    this.friendship_amt = friendship_amt
    this.text = setup.Text.Banter.generate(initiator, target, friendship_amt)
  }

  /**
   * Returns the generated flavor text for this banter event.
   * @returns {string|string[]} The banter text, suitable for display.
   */
  getTexts() { return this.text }

  /**
   * Returns the amount of friendship gained or lost in this banter event.
   * @returns {number} The friendship delta.
   */
  getFriendshipAmt() {
    return this.friendship_amt
  }

  /**
   * Returns an object containing both the initiator and target units as properties 'a' and 'b'.
   * Useful for templating or further logic that needs both units.
   * @returns {{a: setup.Unit, b: setup.Unit}} The actor object.
   */
  getActorObj() {
    return {
      a: this.getInitiator(),
      b: this.getTarget(),
    }
  }

  /**
   * Retrieves the initiator unit object from the global state using its key.
   * @returns {setup.Unit} The initiator unit.
   */
  getInitiator() {
    return State.variables.unit[this.initiator_key]
  }

  /**
   * Retrieves the target unit object from the global state using its key.
   * @returns {setup.Unit} The target unit.
   */
  getTarget() {
    return State.variables.unit[this.target_key]
  }
}
