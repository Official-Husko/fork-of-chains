// @ts-nocheck


// unique among all available quests. mainly used for scouting mission.
setup.qresImpl.QuestAvailableUnique = class QuestAvailableUnique extends setup.Restriction {
  constructor() {
    super()

  }

  text() {
    return `setup.qres.QuestAvailableUnique()`
  }

  isOk(template) {
    let quests = State.variables.company.player.getQuests()
    for (let i = 0; i < quests.length; ++i) if (!quests[i].getTeam() && quests[i].getTemplate() == template) return false
    return true
  }

  apply(quest) {
    throw new Error(`Not a reward`)
  }

  undoApply(quest) {
    throw new Error(`Not a reward`)
  }

  explain() {
    return `unique (available)`
  }
}
