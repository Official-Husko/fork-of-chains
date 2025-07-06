// @ts-nocheck

setup.qresImpl.QuestFortRestorationAwardsTheme = class QuestFortRestorationAwardsTheme extends setup.Restriction {
  /**
   * Randomly true with chance probability.
   */
  constructor() {
    super()
  }

  getSkill() {
    return setup.skill[State.variables.varstore.get('quest_fort_restoration_skill')] || setup.skill.combat
  }

  getAmount() {
    return setup.ROOM_MAX_SKILL_BOOST
  }

  text() {
    return `setup.qres.QuestFortRestorationAwardsTheme()`
  }

  explain(quest) {
    return setup.qres.FortSkillBonusAtLeast(this.getSkill(), this.getAmount()).explain(quest)
  }

  isOk(quest) {
    return setup.qres.FortSkillBonusAtLeast(this.getSkill(), this.getAmount()).isOk(quest)
  }
}
