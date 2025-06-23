import { doFinalize } from "../../util/questassign"

setup.UnitActionHelper = {}

/**
 * Returns all the possible traits to select from for this unit.
 * 
 * @param {setup.Unit} unit 
 * @returns {setup.Trait[]}
 */
setup.UnitActionHelper.getTraitChoices = function(unit) {
  const raw_traits = {}
  for (const action of Object.values(setup.unitaction)) {
    if (action.isMultiTrain() && action.isUnlocked(unit)) {
      const targets = action.getFinalTraits(unit)
      for (const trait of targets) raw_traits[trait.key] = true
    }
  }

  const traits = Object.keys(raw_traits).map(key => setup.trait[key])
  traits.sort(setup.Trait_Cmp)
  return traits
}

/**
 * @param {setup.Unit} unit
 * @param {setup.Trait} trait 
 * @param {setup.Trait[]} target_traits 
 */
function doPopulateTraits(unit, trait, target_traits) {
  // Find the unit action that gives out this trait
  for (const action of Object.values(setup.unitaction)) {
    if (action.isMultiTrain() && action.isUnlocked(unit) && action.getResultTraits().includes(trait)) {
      for (const prereq of action.getRequiredTraits()) {
        if (!target_traits.includes(prereq) && !unit.isHasTrait(prereq)) {
          target_traits.push(prereq)
          doPopulateTraits(unit, prereq, target_traits)
        }
      }
    }
  }
}

/**
 * Populate target traits with its prerequisites.
 * 
 * @param {setup.Unit} unit
 * @param {setup.Trait[]} target_traits 
 */
setup.UnitActionHelper.populateTraits = function(unit, target_traits) {
  for (const trait of target_traits.filter(a => true)) {
    doPopulateTraits(unit, trait, target_traits)
  }

  // remove problematic traits
  for (const trait of target_traits.filter(a => true)) {
    const trait_group = trait.getTraitGroup()
    if (trait_group) {
      const abs_index = Math.abs(trait_group._getTraitIndex(trait))
      if (target_traits.filter(t =>
            t.getTraitGroup() == trait_group &&
            Math.abs(trait_group._getTraitIndex(t)) > abs_index).length) {
        target_traits.splice(target_traits.indexOf(trait), 1)
      }
    }
  }

  // special case: remove duplicate master trainings
  for (const trait of target_traits.filter(a => true)) {
    if (trait.getTags().includes('trmaster')) {
      if (target_traits.filter(t => t.getTags().includes('trmaster') && t != trait).length) {
        target_traits.splice(target_traits.indexOf(trait), 1)
      }
    }
  }

  target_traits.sort(setup.Trait_Cmp)
}

/**
 * @param {setup.Unit} unit 
 * @param {setup.Trait[]} target_traits 
 * @param {setup.Unit[]} [raw_forced_units]   // if team is adhoc, will force units to this instead since the team would have been disbanded
 */
setup.UnitActionHelper.generateQuest = function(unit, target_traits, raw_forced_units) {
  // find next quest to generate.
  const candidates = []
  for (const action of Object.values(setup.unitaction)) {
    if (action.isMultiTrain() &&
        action.isUnlocked(unit) &&
        action.isCanTrain(unit) && 
        action.isPartOfTraining(unit, target_traits)) {
      candidates.push(action)
    }
  }

  if (candidates.length) {
    // There are still training to do, so let's do it.

    // First, select the action, tiebreak using level.
    candidates.sort((action1, action2) =>
      action1.getTemplate().getDifficulty().getLevel() - action2.getTemplate().getDifficulty().getLevel())
    const chosen = candidates[0]

    // Generate the quest. This will take care generating this particular quest type.
    const quest = chosen.generateQuest(unit, target_traits, /* no auto assign = */ !!raw_forced_units)

    // Assign the same team, if possible.
    if (raw_forced_units &&
        State.variables.company.player.isCanDeployTeam() &&
        quest.isCostsSatisfied()) {
      let forced_units = raw_forced_units

      const assignment = setup.QuestAssignHelper.computeAutoAssignment(quest, forced_units)
      if (!assignment) {
        setup.notify(`Unable to find an assignment for the ongoing training for a|rep! Please assign the team manually.`,
          {a: unit})
      } else {
        // assign the team
        doFinalize(quest, assignment)
      }
    } else if (raw_forced_units) {
      setup.notify(`Unable to deploy a team for the ongoing training for a|rep! Please assign the team manually.`,
        {a: unit})
    }
  } else {
    setup.notify(`a|Reps trainings has been completed.`, {a: unit})
  }
}
