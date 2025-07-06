// @ts-nocheck

setup.qresImpl.SexEnjoysAnal = class SexEnjoysAnal extends setup.SexRestriction {
  constructor() {
    super()
  }

  explain() {
    return `Enjoys anal sex`
  }

  /**
   * @param {setup.Unit} unit
   */
  isOk(unit) {
    return setup.SexBodypartClass.Anus.unitAnalEnjoymentMultiplier(unit) >= 1
  }
}


