setup.qresImpl.QuestFortRestorationAwardsEfficiency = class QuestFortRestorationAwardsEfficiency extends setup.Restriction {
  /**
   * Randomly true with chance probability.
   */
  constructor() {
    super()
  }

  getRoom() {
    return State.variables.roomlist.getRoomInstances({ template: setup.roomtemplate[State.variables.varstore.get('quest_fort_restoration_room') || 'questoffice'] })[0]
  }

  text() {
    return `setup.qres.QuestFortRestorationAwardsEfficiency()`
  }

  getTargetBonuses() {
    const room = this.getRoom()
    const bonuses = Array(setup.skill.length).fill(0)
    for (const bonus of room.getTemplate().getSkillBonus()) {
      if (bonus.type == 'near') {
        bonuses[setup.skill[bonus.skill_key].key] += bonus.bonus * setup.roomtemplate[bonus.room_template_key].max_room_count
      }
    }
    return bonuses.map(a => a * 0.9)
  }

  explain(quest) {
    const expl = setup.SkillHelper.explainSkills(this.getTargetBonuses(), /* hide skills = */ false, /* to fixed = */ true)
    return `Bonuses from ${this.getRoom().rep()} is at least ${expl}`
  }

  isOk(quest) {
    const bonuses = this.getTargetBonuses()
    const current = this.getRoom().getSkillBonuses()
    for (const skill of setup.skill) {
      if (current[skill.key] < bonuses[skill.key]) return false
    }
    return true
  }
}
