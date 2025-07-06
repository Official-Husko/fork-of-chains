// @ts-nocheck

// for load order:
import "../dutytemplate";

setup.DutyTemplateDamageControlOfficer = class DutyTemplateDamageControlOfficer extends setup.DutyTemplate {
  constructor() {
    super({
      key: 'damagecontrolofficer',
      type: 'util',
      name: 'Damage Control Officer',
      description_passage: 'DutyDamageControlOfficer',
      unit_restrictions: [setup.qres.Job(setup.job.slaver)],
      relevant_skills: {
        knowledge: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
        intrigue: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
      },
      relevant_traits: {
        skill_intimidating: setup.DUTY_TRAIT_CRIT_CHANCE,
        per_sly: setup.DUTY_TRAIT_NORMAL_CHANCE,
        per_direct: -setup.DUTY_TRAIT_NORMAL_CHANCE,
      },
      is_can_replace_with_specialist: true,
    })
  }

  /**
   * @param {setup.DutyInstance} duty_instance 
   */
  advanceWeek(duty_instance) {
    super.advanceWeek(duty_instance)

    const proc = duty_instance.getProc()
    if (proc == 'proc' || proc == 'crit') {
      // list all companies with positive ire
      const companies = []
      for (const company_key in State.variables.company) {
        const company = State.variables.company[company_key]
        const ire = State.variables.ire.getIre(company)
        if (ire) companies.push(company)
      }
      if (companies.length) {
        const company = setup.rng.choice(companies)
        const ire = State.variables.ire.getIre(company)
        let pay = setup.IRE_DCO_PAY
        if (ire >= 2 && proc == 'crit') {
          pay = setup.IRE_DCO_PAY_CRIT
          State.variables.ire.adjustIre(company, -2)
        } else {
          State.variables.ire.adjustIre(company, -1)
        }
        setup.notify(`${setup.capitalize(duty_instance.repYourDutyRep())} <<successtextlite "pacified">> ${company.rep()} in exchange for <<money ${pay}>>`)
        State.variables.company.player.substractMoney(pay)
      }
    }
  }
}

/**
 * @type {setup.DutyTemplateDamageControlOfficer}
 */
// @ts-ignore
setup.dutytemplate.damagecontrolofficer = () => new setup.DutyTemplateDamageControlOfficer()
