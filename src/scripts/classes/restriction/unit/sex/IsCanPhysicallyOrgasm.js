setup.qresImpl.IsCanPhysicallyOrgasm = class IsCanPhysicallyOrgasm extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.IsCanPhysicallyOrgasm()`
  }

  explain() {
    return `Can physically orgasm: not blocked by chastity, but can be blocked by slave rule`
  }

  isOk(unit) {
    return unit.isCanPhysicallyOrgasm()
  }
}
