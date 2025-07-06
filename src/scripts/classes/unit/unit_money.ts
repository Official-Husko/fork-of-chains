// @ts-nocheck


setup.Unit.prototype.getWage = function () {
  if (this == State.variables.unit.player) return 0
  const level = this.getLevel()
  let base = Math.floor(9 + level)
  if (State.variables.calendar.getWeek() >= 3) {
    if (State.variables.settings.challengemode == 'impossible') {
      base *= 10
    } else if (State.variables.settings.challengemode == 'unfair') {
      base *= 5
    }
  }
  return base
}

setup.Unit.prototype.getSlaverMarketValue = function () {
  return Math.max(
    this.getSlaveValue(),
    setup.SLAVE_VALUE_MARKET_MINIMUM,
  )
}
