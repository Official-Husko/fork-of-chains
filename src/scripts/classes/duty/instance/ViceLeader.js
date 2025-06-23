// for load order:
import { } from "../dutytemplate"

setup.DutyTemplateViceLeader = class DutyTemplateViceLeader extends setup.DutyTemplate {
  constructor() {
    super({
      key: 'viceleader',
      name: 'Vice Leader',
      description_passage: 'DutyViceLeader',
      type: 'util',
      unit_restrictions: [setup.qres.Job(setup.job.slaver)],
      relevant_skills: {
        combat: 0.001,
        brawn: 0.001,
        survival: 0.001,
        intrigue: 0.001,
        slaving: 0.001,
        knowledge: 0.001,
        social: 0.001,
        aid: 0.001,
        arcane: 0.001,
        sex: 0.001,
      },
      relevant_traits: {
      },
    })
  }
}

/**
 * @type {setup.DutyTemplateViceLeader}
 */
// @ts-ignore
setup.dutytemplate.viceleader = () => new setup.DutyTemplateViceLeader()
