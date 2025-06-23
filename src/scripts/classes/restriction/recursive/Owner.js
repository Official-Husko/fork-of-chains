
setup.qresImpl.Owner = class Owner extends setup.Restriction {
  constructor(restriction) {
    super()

    this.restriction = restriction
  }

  text() {
    return `setup.qres.Owner(${this.restriction.text()})`
  }

  explain(quest) {
    return `Slave's owner satisfies: (${this.restriction.explain(quest)})`
  }

  isOk(unit) {
    if (!unit.isSlave()) return false
    let bedchamber = unit.getBedchamber()
    if (!bedchamber) return false
    return this.restriction.isOk(bedchamber.getSlaver())
  }

  getLayout() {
    return {
      css_class: "marketobjectcard",
      blocks: [
        {
          passage: "RestrictionOwnerHeader",
          addpassage: "QGAddRestrictionUnit",
          entrypath: ".restriction"
        }
      ]
    }
  }
}
