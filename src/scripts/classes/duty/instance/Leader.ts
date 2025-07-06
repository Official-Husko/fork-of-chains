// @ts-nocheck

// for load order:
import "../dutytemplate";

setup.DutyTemplateLeader = class DutyTemplateLeader extends setup.DutyTemplate {
  constructor() {
    super({
      key: 'leader',
      name: 'Leader',
      description_passage: 'DutyLeader',
      type: 'util',
      unit_restrictions: [
        setup.qres.Job(setup.job.slaver),
        setup.qres.You()
      ],
      relevant_skills: {
        combat: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 10,
        brawn: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 10,
        survival: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 10,
        intrigue: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 10,
        slaving: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 10,
        knowledge: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 10,
        social: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 10,
        aid: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 10,
        arcane: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 10,
        sex: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 10,
      },
      relevant_traits: {
      },
      is_allow_leader: true,
    })
  }

  /**
   * @param {setup.DutyInstance} duty_instance 
   */
  advanceWeek(duty_instance) {
    super.advanceWeek(duty_instance)

    let proc = duty_instance.getProc()
    if (proc == 'proc' || proc == 'crit') {
      let price
      if (proc == 'crit') {
        price = setup.LEADER_MONEY_CRIT
      } else {
        price = setup.LEADER_MONEY
      }
      price = setup.nudgeMoney(price * setup.lowLevelMoneyMulti())

      setup.notify(`You work from your office, earning your company some coin`,)
      State.variables.company.player.addMoney(price)
    }
  }
}

/**
 * @type {setup.DutyTemplateLeader}
 */
// @ts-ignore
setup.dutytemplate.leader = () => new setup.DutyTemplateLeader()
