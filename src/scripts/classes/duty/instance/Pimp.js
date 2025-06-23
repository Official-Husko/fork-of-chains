// for load order:
import { } from "../dutytemplate"

setup.DutyTemplatePimp = class DutyTemplatePimp extends setup.DutyTemplate {
  /**
   * @param {{
   * key: string,
   * name: string,
   * relevant_skills: Object<string, number>,
   * relevant_traits: Object<string, number>,
   * managed_duties: string[],
   * }} args
   */
  constructor({
    key,
    name,
    relevant_skills,
    relevant_traits,
    managed_duties,
  }) {
    super({
      key: key,
      name: name,
      description_passage: `Duty${key}_DescriptionPassage`,
      type: 'pimp',
      unit_restrictions: [setup.qres.Job(setup.job.slaver)],
      relevant_skills: relevant_skills,
      relevant_traits: relevant_traits,
      is_can_replace_with_specialist: true,
    })
    this.managed_duty_template_keys = managed_duties
  }

  /**
   * @returns {setup.DutyTemplate[]}
   */
  getManagedDutyTemplates() {
    return this.managed_duty_template_keys.map(key => setup.dutytemplate[key])
  }

  /**
   * @param {setup.DutyInstance} duty_instance 
   */
  advanceWeek(duty_instance) {
    super.advanceWeek(duty_instance)

    const proc = duty_instance.getProc()
    if (proc == 'proc' || proc == 'crit') {
      // compute money
      const prestiges = []
      for (const duty_template of this.getManagedDutyTemplates()) {
        /**
         * @type {setup.DutyInstancePrestigeSlave}
         */ // @ts-ignore
        const duty = State.variables.dutylist.getDuty(duty_template)
        if (duty) {
          const prestige = duty.getCurrentPrestige()
          if (prestige) {
            prestiges.push(prestige)
          }
        }
      }

      prestiges.sort()
      prestiges.reverse()

      let prestige_sum = 0
      const total = prestiges.length
      const gained = Math.min(total, setup.PIMP_SLAVE_LIMIT)
      for (let i = 0; i < gained; ++i) {
        prestige_sum += prestiges[i]
      }

      let money = prestige_sum * setup.PIMP_PRESTIGE_MULTIPLIER
      if (proc == 'crit') {
        money *= setup.PIMP_CRIT_MULTIPLIER
      }

      money = setup.nudgeMoney(money)

      if (money) {
        let text = `${setup.capitalize(duty_instance.repYourDutyRep())} made you <<money ${Math.round(money)}>> this week from ${gained} slave${gained > 1 ? 's' : ''}`
        if (proc == 'crit') text += `, thanks to a particularly busy week`

        if (gained < total) {
          text += `. ${total - gained} slave${(total - gained) > 1 ? 's were' : ' was'} left unmanaged`
        }

        setup.notify(text)
        State.variables.company.player.addMoney(Math.round(money))
      } else if (!gained) {
        let text = `${setup.capitalize(duty_instance.repYourDutyRep())} does not currently have any slaves to manage and made zero profit this week`
        setup.notify(text)
      }
    }
  }
}

/**
 * @type {setup.DutyTemplatePimp}
 */
// @ts-ignore
setup.dutytemplate.entertainmentpimp = () => new setup.DutyTemplatePimp({
  key: 'entertainmentpimp',
  name: 'Entertainment Pimp',
  relevant_traits: {
    skill_entertain: setup.DUTY_TRAIT_CRIT_CHANCE,
    per_gregarious: setup.DUTY_TRAIT_NORMAL_CHANCE,
    per_loner: -setup.DUTY_TRAIT_NORMAL_CHANCE,
  },
  relevant_skills: {
    slaving: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
    social: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
  },
  managed_duties: [
    'entertainmentslave',
    'dogslave',
    'ponyslave',
    'decorationslave',
    'punchingbagslave',
    'toiletslave',
  ],
})

/**
 * @type {setup.DutyTemplatePimp}
 */
// @ts-ignore
setup.dutytemplate.servicepimp = () => new setup.DutyTemplatePimp({
  key: 'servicepimp',
  name: 'Service Pimp',
  relevant_traits: {
    skill_alchemy: setup.DUTY_TRAIT_CRIT_CHANCE,
    per_lavish: setup.DUTY_TRAIT_NORMAL_CHANCE,
    per_frugal: -setup.DUTY_TRAIT_NORMAL_CHANCE,
  },
  relevant_skills: {
    slaving: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
    aid: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
  },
  managed_duties: [
    'milkcowslave',
    'cumcowslave',
    'maidslave',
    'theatreslave',
    'furnitureslave',
  ],
})

/**
 * @type {setup.DutyTemplatePimp}
 */
// @ts-ignore
setup.dutytemplate.sexpimp = () => new setup.DutyTemplatePimp({
  key: 'sexpimp',
  name: 'Sex Pimp',
  relevant_traits: {
    magic_earth: setup.DUTY_TRAIT_NORMAL_CHANCE,
    magic_earth_master: setup.DUTY_TRAIT_CRIT_CHANCE,
    per_dominant: setup.DUTY_TRAIT_NORMAL_CHANCE,
    per_submissive: -setup.DUTY_TRAIT_NORMAL_CHANCE,
  },
  relevant_skills: {
    slaving: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
    sex: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
  },
  managed_duties: [
    'sissyslave',
    'dominatrixslave',
    'analfuckholeslave',
    'oralfuckholeslave',
    'vaginafuckholeslave',
  ],
})

