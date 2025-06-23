/**
 * Auto assigns all available perks
 */
setup.Unit.autoAssignPerks = function () {
  const units = State.variables.company.player.getUnits({ job: setup.job.slaver }).filter(
    unit => unit.isCanLearnNewPerk()
  )
  for (const unit of units) {
    // get the unit's skills, and sort them.
    const skill_values = unit.getSkillsBase()
    const skill_value_arr = []
    for (let i = 0; i < skill_values.length; ++i) {
      skill_value_arr.push([i, skill_values[i]])
    }
    skill_value_arr.sort((a, b) => b[1] - a[1])

    for (const [skill_key, v] of skill_value_arr) {
      if (unit.isCanLearnNewPerk()) {
        const perk_to_learn = setup.trait[`perk_${setup.skill[skill_key].keyword}`]
        unit.addTrait(perk_to_learn)
      }
    }
  }
}
