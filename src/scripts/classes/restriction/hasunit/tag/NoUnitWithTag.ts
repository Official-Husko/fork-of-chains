// @ts-nocheck


setup.qresImpl.NoUnitWithTag = class NoUnitWithTag extends setup.Restriction {
  constructor(tag_name) {
    super()

    this.tag_name = tag_name
  }

  static NAME = 'Does not exists any unit that has the given tag'
  static PASSAGE = 'RestrictionNoUnitWithTag'
  static UNIT = true

  text() {
    return `setup.qres.NoUnitWithTag('${this.tag_name}')`
  }

  explain() {
    let tagname = this.tag_name
    return `Must NOT exists any unit (anywhere in the world, not only in your company) with tag/flag: "${tagname}"`
  }

  isOk() {
    for (let iunitkey in State.variables.unit) {
      let unit = State.variables.unit[iunitkey]
      if (unit.isHasTag(this.tag_name)) return false
    }
    return true
  }
}
