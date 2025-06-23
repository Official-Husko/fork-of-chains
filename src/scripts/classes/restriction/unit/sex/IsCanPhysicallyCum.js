setup.qresImpl.IsCanPhysicallyCum = class IsCanPhysicallyCum extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.IsCanPhysicallyCum()`
  }

  explain() {
    return `Can physically cum with current equipment`
  }

  isOk(unit) {
    return unit.isCanPhysicallyCum()
  }
}
