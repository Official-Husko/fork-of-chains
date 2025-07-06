// @ts-nocheck

setup.qresImpl.QuestFortRestorationAwards = class QuestFortRestorationAwards extends setup.Restriction {
  /**
   * Randomly true with chance probability.
   */
  constructor() {
    super()
  }

  text() {
    return `setup.qres.QuestFortRestorationAwards()`
  }

  getAmount() {
    const wins = State.variables.varstore.get('quest_fort_restoration_win') || 0
    const frac = 0.35 + (0.6 * wins / 4.0)
    return Math.round(setup.ROOM_BONUS_SKILL_BONUS_DEFAULT * frac)
  }

  explain(quest) {
    return `Your fort grants at least ${this.getAmount()} ${setup.skill.map(skill => skill.rep()).join('')}`
  }

  isOk(quest) {
    const amt = this.getAmount()
    const boosts = State.variables.roomlist.getTotalSkillBonuses()
    return boosts.filter(i => i < amt).length == 0
  }
}
