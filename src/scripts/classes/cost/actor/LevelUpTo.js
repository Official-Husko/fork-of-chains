// levels up this unit.
setup.qcImpl.LevelUpTo = class LevelUpTo extends setup.Cost {
  /**
   * @param {string} actor_name 
   * @param {number} target_level 
   */
  constructor(actor_name, target_level) {
    super()

    this.actor_name = actor_name
    this.target_level = target_level
  }

  text() {
    return `setup.qc.LevelUpTo('${this.actor_name}', ${this.target_level})`
  }

  apply(quest) {
    /**
     * @type {setup.Unit}
     */
    const unit = quest.getActorUnit(this.actor_name)
    while (unit.getLevel() < this.target_level) {
      unit.levelUp()
    }
  }

  explain(quest) {
    return `${this.actor_name} levels up to level ${this.target_level}`
  }
}
