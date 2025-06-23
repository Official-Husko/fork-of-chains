
setup.qresImpl.Player = class Player extends setup.Restriction {
  constructor(restriction) {
    super()

    this.restriction = restriction
  }

  static NAME = 'Player satisfies a restriction'
  static PASSAGE = 'RestrictionPlayer'

  text() {
    return `setup.qres.Player(${this.restriction.text()})`
  }

  explain(quest) {
    return `You satisfies: (${this.restriction.explain(quest)})`
  }

  isOk() {
    return this.restriction.isOk(State.variables.unit.player)
  }

  getLayout() {
    return {
      css_class: "marketobjectcard",
      blocks: [
        {
          passage: "RestrictionPlayerHeader",
          addpassage: "QGAddRestrictionUnit",
          entrypath: ".restriction"
        }
      ]
    }
  }
}
