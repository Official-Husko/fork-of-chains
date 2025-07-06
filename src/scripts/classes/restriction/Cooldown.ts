// @ts-nocheck


setup.qresImpl.Cooldown = class Cooldown extends setup.Restriction {
  constructor(cooldown) {
    super()

    this.cooldown = cooldown
  }

  static NAME = 'Cooldown weeks (quest can only be generated at most once per this many weeks)'
  static PASSAGE = 'RestrictionCooldown'

  text() {
    return `setup.qres.Cooldown(${this.cooldown})`
  }

  isOk(template) {
    let last_week = State.variables.calendar.getLastWeekOf(template)
    let current_week = State.variables.calendar.getWeek()
    return (current_week - last_week >= this.cooldown)
  }

  apply(quest) {
    throw new Error(`Not a reward`)
  }

  undoApply(quest) {
    throw new Error(`Not a reward`)
  }

  explain() {
    return `Cooldown of ${this.cooldown} weeks`
  }
}
