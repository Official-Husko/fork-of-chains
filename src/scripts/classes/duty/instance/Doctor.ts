// @ts-nocheck

// for load order:
import "../dutytemplate";

setup.DutyTemplateDoctor = class DutyTemplateDoctor extends setup.DutyTemplate {
  constructor() {
    super({
      key: 'doctor',
      name: 'Doctor',
      description_passage: 'DutyDoctor',
      type: 'util',
      unit_restrictions: [setup.qres.Job(setup.job.slaver)],
      relevant_skills: {
        aid: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
        arcane: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
      },
      relevant_traits: {
        magic_light_master: setup.DUTY_TRAIT_CRIT_CHANCE,
        magic_light: setup.DUTY_TRAIT_NORMAL_CHANCE,
        per_kind: setup.DUTY_TRAIT_NORMAL_CHANCE,
        per_cruel: -setup.DUTY_TRAIT_NORMAL_CHANCE,
      },
      is_can_replace_with_specialist: true,
    })
  }
}

/**
 * @type {setup.DutyTemplateDoctor}
 */
// @ts-ignore
setup.dutytemplate.doctor = () => new setup.DutyTemplateDoctor()
