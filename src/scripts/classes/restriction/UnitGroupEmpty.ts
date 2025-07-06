// @ts-nocheck

setup.qresImpl.UnitGroupEmpty = class UnitGroupEmpty extends setup.Restriction {
  constructor(unit_group) {
    super()

    if (!unit_group) throw new Error(`Unit group cannot be empty`)
    this.unit_group_key = setup.keyOrSelf(unit_group)
  }

  text() {
    return `setup.qres.UnitGroupEmpty('${this.unit_group_key}')`
  }

  explain() {
    let unit_group = setup.unitgroup[this.unit_group_key]
    return `Unit group ${unit_group.rep()} must be empty`
  }

  isOk() {
    let unit_group = setup.unitgroup[this.unit_group_key]
    return unit_group.isEmpty()
  }
}
