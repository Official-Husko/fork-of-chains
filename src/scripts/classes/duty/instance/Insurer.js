// for load order:
import { } from "../dutytemplate"

setup.DutyTemplateInsurer = class DutyTemplateInsurer extends setup.DutyTemplate {
  constructor() {
    super({
      key: 'insurer',
      name: 'Insurer',
      description_passage: 'DutyInsurer',
      type: 'util',
      unit_restrictions: [setup.qres.Job(setup.job.slaver)],
      relevant_skills: {
        intrigue: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
        survival: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
      },
      relevant_traits: {
        skill_creative: setup.DUTY_TRAIT_CRIT_CHANCE,
        per_cautious: setup.DUTY_TRAIT_NORMAL_CHANCE,
        per_brave: -setup.DUTY_TRAIT_NORMAL_CHANCE,
      },
      is_can_replace_with_specialist: true,
    })
  }
}

/**
 * @type {setup.DutyTemplateInsurer}
 */
// @ts-ignore
setup.dutytemplate.insurer = () => new setup.DutyTemplateInsurer()
