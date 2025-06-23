
setup.qresImpl.NoTag = class NoTag extends setup.Restriction {
  constructor(tag_name) {
    super()

    this.tag_name = tag_name
  }

  static NAME = 'Do NOT have a tag / flag'
  static PASSAGE = 'RestrictionNoTag'
  static UNIT = true

  text() {
    return `setup.qres.NoTag('${this.tag_name}')`
  }

  explain() {
    let tagname = this.tag_name
    return `Must NOT have tag/flag: "${tagname}"`
  }

  isOk(unit) {
    return !unit.isHasTag(this.tag_name)
  }
}
