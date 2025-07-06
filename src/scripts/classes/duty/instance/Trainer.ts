// @ts-nocheck

// for load order:
import "../dutytemplate";

setup.DutyTemplateTrainer = class DutyTemplateTrainer extends setup.DutyTemplate {
  constructor() {
    super({
      key: 'trainer',
      name: 'Drill Sergeant',
      description_passage: 'DutyTrainer',
      type: 'util',
      unit_restrictions: [setup.qres.Job(setup.job.slaver)],
      relevant_skills: {
        brawn: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
        knowledge: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
      },
      relevant_traits: {
        skill_intimidating: setup.DUTY_TRAIT_CRIT_CHANCE,
        per_dominant: setup.DUTY_TRAIT_NORMAL_CHANCE,
        per_submissive: -setup.DUTY_TRAIT_NORMAL_CHANCE,
      },
      is_can_replace_with_specialist: true,
    })
  }

  /**
   * @param {setup.DutyInstance} duty_instance 
   */
  advanceWeek(duty_instance) {
    super.advanceWeek(duty_instance)

    let leveled_up = 0
    for (let i = 0; i < setup.DRILL_SERGEANT_ATTEMPTS + setup.DRILL_SERGEANT_ATTEMPTS_CRIT; ++i) {
      const proc = duty_instance.getProc()
      if (proc == 'crit' || (i < setup.DRILL_SERGEANT_ATTEMPTS && proc == 'proc')) {
        // procced succesfuly.
        // find candidate
        const duty_unit = duty_instance.getAssignedUnit()
        const level_limit = Math.min(setup.TRAINER_MAX_LEVEL, duty_unit.getLevel())
        const targets = State.variables.company.player.getUnits({ job: setup.job.slaver }).filter(unit =>
          unit.getLevel() < level_limit && unit.isAvailable()
        )
        if (targets.length) {
          /**
           * @type {setup.Unit}
           */
          const target = setup.rng.choice(targets)
          target.levelUp()
          leveled_up += 1
        }
      }
    }
    if (leveled_up) {
      setup.notify(`${setup.capitalize(duty_instance.repYourDutyRep())} trained your other slavers and they gain ${leveled_up} level${leveled_up > 1 ? 's' : ''}.`)
    }
  }
}

/**
 * @type {setup.DutyTemplateTrainer}
 */
// @ts-ignore
setup.dutytemplate.trainer = () => new setup.DutyTemplateTrainer()
