// @ts-nocheck

// for load order:
import "../dutytemplate";

setup.DutyTemplateQuestPoolDuty = class DutyTemplateQuestPoolDuty extends setup.DutyTemplate {
  /**
   * @param {{
   * key: string,
   * type: string,
   * name: string,
   * description_passage: string,
   * unit_restrictions: setup.Restriction[],
   * relevant_traits?: Object<string, number>,
   * relevant_skills?: Object<string, number>,
   * is_can_replace_with_specialist?: boolean,
   * quest_pool: setup.QuestPool,
   * quest_amount: number,
   * }} args 
   */
  constructor(args) {
    super(args)

    this.quest_pool_key = args.quest_pool.key
    this.quest_amount = args.quest_amount
  }

  /**
   * @returns {setup.QuestPool}
   */
  getQuestPool() {
    return setup.questpool[this.quest_pool_key]
  }

  /**
   * @returns {number}
   */
  getQuestAmount() { return this.quest_amount }

  /**
   * @param {setup.DutyInstance} duty_instance 
   */
  advanceWeek(duty_instance) {
    super.advanceWeek(duty_instance)

    const questpool = this.getQuestPool()
    let amount = this.getQuestAmount()

    if (duty_instance.getProc() == 'crit') {
      amount *= setup.SCOUTDUTY_CRIT_MULTIPLIER
      amount = Math.round(amount)
    }

    let generated = 0

    for (let i = 0; i < amount; ++i) {
      let proc = duty_instance.getProc()
      if (proc == 'proc' || proc == 'crit') {
        generated += 1
        questpool.generateQuest()
      }
    }
    if (generated) {
      setup.notify(`${setup.capitalize(duty_instance.repYourDutyRep())} found ${generated} new quests from ${questpool.rep()}`,)
    }
  }
}

/**
 * @type {setup.DutyTemplateQuestPoolDuty}
 */
// @ts-ignore
setup.dutytemplate.scoutvale = () => new setup.DutyTemplateQuestPoolDuty({
  key: 'scoutvale',
  type: 'scout',
  name: 'Vale Scout',
  description_passage: 'DutyScoutVale',
  unit_restrictions: [setup.qres.Job(setup.job.slaver)],
  relevant_skills: {
    brawn: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
    survival: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
  },
  relevant_traits: {
    skill_intimidating: setup.DUTY_TRAIT_CRIT_CHANCE,
    per_loner: setup.DUTY_TRAIT_NORMAL_CHANCE,
    per_gregarious: -setup.DUTY_TRAIT_NORMAL_CHANCE,
  },
  is_can_replace_with_specialist: true,
  quest_pool: setup.questpool.vale,
  quest_amount: 3,
})

/**
 * @type {setup.DutyTemplateQuestPoolDuty}
 */
// @ts-ignore
setup.dutytemplate.scoutforest = () => new setup.DutyTemplateQuestPoolDuty({
  key: 'scoutforest',
  type: 'scout',
  name: 'Forest Scout',
  description_passage: 'DutyScoutForest',
  unit_restrictions: [setup.qres.Job(setup.job.slaver)],
  relevant_skills: {
    survival: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
    arcane: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
  },
  relevant_traits: {
    skill_animal: setup.DUTY_TRAIT_CRIT_CHANCE,
    tough_nimble: setup.DUTY_TRAIT_NORMAL_CHANCE,
    tough_tough: -setup.DUTY_TRAIT_NORMAL_CHANCE,
  },
  is_can_replace_with_specialist: true,
  quest_pool: setup.questpool.forest,
  quest_amount: 2,
})

/**
 * @type {setup.DutyTemplateQuestPoolDuty}
 */
// @ts-ignore
setup.dutytemplate.scoutcity = () => new setup.DutyTemplateQuestPoolDuty({
  key: 'scoutcity',
  type: 'scout',
  name: 'City Scout',
  description_passage: 'DutyScoutCity',
  unit_restrictions: [setup.qres.Job(setup.job.slaver)],
  relevant_skills: {
    social: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
    sex: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
  },
  relevant_traits: {
    skill_hypnotic: setup.DUTY_TRAIT_CRIT_CHANCE,
    per_curious: setup.DUTY_TRAIT_NORMAL_CHANCE,
    per_stubborn: -setup.DUTY_TRAIT_NORMAL_CHANCE,
  },
  is_can_replace_with_specialist: true,
  quest_pool: setup.questpool.city,
  quest_amount: 2,
})

/**
 * @type {setup.DutyTemplateQuestPoolDuty}
 */
// @ts-ignore
setup.dutytemplate.scoutdeep = () => new setup.DutyTemplateQuestPoolDuty({
  key: 'scoutdeep',
  type: 'scout',
  name: 'Deep Scout',
  description_passage: 'DutyScoutDeep',
  unit_restrictions: [setup.qres.Job(setup.job.slaver)],
  relevant_skills: {
    combat: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
    social: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
  },
  relevant_traits: {
    magic_dark: setup.DUTY_TRAIT_NORMAL_CHANCE,
    magic_dark_master: setup.DUTY_TRAIT_CRIT_CHANCE,
    per_brave: setup.DUTY_TRAIT_NORMAL_CHANCE,
    per_cautious: -setup.DUTY_TRAIT_NORMAL_CHANCE,
  },
  is_can_replace_with_specialist: true,
  quest_pool: setup.questpool.deep,
  quest_amount: 2,
})

/**
 * @type {setup.DutyTemplateQuestPoolDuty}
 */
// @ts-ignore
setup.dutytemplate.scoutdesert = () => new setup.DutyTemplateQuestPoolDuty({
  key: 'scoutdesert',
  type: 'scout',
  name: 'Desert Scout',
  description_passage: 'DutyScoutDesert',
  unit_restrictions: [setup.qres.Job(setup.job.slaver)],
  relevant_skills: {
    combat: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
    brawn: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
  },
  relevant_traits: {
    skill_ambidextrous: setup.DUTY_TRAIT_CRIT_CHANCE,
    per_aggressive: setup.DUTY_TRAIT_NORMAL_CHANCE,
    per_calm: -setup.DUTY_TRAIT_NORMAL_CHANCE,
  },
  is_can_replace_with_specialist: true,
  quest_pool: setup.questpool.desert,
  quest_amount: 1,
})

/**
 * @type {setup.DutyTemplateQuestPoolDuty}
 */
// @ts-ignore
setup.dutytemplate.scoutsea = () => new setup.DutyTemplateQuestPoolDuty({
  key: 'scoutsea',
  type: 'scout',
  name: 'Sea Scout',
  description_passage: 'DutyScoutSea',
  unit_restrictions: [setup.qres.Job(setup.job.slaver)],
  relevant_skills: {
    combat: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 3,
    slaving: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 3,
  },
  relevant_traits: {
    skill_flight: setup.DUTY_TRAIT_CRIT_CHANCE / 3,
    per_honorable: setup.DUTY_TRAIT_NORMAL_CHANCE / 3,
    per_evil: -setup.DUTY_TRAIT_NORMAL_CHANCE / 3,
  },
  is_can_replace_with_specialist: true,
  quest_pool: setup.questpool.sea,
  quest_amount: 1,
})
