// gains a specific trauma for specified duration
setup.qcImpl.SkillBoost = class SkillBoost extends setup.Cost {
  /**
   * @param {string} actor_name 
   * @param {setup.Skill} skill 
   */
  constructor(actor_name, skill) {
    super()

    this.actor_name = actor_name
    this.skill_key = setup.keyOrSelf(skill)
  }

  text() {
    return `setup.qc.SkillBoost('${this.actor_name}', setup.skill.${this.getSkill().keyword})`
  }

  getSkill() { return setup.skill[this.skill_key] }

  apply(quest) {
    const unit = quest.getActorUnit(this.actor_name)
    const skill = this.getSkill()
    State.variables.skillboost.addBoost(unit, skill)
  }

  explain(quest) {
    return `Boost ${this.actor_name}'s ${this.getSkill().rep()} permanently by 1`
  }
}
