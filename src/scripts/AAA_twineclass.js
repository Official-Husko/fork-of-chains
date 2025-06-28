/**
 * @file AAA_twineclass.js
 * @description Provides base classes for Twine game objects to ensure robust serialization, cloning, and compatibility with the Twine save system. All serializable classes should inherit from these to guarantee correct save/load and deep copy behavior. These classes are designed for extensibility and future-proofing, and should be used even for objects not directly stored in state variables.
 */

/**
 * Base class for all serializable game objects in Twine.
 *
 * Inherit from this class to ensure your object can be safely cloned and serialized for Twine's save system.
 *
 * @class
 */
setup.TwineClass = class TwineClass {
  /**
   * Creates a deep clone of this object, preserving its class and all properties.
   * Uses the class constructor and copies all enumerable properties.
   *
   * @returns {this} A new instance of the same class with identical properties.
   */
  clone() {
    // @ts-ignore
    return setup.rebuildClassObject(this.constructor, this)
  }

  /**
   * Serializes this object for Twine's save system.
   * Includes the class name for correct deserialization.
   *
   * @returns {Object} A plain object suitable for JSON serialization.
   */
  toJSON() {
    return setup.toJsonHelper(this.constructor.name, this)
  }
}

/**
 * Base class for serializable game objects not defined directly on the global `setup` object.
 *
 * Inherit from this class if your class is nested or not attached to `setup`.
 * Allows specifying a custom container path for deserialization.
 *
 * @class
 */
setup.TwineClassCustom = class TwineClassCustom {
  /**
   * Returns the container path for this class, used during deserialization.
   * Override this in subclasses if your class is not on `setup`.
   *
   * @returns {string} The container path (e.g., "setup", "setup.a.b.c").
   */
  getContainer() {
    return "setup"
  }

  /**
   * Creates a deep clone of this object, preserving its class and all properties.
   *
   * @returns {this} A new instance of the same class with identical properties.
   */
  clone() {
    // @ts-ignore
    return setup.rebuildClassObject(this.constructor, this)
  }

  /**
   * Serializes this object for Twine's save system, including the container path.
   *
   * @returns {Object} A plain object suitable for JSON serialization.
   */
  toJSON() {
    return setup.toJsonHelper(this.constructor.name, this, this.getContainer())
  }
}


