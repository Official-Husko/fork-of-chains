
/**
 * @namespace TAG_UNITACTION
 * @description Defines various unit action types and their properties for the game system.
 * Each action type represents a different category of actions that can be performed on units.
 */
setup.TAG_UNITACTION = {
  /** 
   * @property {Object} training
   * @description Training action type for skill development
   * @property {string} type - Identifier for action category
   * @property {string} title - Display name for the action
   * @property {string} description - Detailed explanation of the action's effects
   */
  training: {
    type: 'type',
    title: 'Training',
    description: 'Trains the slave in the art of servicing their betters',
  },

  /** 
   * @property {Object} purification
   * @description Action type for restoring units to original state
   * @property {string} type - Identifier for action category
   * @property {string} title - Display name for the action
   * @property {string} description - Detailed explanation of the action's effects
   */
  purification: {
    type: 'type',
    title: 'Purification',
    description: "Restores a unit's body to its original and uncorrupted state",
  },

  /** 
   * @property {Object} corruption
   * @description Action type for demonic transformation
   * @property {string} type - Identifier for action category
   * @property {string} title - Display name for the action
   * @property {string} description - Detailed explanation of the action's effects
   */
  corruption: {
    type: 'type',
    title: 'Corruption',
    description: 'Corrupts the unit, replacing their bodyparts with something of demonic origin',
  },

  /** 
   * @property {Object} treatment
   * @description Action type for healing and recovery
   * @property {string} type - Identifier for action category
   * @property {string} title - Display name for the action
   * @property {string} description - Detailed explanation of the action's effects
   */
  treatment: {
    type: 'type',
    title: 'Treatment',
    description: "Various procedures to heal a unit in both body and mind",
  },

  /** 
   * @property {Object} fleshshape
   * @description Action type for physical modification
   * @property {string} type - Identifier for action category
   * @property {string} title - Display name for the action
   * @property {string} description - Detailed explanation of the action's effects
   */
  fleshshape: {
    type: 'type',
    title: 'Flesh-Shaping',
    description: 'A collection of invasive procedure to alter the physique of a unit',
  },
}

// Freeze the object to prevent modifications during runtime
Object.freeze(setup.TAG_UNITACTION)

