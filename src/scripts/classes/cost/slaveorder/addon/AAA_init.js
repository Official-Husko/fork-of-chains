

/**
 * Contains helper constructor functions for the subclasses of setup.SlaveOrderAddonBase in setup.SlaveOrderAddonImpl 
 * @type {setup_SlaveOrderAddon}
 */
// @ts-ignore
setup.SlaveOrderAddon = {}

/** Contains the subclasses (implementations) of setup.SlaveOrderAddonBase */
setup.SlaveOrderAddonImpl = {}

/** 
 * Base of all slave order addons defined in setup.SlaveOrderAddonImpl
 *  (abstract class)
 */
setup.SlaveOrderAddonBase = class SlaveOrderAddonBase extends setup.TwineClass {
  constructor(res) {
    super()

  }

  /** @abstract */
  text() {
    throw new Error(`Implement`)
  }

  /** @abstract */
  apply(slave_order) {
  }

  /** @abstract */
  explain() {
    throw new Error(`Implement`)
  }

  /** Initializes setup.SlaveOrderAddon */
  static initConstructors() {
    // freeze the classes namespace
    //  when trying to add a new class after this, it will throw an error
    //  if it happens, that most likely means the file load order is wrong
    setup.SlaveOrderAddonImpl = Object.freeze(setup.SlaveOrderAddonImpl)
    
    for (const [k, addonclass] of Object.entries(setup.SlaveOrderAddonImpl)) {
      setup.SlaveOrderAddon[k] = function(...args) { return new addonclass(...args) }
      setup.SlaveOrderAddon[k].class = addonclass
    }
  }
  
  static deserialize(classname, data) {
      const addonclass = setup.SlaveOrderAddonImpl[classname]
      const obj = Object.create(addonclass.prototype)
      return Object.assign(obj, data)
  }

  // used by Twine serialization (overrides default from TwineClass)
  toJSON() {
    const data = {}
    setup.copyProperties(data, this)
    return JSON.reviveWrapper(`setup.SlaveOrderAddonBase.deserialize("${this.constructor.name}", $ReviveData$)`, data)
  }

}
