
setup.qresImpl.Not = class Not extends setup.Restriction {
  constructor(requirement) {
    super()

    // true if requirements is false

    this.requirement = requirement
  }

  text() {
    return `setup.qres.Not(${this.requirement.text()})`
  }

  isOk(quest) {
    return !this.requirement.isOk(quest)
  }

  explain(quest) {
    return `Must be false: (${this.requirement.explain(quest)})`
  }

  getLayout() {
    return {
      blocks: [
        {
          passage: "RestrictionNotHeader",
          //addpassage: "", // inherit
          entrypath: ".requirement"
        }
      ]
    }
  }
}
