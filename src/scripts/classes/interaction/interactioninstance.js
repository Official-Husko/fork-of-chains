
setup.InteractionInstance = class InteractionInstance extends setup.TwineClass {
  constructor(interaction, unit) {
    super()

    if (!interaction) throw new Error(`Interaction cannot be null`)
    this.interaction_key = interaction.key
    this.unit_key = unit.key

    if (unit.isSlaver()) {
      State.variables.statistics.add('interactions_slaver', 1)
    } else if (unit.isSlave()) {
      State.variables.statistics.add('interactions_slave', 1)
    }
  }

  getName() {
    return this.getInteraction().getName()
  }

  getInteraction() {
    return setup.interaction[this.interaction_key]
  }

  getTemplate() {
    return this.getInteraction()
  }

  getUnit() {
    return State.variables.unit[this.unit_key]
  }


  applyCosts() {
    setup.RestrictionLib.applyAll(this.getInteraction().getCosts(), this)
  }

  applyRewards() {
    setup.RestrictionLib.applyAll(this.getInteraction().getRewards(), this)
  }

  getActorsList() {
    // return [['actor1', unit], ['actor2', unit], ...]
    return [['target', this.getUnit()]]
  }

  getActorObj() {
    // return object where object.actorname = unit, if any.
    let actor_list = this.getActorsList()
    let res = {}
    actor_list.forEach(al => {
      res[al[0]] = al[1]
    })
    return res
  }


  getActorUnit(actor_name) {
    if (actor_name == 'target') return this.getUnit()
    throw new Error(`Unrecognized actor ${actor_name}`)
  }

  debugKillActors() {
    setup.QuestInstance.debugKillActorsDo(this.getActorsList())
  }
}
