// @ts-nocheck

setup.EventInstance = class EventInstance extends setup.TwineClass {
  constructor(
    event,
    actor_assignment) {
    super()
    this.event_key = event.key
    this.actor_unit_key_map = {}
    for (let actor_name in actor_assignment) {
      const unit = actor_assignment[actor_name]
      this.actor_unit_key_map[actor_name] = unit.key

      if (unit) {
        unit.setDebugInfo(event)
      }
    }
  }

  getEvent() { return setup.event[this.event_key] }
  getTemplate() { return this.getEvent() }

  getName() {
    return this.getEvent().name
  }

  getActorsList() {
    // return [['actor1', unit], ['actor2', unit], ...]
    let result = []
    for (let actor_key in this.actor_unit_key_map) {
      let unit = State.variables.unit[this.actor_unit_key_map[actor_key]]
      result.push([actor_key, unit])
    }
    return result
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
    return State.variables.unit[this.actor_unit_key_map[actor_name]]
  }


  applyRewards() {
    setup.RestrictionLib.applyAll(this.getEvent().getRewards(), this)
  }

  /**
   * Get a random number for this event that remains the same always.
   */
  getSeed() {
    if (this.seed) return this.seed
    this.seed = 1 + Math.floor(Math.random() * 999999997)
    return this.seed
  }

  debugKillActors() {
    setup.QuestInstance.debugKillActorsDo(this.getActorsList())
  }
}
