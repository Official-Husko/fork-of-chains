// @ts-nocheck

setup.SexPermissionClass = {}
setup.sexpermission = class {}

/**
 * Governs what kind of actions a unit can take in sex.
 */
setup.SexPermission = class SexPermission extends setup.TwineClassCustom {
  /**
   * @param {string} key 
   * @param {string[]} tags
   * 
   * List of Sex Action tags that are disallowed
   * @param {string[]} disallowed_tags 
   */
  constructor(key, tags, disallowed_tags) {
    super()
    this.key = key
    this.tags = tags

    this.disallowed_tags = disallowed_tags
    /*
    for (const tag of this.disallowed_tags) {
      if (!(tag in setup.TAG_SEXACTION)) throw new Error(`Unknown sex action tag: ${tag}`)
    }
    */
  }

  /**
   * @returns {string}
   */
  getContainer() { return `setup.SexPermissionClass` }

  /**
   * @returns {string[]}
   */
  getTags() { return this.tags }

  /**
   * @returns {string[]}
   */
  getDisallowedTags() { return this.disallowed_tags }

  /**
   * @param {setup.SexAction} action 
   * @param {setup.SexInstance} sex
   * @returns {boolean}
   */
  isActionAllowed(action, sex) {
    if (this.getDisallowedTags().filter(tag => action.getTags().includes(tag)).length) {
      return false
    } else {
      return true
    }
  }

  /**
   * Get unit's permission.
   * @param {setup.Unit} unit 
   * @returns {setup.SexPermission}
   */
  static getPermission(unit) {
    if (unit.isYou()) return setup.sexpermission.full

    if (unit.isMindbroken()) {
      // does not matter
      return setup.sexpermission.none
    }

    if (unit.isSlave()) {
      if (unit.isObedient()) {
        return setup.sexpermission.alpha
      }
      return setup.sexpermission.none
    }

    if (unit.isSubmissive()) {
      return setup.sexpermission.alpha
    } else {
      return setup.sexpermission.full
    }
  }

  /**
   * @returns {setup.SexPermission[]}
   */
  static getAllPermissions() {
    return Object.values(setup.sexpermission)
  }
}
