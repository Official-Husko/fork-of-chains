// @ts-nocheck

setup.qresImpl.SexIsInLocationSupportingUpsideDown = class SexIsInLocationSupportingUpsideDown extends setup.SexRestriction {
  constructor() {
    super()
  }

  explain() {
    return `Is in a location that supports the Upside-Down sex pose (e.g., by having the correct furniture)`
  }

  /**
   * @param {setup.SexAction} action
   */
  isOk(action) {
    return !!this.sex.getLocation().repUpsideDownFurniture()
  }
}


