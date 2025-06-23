
setup.qresImpl.HasTag = class HasTag extends setup.Restriction {
  constructor(tag_name) {
    super()

    this.tag_name = tag_name
  }

  text() {
    return `setup.qres.HasTag('${this.tag_name}')`
  }

  explain(quest) {
    if (!('devtooltype' in State.variables)) {
      const eligible = State.variables.company.player.getUnits({
        tag: this.tag_name
      })
      if (!eligible.length) {
        return setup.DOM.toString(setup.DOM.Text.danger('No eligible unit'))
      } else {
        return eligible.map(unit => unit.rep()).join(' or ')
      }
    } else {
      let tagname = this.tag_name
      return `Unit ${tagname}`
    }
  }

  isOk(unit) {
    return unit.isHasTag(this.tag_name)
  }
}
