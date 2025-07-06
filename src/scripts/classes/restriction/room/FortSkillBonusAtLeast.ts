// @ts-nocheck

setup.qresImpl.FortSkillBonusAtLeast = class FortSkillBonusAtLeast extends setup.Restriction {
  /**
   * @param {setup.Skill | string} skill 
   * @param {number} target
   */
  constructor(skill, target) {
    super()
    this.skill_key = setup.keyOrSelf(skill)
    this.target = target
  }

  getSkill() {
    return setup.skill[this.skill_key]
  }

  text() {
    return `setup.qres.FortSkillBonusAtLeast(setup.skill.${this.getSkill().keyword}, ${this.target == setup.ROOM_MAX_SKILL_BOOST ? `setup.ROOM_MAX_SKILL_BOOST` : this.target})`
  }

  explain(quest) {
    return `Fort's ${this.getSkill().rep()} bonus is at least ${this.target}`
  }

  isOk(quest) {
    const skill = this.getSkill()
    return State.variables.roomlist.getTotalSkillBonuses()[this.getSkill().key] >= this.target
  }
}
