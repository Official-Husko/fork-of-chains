// @ts-nocheck


setup.qresImpl.UnitGroupHasUnit = class UnitGroupHasUnit extends setup.Restriction {
  constructor(unit_group) {
    super()

    if (!unit_group) throw new Error(`Unit group cannot be empty`)
    this.unit_group_key = setup.keyOrSelf(unit_group)
  }

  text() {
    return `setup.qres.UnitGroupHasUnit('${this.unit_group_key}')`
  }

  explain() {
    let unit_group = setup.unitgroup[this.unit_group_key]
    return `Unit group ${unit_group.rep()} has at least one unit`
  }

  isOk() {
    let unit_group = setup.unitgroup[this.unit_group_key]
    return unit_group.hasUnbusyUnit()
  }
}
