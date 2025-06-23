// for load order:
import { } from "../../dutytemplate"

setup.DutyTemplateQuestLivingGod = class DutyTemplateQuestLivingGod extends setup.DutyTemplate {
  constructor() {
    super({
      key: 'questlivinggod',
      name: 'Living God',
      description_passage: 'DutyQuestLivingGod',
      type: 'util',
      unit_restrictions: [
        setup.qres.Job(setup.job.slaver),
        setup.qres.Trait('bg_mythical'),
        setup.qres.HasTitle('quest_living_god'),
      ],
      relevant_skills: {
        social: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 3,
        intrigue: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 3,
        aid: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 3,
      },
      relevant_traits: {
        magic_light_master: setup.DUTY_TRAIT_CRIT_CHANCE,
        magic_light: setup.DUTY_TRAIT_NORMAL_CHANCE,
        magic_fire_master: setup.DUTY_TRAIT_CRIT_CHANCE,
        magic_fire: setup.DUTY_TRAIT_NORMAL_CHANCE,
        magic_dark_master: -setup.DUTY_TRAIT_CRIT_CHANCE,
        magic_dark: -setup.DUTY_TRAIT_NORMAL_CHANCE,
      },
    })
  }

  /**
   * @returns {boolean}
   */
  isFavor() {
    return !!State.variables.varstore.get('quest_living_god_isfavor')
  }

  /**
   * @returns {setup.Unit | null}
   */
  getLivingGod() {
    return setup.getUnit({ title: 'quest_living_god' })
  }

  /**
   * @returns {setup.Company | null}
   */
  getFavorCompany() {
    const unit = setup.dutytemplate.questlivinggod.getLivingGod()
    if (unit) {
      return unit.getHomeCompany()
    } else {
      return null
    }
  }

  favor() {
    return setup.Favor.fromMoney(setup.dutytemplate.questlivinggod.profit())
  }

  favorCrit() {
    return setup.Favor.fromMoney(setup.dutytemplate.questlivinggod.profitCrit())
  }

  profit() {
    return 500
  }

  profitCrit() {
    return 750
  }

  /**
   * @param {setup.DutyInstance} duty_instance 
   */
  advanceWeek(duty_instance) {
    super.advanceWeek(duty_instance)

    let proc = duty_instance.getProc()
    if (proc == 'proc' || proc == 'crit') {

      if (setup.dutytemplate.questlivinggod.isFavor()) {
        let favor = 0
        if (proc == 'proc') {
          favor = setup.dutytemplate.questlivinggod.favor()
        } else {
          favor = setup.dutytemplate.questlivinggod.favorCrit()
        }
        const company = setup.dutytemplate.questlivinggod.getFavorCompany()
        setup.notify(
          `${setup.capitalize(duty_instance.repYourDutyRep())} spreads some wisdom for a|their worshippers, as well as good words about your company`,
          { a: duty_instance.getAssignedUnit() })
        setup.qc.Favor(company, favor).apply()
      } else {
        let profit = 0
        if (proc == 'proc') {
          profit = setup.dutytemplate.questlivinggod.profit()
        } else {
          profit = setup.dutytemplate.questlivinggod.profitCrit()
        }
        setup.notify(`${setup.capitalize(duty_instance.repYourDutyRep())} collects some tithe from a|their worshippers`,
          { a: duty_instance.getAssignedUnit() })
        setup.qc.Money(setup.nudgeMoney(profit)).apply()
      }
    }
  }
}

/**
 * @type {setup.DutyTemplateQuestLivingGod}
 */
// @ts-ignore
setup.dutytemplate.questlivinggod = () => new setup.DutyTemplateQuestLivingGod()
