// @ts-nocheck

// for load order:
import "../dutytemplate";

setup.DutyTemplateRelationshipManager = class DutyTemplateRelationshipManager extends setup.DutyTemplate {
  constructor() {
    super({
      key: 'relationshipmanager',
      name: 'Relationship Manager',
      description_passage: 'DutyRelationshipManager',
      type: 'util',
      unit_restrictions: [setup.qres.Job(setup.job.slaver)],
      relevant_skills: {
        aid: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
        social: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
      },
      relevant_traits: {
        skill_connected: setup.DUTY_TRAIT_CRIT_CHANCE,
        per_smart: setup.DUTY_TRAIT_NORMAL_CHANCE,
        per_slow: -setup.DUTY_TRAIT_NORMAL_CHANCE,
      },
      is_can_replace_with_specialist: true,
    })
  }
}

/**
 * @type {setup.DutyTemplateRelationshipManager}
 */
// @ts-ignore
setup.dutytemplate.relationshipmanager = () => new setup.DutyTemplateRelationshipManager()
