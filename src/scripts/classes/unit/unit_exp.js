
setup.Unit.prototype.getLevel = function () { return this.level }

setup.Unit.prototype.resetLevel = function () {
  this.level = 1
  this.exp = 0
  this.skills = setup.deepCopy(this.base_skills)
  if (this.isYourCompany()) {
    setup.notify(`a|Reps level is reset to 1.`, { a: this })
  }
  this.resetCache()
}

setup.Unit.prototype.levelUp = function (levels) {
  if (!levels) levels = 1
  let skill_gains
  for (let i = 0; i < levels; ++i) {
    this.level += 1
    this.exp = 0

    // get skill gains
    skill_gains = this.getRandomSkillIncreases()

    // increase skills

    this.increaseSkills(skill_gains)
  }
  if (this.isYourCompany()) {
    let explanation = setup.SkillHelper.explainSkillsCopy(skill_gains)
    const text = setup.Text.replaceUnitMacros(
      `a|Rep a|level up to level ${this.getLevel()} and gained`, { a: this })
    setup.notify(`${text} ${explanation}`)

    if (State.variables.fort.player.isHasBuilding('warroom') &&
      this.isSlaver() &&
      this.isCanLearnNewPerk() &&
      setup.PERK_GAIN_AT_LEVEL.includes(this.getLevel())) {
      setup.notify(`a|Rep a|is ready to learn a new perk`, { a: this })
    }
  }
  this.resetCache()
}

setup.Unit.prototype.gainExp = function (amt) {
  if (amt <= 0) return

  setup.LEVEL_UP_MAX_ONE_SITTING = 5

  let level_ups = 0

  while (amt > 0 && level_ups < setup.LEVEL_UP_MAX_ONE_SITTING) {
    this.exp += amt
    amt = 0
    let needed = this.getExpForNextLevel()
    if (this.exp >= needed) {
      // put leftover back to amt
      amt = this.exp - needed
      this.levelUp()
      level_ups += 1
    }
  }
  this.resetCache()
}

setup.Unit.prototype.getExp = function () {
  return this.exp
}

setup.Unit.prototype.getExpForNextLevel = function () {
  let level = this.getLevel()
  if (level < setup.LEVEL_PLATEAU) {
    let exponent = Math.pow(setup.EXP_LEVEL_PLATEAU / setup.EXP_LEVEL_1, 1.0 / setup.LEVEL_PLATEAU)
    return Math.round(setup.EXP_LEVEL_1 * Math.pow(exponent, level - 1))
  } else {
    let exponent = Math.pow(4.0, 1.0 / setup.EXP_LATE_GAME_QUAD_EVERY)
    return Math.round(
      (setup.EXP_LEVEL_PLATEAU / setup.EXP_LOW_LEVEL_LEVEL_UP_FREQUENCY) *
      setup.EXP_LATE_CLIFF *
      Math.pow(exponent, level - setup.LEVEL_PLATEAU))
  }
}


setup.Unit.prototype.getOnDutyExp = function () {
  if (this.getLevel() >= setup.LEVEL_PLATEAU) {
    return Math.round(setup.EXP_DUTY_MULTIPLIER * setup.EXP_LEVEL_PLATEAU / setup.EXP_LOW_LEVEL_LEVEL_UP_FREQUENCY)
  } else {
    return Math.round(setup.EXP_DUTY_MULTIPLIER * this.getExpForNextLevel() / setup.EXP_LOW_LEVEL_LEVEL_UP_FREQUENCY)
  }
}
