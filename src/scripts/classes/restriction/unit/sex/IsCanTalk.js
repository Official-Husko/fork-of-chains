setup.qresImpl.IsCanTalk = class IsCanTalk extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.IsCanTalk()`
  }

  explain() {
    return `Can talk: not blocked by slave rule or by gag`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return unit.isCanTalk()
  }
}
