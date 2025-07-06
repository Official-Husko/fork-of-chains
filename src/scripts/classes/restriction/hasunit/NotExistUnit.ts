// @ts-nocheck


setup.qresImpl.NotExistUnit = class NotExistUnit extends setup.Restriction {
  constructor(restrictions) {
    super()

    this.restrictions = restrictions
  }

  text() {
    let texts = this.restrictions.map(a => a.text())
    return `setup.qres.NotExistUnit([<br/>${texts.join(',<br/>')}<br/>])`
  }

  explain() {
    let texts = this.restrictions.map(a => a.explain())
    return `Must NOT exist any unit with: [ ${texts.join(' ')} ]`
  }

  isOk() {
    for (let iunitkey in State.variables.unit) {
      let unit = State.variables.unit[iunitkey]
      if (setup.RestrictionLib.isUnitSatisfy(unit, this.restrictions)) return false
    }
    return true
  }

  getLayout() {
    return {
      css_class: "marketobjectcard",
      blocks: [
        {
          passage: "RestrictionNotExistUnitHeader",
          addpassage: "QGAddRestrictionUnit",
          listpath: ".restrictions"
        }
      ]
    }
  }
}
