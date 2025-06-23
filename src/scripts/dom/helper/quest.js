

/**
 * Loads associated quest variables before showing its passage.
 * <<questvarload>>
 * 
 * @param {any} quest 
 */
setup.DOM.Helper.loadQuestVars = function(quest) {
  State.variables.g = quest.getActorObj()
  State.variables.gQuest = quest
  State.variables.gOutcome = quest.outcome
  if ('getTeam' in quest) {
    State.variables.gTeam = quest.getTeam()
  }
}
