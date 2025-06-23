// for load order:
import { } from "../dutytemplate"

setup.DutyTemplateMarketer = class DutyTemplateMarketer extends setup.DutyTemplate {
  constructor() {
    super({
      key: 'marketer',
      name: 'Marketer',
      description_passage: 'DutyMarketer',
      type: 'util',
      unit_restrictions: [setup.qres.Job(setup.job.slaver)],
      relevant_skills: {
        slaving: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
        social: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
      },
      relevant_traits: {
        skill_connected: setup.DUTY_TRAIT_CRIT_CHANCE,
        per_gregarious: setup.DUTY_TRAIT_NORMAL_CHANCE,
        per_loner: -setup.DUTY_TRAIT_NORMAL_CHANCE,
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
      const unit = duty_instance.getAssignedUnit()
      const difficulty_key = `normal${unit.getLevel()}`
      let price = Math.round(setup.qdiff[difficulty_key].getMoney() + setup.MONEY_PER_SLAVER_WEEK)

      if (proc == 'crit') {
        setup.notify(`${setup.capitalize(duty_instance.repYourDutyRep())} is working extraordinarily well this week`,)
        price *= setup.MARKETER_CRIT_MULTIPLIER
      }

      new setup.SlaveOrder(
        'Fixed-price Slave Order',
        'independent',
        setup.qu.slave,
        price,
        /* trait multi = */ 0,
        /* value multi = */ 0,
        setup.MARKETER_ORDER_EXPIRATION,
        /* fulfill outcomes = */[],
        /* fail outcomes = */[],
        setup.unitgroup.soldslaves,
      )
      setup.notify(`${setup.capitalize(duty_instance.repYourDutyRep())} found a new slave order`,)
    }
  }
}

/**
 * @type {setup.DutyTemplateMarketer}
 */
// @ts-ignore
setup.dutytemplate.marketer = () => new setup.DutyTemplateMarketer()
