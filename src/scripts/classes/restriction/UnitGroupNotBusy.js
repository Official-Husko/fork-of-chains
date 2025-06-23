setup.qresImpl.UnitGroupNotBusy = class UnitGroupNotBusy extends setup.Restriction {
  constructor(unit_group) {
    super()

    if (!unit_group) throw new Error(`Unit group cannot be empty`)
    this.unit_group_key = setup.keyOrSelf(unit_group)
  }

  text() {
    return `setup.qres.UnitGroupNotBusy('${this.unit_group_key}')`
  }

  explain() {
    let unit_group = setup.unitgroup[this.unit_group_key]
    return `No unit from ${unit_group.rep()} must be on any quest / event / opportunity`
  }

  isOk() {
    const unit_group = setup.unitgroup[this.unit_group_key]
    return !unit_group.isBusy()
  }
}
