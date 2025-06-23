
setup.qresImpl.SkillAtLeast = class SkillAtLeast extends setup.Restriction {
  constructor(skill, amount) {
    super()

    this.skill_key = setup.keyOrSelf(skill)
    this.amount = amount
  }

  text() {
    return `setup.qres.SkillAtLeast(setup.skill.${this.getSkill().keyword}, ${this.amount})`
  }

  getSkill() { return setup.skill[this.skill_key] }

  explain() {
    return `Unit's ${this.getSkill().rep()} is at least ${this.amount}`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return unit.getSkill(this.getSkill()) >= this.amount
  }
}
