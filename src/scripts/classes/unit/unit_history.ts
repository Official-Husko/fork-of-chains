// @ts-nocheck


setup.Unit.prototype.addHistory = function(history_text, quest, force_add) {
  if (!force_add && !this.isYourCompany()) return
  if (!this.history) this.history = []
  let base = `Week ${State.variables.calendar.getWeek()}: a|Rep ${history_text}`
  if (quest && ('getName' in quest)) base = `${base} (${quest.getName()})`
  this.history.unshift(base)

  if (this.history.length > setup.HISTORY_UNIT_MAX) {
    this.history = this.history.slice(0, setup.HISTORY_UNIT_MAX)
  }
  this.resetCache()
}

setup.Unit.prototype.getHistory = function() {
  if (!this.history) return []
  return this.history
}
