setup.qresImpl.SkillModifierAtLeast = class SkillModifierAtLeast extends setup.Restriction {
  /**
   * @param {setup.Skill} skill 
   * @param {number} modifier 
   */
  constructor(skill, modifier) {
    super()

    this.skill_key = setup.keyOrSelf(skill)
    this.modifier = modifier
  }

  text() {
    return `setup.qres.SkillModifierAtLeast(setup.skill.${this.getSkill().keyword}, ${this.modifier})`
  }

  getSkill() { return setup.skill[this.skill_key] }

  explain() {
    return `Unit's ${this.getSkill().rep()} has at least +${this.modifier}x modifier at base`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return unit.getSkillModifiers(true)[this.getSkill().key] >= this.modifier
  }
}
