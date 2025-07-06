// @ts-nocheck


/**
 * Contains helper constructor functions for the subclasses of setup.Cost in setup.qcImpl 
 * @type {setup_qc}
 */
// @ts-ignore
setup.qc = {}

/** Contains the subclasses (implementations) of setup.Cost */
setup.qcImpl = {}


/** 
 * Base class of all costs (defined in setup.qcImpl)
 *  (abstract class)
 */
setup.Cost = class Cost extends setup.TwineClass {
  
  /** Initializes setup.qc */
  static initConstructors() {
    // freeze the classes namespace
    //  when trying to add a new class after this, it will throw an error
    //  if it happens, that most likely means the file load order is wrong
    setup.qcImpl = Object.freeze(setup.qcImpl)
    
    for (const [k, costclass] of Object.entries(setup.qcImpl)) {
      setup.qc[k] = function(...args) { return new costclass(...args) }
      setup.qc[k].class = costclass
    }
  }
  
  static deserialize(classname, data) {
    const costclass = setup.qcImpl[classname]
    if (costclass) {
      const obj = Object.create(costclass.prototype)
      return Object.assign(obj, data)
    } else {
      console.error(`Attempted to deserialize cost "${classname}" which does not exist`)
      return new setup.qcImpl.Nothing()
    }
  }

  // convert to javascript text
  text() {
    throw new Error(`Must be implemented`)
  }

  /**
   * @param {object} quest 
   */
  apply(quest) {
    throw new Error(`Must be implemented`)
  }

  /**
   * @param {object} quest 
   */
  explain(quest) {
    throw new Error(`Must be implemented`)
  }

  // used by Twine serialization (overrides default from TwineClass)
  toJSON() {
    const data = {}
    setup.copyProperties(data, this)
    return JSON.reviveWrapper(`setup.Cost.deserialize("${this.constructor.name}", $ReviveData$)`, data)
  }

  /**
   * @param {object} [quest]
   * @returns {boolean}
   */
  isOk(quest) {
    throw new Error(`${this.constructor.name} not a cost`)
  }

  /**
   * @param {object} [quest]
   */
  undoApply(quest) {
    throw new Error(`${this.constructor.name} not undoable`)
  }

}


/** 
 * Base class of all sex costs
 */
setup.SexCost = class SexCost extends setup.Cost {
  constructor() {
    super()
    /**
     * @type {setup.SexInstance}
     */
    this.sex = State.temporary.gSex
  }
}
