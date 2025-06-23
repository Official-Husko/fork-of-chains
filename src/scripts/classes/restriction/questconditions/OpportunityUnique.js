
setup.qresImpl.OpportunityUnique = class OpportunityUnique extends setup.Restriction {
  constructor() {
    super()

  }

  static NAME = 'Unique opportunity (DO NOT USE THIS FOR QUESTS)'
  static PASSAGE = 'RestrictionOpportunityUnique'

  text() {
    return `setup.qres.OpportunityUnique()`
  }


  isOk(template) {
    let opportunitys = State.variables.opportunitylist.getOpportunities()
    for (let i = 0; i < opportunitys.length; ++i) if (opportunitys[i].getTemplate() == template) return false
    return true
  }

  apply(opportunity) {
    throw new Error(`Not a reward`)
  }

  undoApply(opportunity) {
    throw new Error(`Not a reward`)
  }

  explain() {
    return `unique`
  }
}
