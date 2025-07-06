// @ts-nocheck


setup.qresImpl.Actor = class Actor extends setup.Restriction {
  constructor(actor_name, restriction) {
    super()

    this.actor_name = actor_name
    this.restriction = restriction
  }

  static NAME = 'Actor satisfies a restriction'
  static PASSAGE = 'RestrictionActor'

  text() {
    return `setup.qres.Actor('${this.actor_name}', ${this.restriction.text()})`
  }

  explain(quest) {
    let actor = this.actor_name
    if (quest && 'getActorUnit' in quest) {
      let unit = quest.getActorUnit(this.actor_name)
      if (unit) actor = unit.rep()
    }
    return `${actor}: (${this.restriction.explain(quest)})`
  }

  isOk(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    return this.restriction.isOk(unit, quest)
  }

  getLayout() {
    return {
      css_class: "marketobjectcard",
      blocks: [
        {
          passage: "RestrictionActorHeader",
          addpassage: "QGAddRestrictionUnit",
          entrypath: ".restriction"
        }
      ]
    }
  }
}
