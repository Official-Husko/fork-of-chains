// @ts-nocheck

setup.qresImpl.IsCanPhysicallyWalk = class IsCanPhysicallyWalk extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.IsCanPhysicallyWalk()`
  }

  explain() {
    return `Can walk physically: not blocked by restraints, but can be blocked by slave rule`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return unit.isCanPhysicallyWalk()
  }
}
