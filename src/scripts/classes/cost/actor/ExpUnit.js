// gain some exp for a unit. Amount gained = exp from unit level times week multiplier
setup.qcImpl.ExpUnit = class ExpUnit extends setup.Cost {
  constructor(actor_name, week_multiplier) {
    super()
    this.actor_name = actor_name
    this.week_multiplier = week_multiplier
  }

  apply(quest) {
    /**
     * @type {setup.Unit}
     */
    const unit = quest.getActorUnit(this.actor_name)

    const exp = Math.round(setup.getUnitPlayerLevelDifficulty().getExp() * this.week_multiplier)

    unit.gainExp(exp)
    if (unit.isYourCompany()) {
      setup.notify(
        `a|Rep a|gain ${exp} exp`, {a: unit}
      )
    }
  }

  explain(quest) {
    return `${this.actor_name} gain some exp (multiplier: ${this.week_multiplier})`
  }
}
