// for load order:
import { } from "../dutytemplate"

setup.DutyTemplateRescuer = class DutyTemplateRescuer extends setup.DutyTemplate {
  constructor() {
    super({
      key: 'rescuer',
      name: 'Rescuer',
      description_passage: 'DutyRescuer',
      type: 'util',
      unit_restrictions: [setup.qres.Job(setup.job.slaver)],
      relevant_skills: {
        intrigue: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 6,
        aid: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 6,
      },
      relevant_traits: {
        skill_creative: setup.DUTY_TRAIT_CRIT_CHANCE / 3,
        per_aggressive: setup.DUTY_TRAIT_NORMAL_CHANCE / 3,
        per_calm: -setup.DUTY_TRAIT_NORMAL_CHANCE / 3,
      },
      is_can_replace_with_specialist: true,
    })
  }

  /**
   * @param {setup.DutyInstance} duty_instance 
   */
  advanceWeek(duty_instance) {
    super.advanceWeek(duty_instance)

    let proc = duty_instance.getProc()
    if (proc == 'proc' || proc == 'crit') {
      let quest = setup.questpool.rescue.generateQuest()
      if (quest) {
        setup.notify(`${setup.capitalize(duty_instance.repYourDutyRep())} found ${quest.rep()} to rescue one of your lost slavers`,)
      }
    }
  }
}

/**
 * @type {setup.DutyTemplateRescuer}
 */
// @ts-ignore
setup.dutytemplate.rescuer = () => new setup.DutyTemplateRescuer()
