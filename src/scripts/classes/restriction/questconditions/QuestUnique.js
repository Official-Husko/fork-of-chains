
setup.qresImpl.QuestUnique = class QuestUnique extends setup.Restriction {
  constructor() {
    super()

  }

  static NAME = 'Unique quest (cannot have two of these quest at the same time. DO NOT USE THIS FOR OPPORTUNITY/MAIL)'
  static PASSAGE = 'RestrictionQuestUnique'

  text() {
    return `setup.qres.QuestUnique()`
  }

  isOk(template) {
    let quests = State.variables.company.player.getQuests()
    for (let i = 0; i < quests.length; ++i) if (quests[i].getTemplate() == template) return false
    return true
  }

  apply(quest) {
    throw new Error(`Not a reward`)
  }

  undoApply(quest) {
    throw new Error(`Not a reward`)
  }

  explain() {
    return `unique`
  }
}
