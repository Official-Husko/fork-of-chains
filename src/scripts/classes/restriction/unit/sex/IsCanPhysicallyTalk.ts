// @ts-nocheck

setup.qresImpl.IsCanPhysicallyTalk = class IsCanPhysicallyTalk extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.IsCanPhysicallyTalk()`
  }

  explain() {
    return `Can talk physically: not blocked by gag, but can be blocked by slave rule`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return unit.isCanPhysicallyTalk()
  }
}
