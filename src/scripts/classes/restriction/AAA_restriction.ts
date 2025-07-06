// @ts-nocheck


/**
 * Contains helper constructor functions for the subclasses of setup.Restriction in setup.qresImpl 
 * @type {setup_qres}
 */
// @ts-ignore
setup.qres = {}

/** Contains the subclasses (implementations) of setup.Restriction */
setup.qresImpl = {}


/** 
 * Base class of all restrictions (defined in setup.qresImpl)
 *  (abstract class)
 */
setup.Restriction = class Restriction extends setup.TwineClass {
  
  /** Initializes setup.qres */
  static initConstructors() {
    // freeze the classes namespace
    //  when trying to add a new class after this, it will throw an error
    //  if it happens, that most likely means the file load order is wrong
    setup.qresImpl = Object.freeze(setup.qresImpl)
    
    for (const [k, restrclass] of Object.entries(setup.qresImpl)) {
      setup.qres[k] = function(...args) { return new restrclass(...args) }
      setup.qres[k].class = restrclass
    }
  }
  
  static deserialize(classname, data) {
      const restrclass = setup.qresImpl[classname]
      if (restrclass) {
        const obj = Object.create(restrclass.prototype)
        return Object.assign(obj, data)
      } else {
        console.error(`Attempted to deserialize restriction "${classname}" which does not exist`)
        return new setup.qresImpl.Never('Never')
      }
  }

  // used by Twine serialization (overrides default from TwineClass)
  toJSON() {
    const data = {}
    setup.copyProperties(data, this)
    return JSON.reviveWrapper(`setup.Restriction.deserialize("${this.constructor.name}", $ReviveData$)`, data)
  }

  apply() {}
  
  undoApply() {}

  /**
   * @returns {string}
   */
  text() {
    return ``
  }

  /**
   * @param {any} [quest]
   * @returns {string}
   */
  explain(quest) {
    return ``
  }

  /**
   * @param {any} [quest]
   * @returns {boolean}
   */
  isOk(quest) {return false}
}

setup.SexRestriction = class SexRestriction extends setup.Restriction {
  constructor() {
    super()
    /**
     * @type {setup.SexInstance}
     */
    this.sex = State.temporary.gSex
  }
}
