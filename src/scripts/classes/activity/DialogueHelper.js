/**
 * DialogueHelper Class
 * -----------------------------------------------------------------------------
 * Utility class for creating and managing dialogue objects for activities.
 * Provides static methods to generate empty dialogue structures for a given actor,
 * ensuring all required speech types are present and initialized.
 *
 * Key Responsibilities:
 * - Generates empty dialogue objects for use in activity templates or dev tools.
 * - Ensures all supported speech types are included and initialized to empty arrays.
 *
 * Usage Example:
 *   const dialogue = setup.DialogueHelper.createEmptyDialogue("actorName");
 *
 * Structure:
 *   setup.DialogueHelper = class DialogueHelper extends setup.TwineClass { ... }
 */

setup.DialogueHelper = class DialogueHelper extends setup.TwineClass {
  /**
   * Supported speech types for dialogue.
   * @type {readonly string[]}
   */
  static SPEECH_TYPES = Object.freeze(["friendly", "bold", "cool", "witty", "debauched"]);

  /**
   * Creates an empty dialogue object for a given actor.
   *
   * @param {string} actor_name - The name of the actor for whom to create the dialogue.
   * @returns {Dialogue} Dialogue object with all speech types initialized to empty strings.
   */
  static createEmptyDialogue(actor_name) {
    /** @type {DialogueText} */
    const res = {
      friendly: [""],
      bold: [""],
      cool: [""],
      witty: [""],
      debauched: [""],
    };
    return {
      actor: actor_name,
      texts: res,
    };
  }
}

