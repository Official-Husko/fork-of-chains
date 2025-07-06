// @ts-nocheck

// for load order:
import "../dutytemplate";

setup.DutyTemplatePrestigeSlave = class DutyTemplatePrestigeSlave extends setup.DutyTemplate {
  /**
   * @param {{
   * key: string,
   * type: string,
   * name: string,
   * description_passage: string,
   * unit_restrictions: setup.Restriction[],
   * relevant_traits?: Object<string, number>,
   * }} args
   */
  constructor(args) {
    super(args)
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {number}
   */
  computeValuePrestige(unit) {
    return Math.max(this.computeChanceForUnit(unit), 0)
  }

  /**
   * @param {setup.DutyInstancePrestigeSlave} duty_instance 
   * @param {setup.Unit} unit 
   */
  onAssign(duty_instance, unit) {
    duty_instance.setCurrentPrestige(this.computeValuePrestige(unit))
  }

  /**
   * @param {setup.DutyInstancePrestigeSlave} duty_instance 
   * @param {setup.Unit} unit 
   */
  onUnassign(duty_instance, unit) {
    duty_instance.unsetCurrentPrestige()
  }

  /**
   * @param {setup.DutyInstancePrestigeSlave} duty_instance 
   */
  advanceWeek(duty_instance) {
    super.advanceWeek(duty_instance)

    // update prestige, if appropriate.
    const unit = duty_instance.getAssignedUnit()
    if (unit) {
      const prestige = this.computeValuePrestige(unit)
      if (prestige != duty_instance.getCurrentPrestige()) {
        setup.notify(`The effectiveness of ${unit.rep()} as ${duty_instance.rep()} has changed.`)
        duty_instance.setCurrentPrestige(prestige)
      }
    }
  }
}

setup.DutyInstancePrestigeSlave = class DutyInstancePrestigeSlave extends setup.DutyInstance {
  /**
   * @param {{
   * duty_template: setup.DutyTemplate
   * }} args
   */
  constructor(args) {
    super(args)
    this.prestige = 0
  }

  /**
   * @returns {number}
   */
  getCurrentPrestige() {
    return this.prestige
  }

  /**
   * @param {number} prestige 
   */
  setCurrentPrestige(prestige) {
    const diff = prestige - this.prestige
    this.prestige = prestige
    if (diff) {
      State.variables.company.player.addPrestige(diff)
    }
  }

  unsetCurrentPrestige() {
    this.setCurrentPrestige(0)
  }
}


/**
 * @type {setup.DutyTemplatePrestigeSlave}
 */
// @ts-ignore
setup.dutytemplate.analfuckholeslave = () => new setup.DutyTemplatePrestigeSlave({
  key: 'analfuckholeslave',
  name: 'Anal Fuckhole Slave',
  description_passage: 'DutyAnalFuckholeSlave',
  type: 'prestige',
  relevant_traits: {
    training_anal_basic: setup.DUTY_TRAIT_PRESTIGE1,
    training_anal_advanced: setup.DUTY_TRAIT_PRESTIGE3,
    training_anal_master: setup.DUTY_TRAIT_PRESTIGE5,
    value_high1: setup.DUTY_TRAIT_PRESTIGE1,
    value_high2: setup.DUTY_TRAIT_PRESTIGE2,
    value_high3: setup.DUTY_TRAIT_PRESTIGE3,
    value_high4: setup.DUTY_TRAIT_PRESTIGE4,
    value_high5: setup.DUTY_TRAIT_PRESTIGE5,
    value_high6: setup.DUTY_TRAIT_PRESTIGE6,
    value_high7: setup.DUTY_TRAIT_PRESTIGE6,
    per_calm: setup.DUTY_TRAIT_PRESTIGE2,
    anus_tight: setup.DUTY_TRAIT_PRESTIGE1,
    per_aggressive: -setup.DUTY_TRAIT_PRESTIGE2,
    anus_gape: -setup.DUTY_TRAIT_PRESTIGE2,
  },
  unit_restrictions: [
    setup.qres.Job(setup.job.slave),
    setup.qres.Trait(setup.trait.training_anal_basic),
  ],
})


/**
 * @type {setup.DutyTemplatePrestigeSlave}
 */
// @ts-ignore
setup.dutytemplate.sissyslave = () => new setup.DutyTemplatePrestigeSlave({
  key: 'sissyslave',
  name: 'Sissy Slave',
  description_passage: 'DutySissySlave',
  type: 'prestige',
  relevant_traits: {
    training_sissy_basic: setup.DUTY_TRAIT_PRESTIGE1,
    training_sissy_advanced: setup.DUTY_TRAIT_PRESTIGE3,
    training_sissy_master: setup.DUTY_TRAIT_PRESTIGE5,
    value_high1: setup.DUTY_TRAIT_PRESTIGE1,
    value_high2: setup.DUTY_TRAIT_PRESTIGE2,
    value_high3: setup.DUTY_TRAIT_PRESTIGE3,
    value_high4: setup.DUTY_TRAIT_PRESTIGE4,
    value_high5: setup.DUTY_TRAIT_PRESTIGE5,
    value_high6: setup.DUTY_TRAIT_PRESTIGE6,
    value_high7: setup.DUTY_TRAIT_PRESTIGE6,
    muscle_thin: setup.DUTY_TRAIT_PRESTIGE1,
    muscle_verythin: setup.DUTY_TRAIT_PRESTIGE2,
    muscle_extremelythin: setup.DUTY_TRAIT_PRESTIGE3,
    skill_alchemy: setup.DUTY_TRAIT_PRESTIGE2,
    muscle_strong: -setup.DUTY_TRAIT_PRESTIGE1,
    muscle_verystrong: -setup.DUTY_TRAIT_PRESTIGE2,
    muscle_extremelystrong: -setup.DUTY_TRAIT_PRESTIGE3,
  },
  unit_restrictions: [
    setup.qres.Job(setup.job.slave),
    setup.qres.Trait(setup.trait.training_sissy_basic),
  ],
})


/**
 * @type {setup.DutyTemplatePrestigeSlave}
 */
// @ts-ignore
setup.dutytemplate.toiletslave = () => new setup.DutyTemplatePrestigeSlave({
  key: 'toiletslave',
  name: 'Toilet Slave',
  description_passage: 'DutyToiletSlave',
  type: 'prestige',
  relevant_traits: {
    training_toilet_basic: setup.DUTY_TRAIT_PRESTIGE1,
    training_toilet_advanced: setup.DUTY_TRAIT_PRESTIGE3,
    training_toilet_master: setup.DUTY_TRAIT_PRESTIGE5,
    value_high1: setup.DUTY_TRAIT_PRESTIGE1,
    value_high2: setup.DUTY_TRAIT_PRESTIGE2,
    value_high3: setup.DUTY_TRAIT_PRESTIGE3,
    value_high4: setup.DUTY_TRAIT_PRESTIGE4,
    value_high5: setup.DUTY_TRAIT_PRESTIGE5,
    value_high6: setup.DUTY_TRAIT_PRESTIGE6,
    value_high7: setup.DUTY_TRAIT_PRESTIGE6,
    per_slow: setup.DUTY_TRAIT_PRESTIGE2,
    per_brave: setup.DUTY_TRAIT_PRESTIGE2,
    per_smart: -setup.DUTY_TRAIT_PRESTIGE2,
    per_cautious: -setup.DUTY_TRAIT_PRESTIGE2,
  },
  unit_restrictions: [
    setup.qres.Job(setup.job.slave),
    setup.qres.Trait(setup.trait.training_toilet_basic),
  ],
})


/**
 * @type {setup.DutyTemplatePrestigeSlave}
 */
// @ts-ignore
setup.dutytemplate.maidslave = () => new setup.DutyTemplatePrestigeSlave({
  key: 'maidslave',
  name: 'Maid Slave',
  description_passage: 'DutyMaidSlave',
  type: 'prestige',
  relevant_traits: {
    training_domestic_basic: setup.DUTY_TRAIT_PRESTIGE1,
    training_domestic_advanced: setup.DUTY_TRAIT_PRESTIGE3,
    training_domestic_master: setup.DUTY_TRAIT_PRESTIGE5,
    value_high1: setup.DUTY_TRAIT_PRESTIGE1,
    value_high2: setup.DUTY_TRAIT_PRESTIGE2,
    value_high3: setup.DUTY_TRAIT_PRESTIGE3,
    value_high4: setup.DUTY_TRAIT_PRESTIGE4,
    value_high5: setup.DUTY_TRAIT_PRESTIGE5,
    value_high6: setup.DUTY_TRAIT_PRESTIGE6,
    value_high7: setup.DUTY_TRAIT_PRESTIGE6,
    per_chaste: setup.DUTY_TRAIT_PRESTIGE2,
    skill_ambidextrous: setup.DUTY_TRAIT_PRESTIGE2,
    per_lustful: -setup.DUTY_TRAIT_PRESTIGE2,
    per_sexaddict: -setup.DUTY_TRAIT_PRESTIGE3,
  },
  unit_restrictions: [
    setup.qres.Job(setup.job.slave),
    setup.qres.Trait(setup.trait.training_domestic_basic),
  ],
})


/**
 * @type {setup.DutyTemplatePrestigeSlave}
 */
// @ts-ignore
setup.dutytemplate.furnitureslave = () => new setup.DutyTemplatePrestigeSlave({
  key: 'furnitureslave',
  name: 'Furniture Slave',
  description_passage: 'DutyFurnitureSlave',
  type: 'prestige',
  relevant_traits: {
    training_endurance_basic: setup.DUTY_TRAIT_PRESTIGE1,
    training_endurance_advanced: setup.DUTY_TRAIT_PRESTIGE3,
    training_endurance_master: setup.DUTY_TRAIT_PRESTIGE5,
    value_high1: setup.DUTY_TRAIT_PRESTIGE1,
    value_high2: setup.DUTY_TRAIT_PRESTIGE2,
    value_high3: setup.DUTY_TRAIT_PRESTIGE3,
    value_high4: setup.DUTY_TRAIT_PRESTIGE4,
    value_high5: setup.DUTY_TRAIT_PRESTIGE5,
    value_high6: setup.DUTY_TRAIT_PRESTIGE6,
    value_high7: setup.DUTY_TRAIT_PRESTIGE6,
    per_loner: setup.DUTY_TRAIT_PRESTIGE2,
    per_serious: setup.DUTY_TRAIT_PRESTIGE2,
    per_gregarious: -setup.DUTY_TRAIT_PRESTIGE2,
    per_playful: -setup.DUTY_TRAIT_PRESTIGE2,
  },
  unit_restrictions: [
    setup.qres.Job(setup.job.slave),
    setup.qres.Trait(setup.trait.training_endurance_basic),
  ],
})


/**
 * @type {setup.DutyTemplatePrestigeSlave}
 */
// @ts-ignore
setup.dutytemplate.punchingbagslave = () => new setup.DutyTemplatePrestigeSlave({
  key: 'punchingbagslave',
  name: 'Punching Bag Slave',
  description_passage: 'DutyPunchingBagSlave',
  type: 'prestige',
  relevant_traits: {
    training_masochist_basic: setup.DUTY_TRAIT_PRESTIGE1,
    training_masochist_advanced: setup.DUTY_TRAIT_PRESTIGE3,
    training_masochist_master: setup.DUTY_TRAIT_PRESTIGE5,
    value_high1: setup.DUTY_TRAIT_PRESTIGE1,
    value_high2: setup.DUTY_TRAIT_PRESTIGE2,
    value_high3: setup.DUTY_TRAIT_PRESTIGE3,
    value_high4: setup.DUTY_TRAIT_PRESTIGE4,
    value_high5: setup.DUTY_TRAIT_PRESTIGE5,
    value_high6: setup.DUTY_TRAIT_PRESTIGE6,
    value_high7: setup.DUTY_TRAIT_PRESTIGE6,
    per_masochistic: setup.DUTY_TRAIT_PRESTIGE2,
    tough_tough: setup.DUTY_TRAIT_PRESTIGE2,
    tough_nimble: -setup.DUTY_TRAIT_PRESTIGE2,
    per_lunatic: -setup.DUTY_TRAIT_PRESTIGE2,
  },
  unit_restrictions: [
    setup.qres.Job(setup.job.slave),
    setup.qres.Trait(setup.trait.training_masochist_basic),
  ],
})


/**
 * @type {setup.DutyTemplatePrestigeSlave}
 */
// @ts-ignore
setup.dutytemplate.dogslave = () => new setup.DutyTemplatePrestigeSlave({
  key: 'dogslave',
  name: 'Dog Slave',
  description_passage: 'DutyDogSlave',
  type: 'prestige',
  relevant_traits: {
    training_pet_basic: setup.DUTY_TRAIT_PRESTIGE1,
    training_pet_advanced: setup.DUTY_TRAIT_PRESTIGE3,
    training_pet_master: setup.DUTY_TRAIT_PRESTIGE5,
    value_high1: setup.DUTY_TRAIT_PRESTIGE1,
    value_high2: setup.DUTY_TRAIT_PRESTIGE2,
    value_high3: setup.DUTY_TRAIT_PRESTIGE3,
    value_high4: setup.DUTY_TRAIT_PRESTIGE4,
    value_high5: setup.DUTY_TRAIT_PRESTIGE5,
    value_high6: setup.DUTY_TRAIT_PRESTIGE6,
    value_high7: setup.DUTY_TRAIT_PRESTIGE6,
    per_playful: setup.DUTY_TRAIT_PRESTIGE2,
    per_loyal: setup.DUTY_TRAIT_PRESTIGE2,
    per_serious: -setup.DUTY_TRAIT_PRESTIGE2,
    per_independent: -setup.DUTY_TRAIT_PRESTIGE2,
  },
  unit_restrictions: [
    setup.qres.Job(setup.job.slave),
    setup.qres.Trait(setup.trait.training_pet_basic),
  ],
})


/**
 * @type {setup.DutyTemplatePrestigeSlave}
 */
// @ts-ignore
setup.dutytemplate.decorationslave = () => new setup.DutyTemplatePrestigeSlave({
  key: 'decorationslave',
  name: 'Decoration Slave',
  description_passage: 'DutyDecorationSlave',
  type: 'prestige',
  relevant_traits: {
    training_horny_basic: setup.DUTY_TRAIT_PRESTIGE1,
    training_horny_advanced: setup.DUTY_TRAIT_PRESTIGE3,
    training_horny_master: setup.DUTY_TRAIT_PRESTIGE5,
    value_high1: setup.DUTY_TRAIT_PRESTIGE1,
    value_high2: setup.DUTY_TRAIT_PRESTIGE2,
    value_high3: setup.DUTY_TRAIT_PRESTIGE3,
    value_high4: setup.DUTY_TRAIT_PRESTIGE4,
    value_high5: setup.DUTY_TRAIT_PRESTIGE5,
    value_high6: setup.DUTY_TRAIT_PRESTIGE6,
    value_high7: setup.DUTY_TRAIT_PRESTIGE6,
    per_lustful: setup.DUTY_TRAIT_PRESTIGE2,
    per_sexaddict: setup.DUTY_TRAIT_PRESTIGE2,
    skill_ambidextrous: setup.DUTY_TRAIT_PRESTIGE2,
    per_chaste: -setup.DUTY_TRAIT_PRESTIGE2,
  },
  unit_restrictions: [
    setup.qres.Job(setup.job.slave),
    setup.qres.Trait(setup.trait.training_horny_basic),
  ],
})


/**
 * @type {setup.DutyTemplatePrestigeSlave}
 */
// @ts-ignore
setup.dutytemplate.oralfuckholeslave = () => new setup.DutyTemplatePrestigeSlave({
  key: 'oralfuckholeslave',
  name: 'Oral Fuckhole Slave',
  description_passage: 'DutyOralFuckholeSlave',
  type: 'prestige',
  relevant_traits: {
    training_oral_basic: setup.DUTY_TRAIT_PRESTIGE1,
    training_oral_advanced: setup.DUTY_TRAIT_PRESTIGE3,
    training_oral_master: setup.DUTY_TRAIT_PRESTIGE5,
    value_high1: setup.DUTY_TRAIT_PRESTIGE1,
    value_high2: setup.DUTY_TRAIT_PRESTIGE2,
    value_high3: setup.DUTY_TRAIT_PRESTIGE3,
    value_high4: setup.DUTY_TRAIT_PRESTIGE4,
    value_high5: setup.DUTY_TRAIT_PRESTIGE5,
    value_high6: setup.DUTY_TRAIT_PRESTIGE6,
    value_high7: setup.DUTY_TRAIT_PRESTIGE6,
    per_submissive: setup.DUTY_TRAIT_PRESTIGE2,
    face_attractive: setup.DUTY_TRAIT_PRESTIGE2,
    face_beautiful: setup.DUTY_TRAIT_PRESTIGE3,
    per_dominant: -setup.DUTY_TRAIT_PRESTIGE2,
    face_scary: -setup.DUTY_TRAIT_PRESTIGE2,
    face_hideous: -setup.DUTY_TRAIT_PRESTIGE3,
  },
  unit_restrictions: [
    setup.qres.Job(setup.job.slave),
    setup.qres.Trait(setup.trait.training_oral_basic),
  ],
})


/**
 * @type {setup.DutyTemplatePrestigeSlave}
 */
// @ts-ignore
setup.dutytemplate.entertainmentslave = () => new setup.DutyTemplatePrestigeSlave({
  key: 'entertainmentslave',
  name: 'Entertainment Slave',
  description_passage: 'DutyEntertainmentSlave',
  type: 'prestige',
  relevant_traits: {
    training_obedience_basic: setup.DUTY_TRAIT_PRESTIGE1,
    training_obedience_advanced: setup.DUTY_TRAIT_PRESTIGE3,
    training_obedience_master: setup.DUTY_TRAIT_PRESTIGE5,
    value_high1: setup.DUTY_TRAIT_PRESTIGE1,
    value_high2: setup.DUTY_TRAIT_PRESTIGE2,
    value_high3: setup.DUTY_TRAIT_PRESTIGE3,
    value_high4: setup.DUTY_TRAIT_PRESTIGE4,
    value_high5: setup.DUTY_TRAIT_PRESTIGE5,
    value_high6: setup.DUTY_TRAIT_PRESTIGE6,
    value_high7: setup.DUTY_TRAIT_PRESTIGE6,
    skill_entertain: setup.DUTY_TRAIT_PRESTIGE2,
    per_gregarious: setup.DUTY_TRAIT_PRESTIGE2,
    per_loner: -setup.DUTY_TRAIT_PRESTIGE2,
  },
  unit_restrictions: [
    setup.qres.Job(setup.job.slave),
    setup.qres.Trait(setup.trait.training_obedience_basic),
  ],
})


/**
 * @type {setup.DutyTemplatePrestigeSlave}
 */
// @ts-ignore
setup.dutytemplate.ponyslave = () => new setup.DutyTemplatePrestigeSlave({
  key: 'ponyslave',
  name: 'Pony Slave',
  description_passage: 'DutyPonySlave',
  type: 'prestige',
  relevant_traits: {
    training_pony_basic: setup.DUTY_TRAIT_PRESTIGE1,
    training_pony_advanced: setup.DUTY_TRAIT_PRESTIGE3,
    training_pony_master: setup.DUTY_TRAIT_PRESTIGE5,
    value_high1: setup.DUTY_TRAIT_PRESTIGE1,
    value_high2: setup.DUTY_TRAIT_PRESTIGE2,
    value_high3: setup.DUTY_TRAIT_PRESTIGE3,
    value_high4: setup.DUTY_TRAIT_PRESTIGE4,
    value_high5: setup.DUTY_TRAIT_PRESTIGE5,
    value_high6: setup.DUTY_TRAIT_PRESTIGE6,
    value_high7: setup.DUTY_TRAIT_PRESTIGE6,
    skill_animal: setup.DUTY_TRAIT_PRESTIGE2,
    muscle_strong: setup.DUTY_TRAIT_PRESTIGE1,
    muscle_verystrong: setup.DUTY_TRAIT_PRESTIGE2,
    muscle_extremelystrong: setup.DUTY_TRAIT_PRESTIGE3,
    muscle_thin: -setup.DUTY_TRAIT_PRESTIGE1,
    muscle_verythin: -setup.DUTY_TRAIT_PRESTIGE2,
    muscle_extremelythin: -setup.DUTY_TRAIT_PRESTIGE3,
  },
  unit_restrictions: [
    setup.qres.Job(setup.job.slave),
    setup.qres.Trait(setup.trait.training_pony_basic),
  ],
})


/**
 * @type {setup.DutyTemplatePrestigeSlave}
 */
// @ts-ignore
setup.dutytemplate.dominatrixslave = () => new setup.DutyTemplatePrestigeSlave({
  key: 'dominatrixslave',
  name: 'Dominatrix Slave',
  description_passage: 'DutyDominatrixSlave',
  type: 'prestige',
  relevant_traits: {
    training_dominance_basic: setup.DUTY_TRAIT_PRESTIGE1,
    training_dominance_advanced: setup.DUTY_TRAIT_PRESTIGE3,
    training_dominance_master: setup.DUTY_TRAIT_PRESTIGE5,
    value_high1: setup.DUTY_TRAIT_PRESTIGE1,
    value_high2: setup.DUTY_TRAIT_PRESTIGE2,
    value_high3: setup.DUTY_TRAIT_PRESTIGE3,
    value_high4: setup.DUTY_TRAIT_PRESTIGE4,
    value_high5: setup.DUTY_TRAIT_PRESTIGE5,
    value_high6: setup.DUTY_TRAIT_PRESTIGE6,
    value_high7: setup.DUTY_TRAIT_PRESTIGE6,
    per_dominant: setup.DUTY_TRAIT_PRESTIGE2,
    skill_hypnotic: setup.DUTY_TRAIT_PRESTIGE2,
    per_submissive: -setup.DUTY_TRAIT_PRESTIGE2,
  },
  unit_restrictions: [
    setup.qres.Job(setup.job.slave),
    setup.qres.Trait(setup.trait.training_dominance_basic),
  ],
})


/**
 * @type {setup.DutyTemplatePrestigeSlave}
 */
// @ts-ignore
setup.dutytemplate.theatreslave = () => new setup.DutyTemplatePrestigeSlave({
  key: 'theatreslave',
  name: 'Acting Slave',
  description_passage: 'DutyTheatreSlave',
  type: 'prestige',
  relevant_traits: {
    training_roleplay_basic: setup.DUTY_TRAIT_PRESTIGE1,
    training_roleplay_advanced: setup.DUTY_TRAIT_PRESTIGE3,
    training_roleplay_master: setup.DUTY_TRAIT_PRESTIGE5,
    value_high1: setup.DUTY_TRAIT_PRESTIGE1,
    value_high2: setup.DUTY_TRAIT_PRESTIGE2,
    value_high3: setup.DUTY_TRAIT_PRESTIGE3,
    value_high4: setup.DUTY_TRAIT_PRESTIGE4,
    value_high5: setup.DUTY_TRAIT_PRESTIGE5,
    value_high6: setup.DUTY_TRAIT_PRESTIGE6,
    value_high7: setup.DUTY_TRAIT_PRESTIGE6,
    per_dreamy: setup.DUTY_TRAIT_PRESTIGE2,
    skill_creative: setup.DUTY_TRAIT_PRESTIGE2,
    per_attentive: -setup.DUTY_TRAIT_PRESTIGE2,
  },
  unit_restrictions: [
    setup.qres.Job(setup.job.slave),
    setup.qres.Trait(setup.trait.training_roleplay_basic),
  ],
})


/**
 * @type {setup.DutyTemplatePrestigeSlave}
 */
// @ts-ignore
setup.dutytemplate.vaginafuckholeslave = () => new setup.DutyTemplatePrestigeSlave({
  key: 'vaginafuckholeslave',
  name: 'Vagina Fuckhole Slave',
  description_passage: 'DutyVaginaFuckholeSlave',
  type: 'prestige',
  relevant_traits: {
    training_vagina_basic: setup.DUTY_TRAIT_PRESTIGE1,
    training_vagina_advanced: setup.DUTY_TRAIT_PRESTIGE3,
    training_vagina_master: setup.DUTY_TRAIT_PRESTIGE5,
    value_high1: setup.DUTY_TRAIT_PRESTIGE1,
    value_high2: setup.DUTY_TRAIT_PRESTIGE2,
    value_high3: setup.DUTY_TRAIT_PRESTIGE3,
    value_high4: setup.DUTY_TRAIT_PRESTIGE4,
    value_high5: setup.DUTY_TRAIT_PRESTIGE5,
    value_high6: setup.DUTY_TRAIT_PRESTIGE6,
    value_high7: setup.DUTY_TRAIT_PRESTIGE6,
    per_lavish: setup.DUTY_TRAIT_PRESTIGE2,
    vagina_tight: setup.DUTY_TRAIT_PRESTIGE1,
    per_frugal: -setup.DUTY_TRAIT_PRESTIGE2,
    vagina_gape: -setup.DUTY_TRAIT_PRESTIGE2,
  },
  unit_restrictions: [
    setup.qres.Job(setup.job.slave),
    setup.qres.Trait(setup.trait.training_vagina_basic),
  ],
})


/**
 * @type {setup.DutyTemplatePrestigeSlave}
 */
// @ts-ignore
setup.dutytemplate.cumcowslave = () => new setup.DutyTemplatePrestigeSlave({
  key: 'cumcowslave',
  name: 'Cum Cow Slave',
  description_passage: 'DutyCumCowSlave',
  type: 'prestige',
  relevant_traits: {
    balls_tiny: setup.DUTY_TRAIT_PRESTIGE1,
    balls_small: setup.DUTY_TRAIT_PRESTIGE1,
    balls_medium: setup.DUTY_TRAIT_PRESTIGE2,
    balls_large: setup.DUTY_TRAIT_PRESTIGE3,
    balls_huge: setup.DUTY_TRAIT_PRESTIGE4,
    balls_titanic: setup.DUTY_TRAIT_PRESTIGE5,
    value_high2: setup.DUTY_TRAIT_PRESTIGE1,
    value_high3: setup.DUTY_TRAIT_PRESTIGE1,
    value_high4: setup.DUTY_TRAIT_PRESTIGE2,
    value_high5: setup.DUTY_TRAIT_PRESTIGE2,
    value_high6: setup.DUTY_TRAIT_PRESTIGE3,
    value_high7: setup.DUTY_TRAIT_PRESTIGE6,
  },
  unit_restrictions: [
    setup.qres.Job(setup.job.slave),
    setup.qres.Trait(setup.trait.balls_tiny),
    setup.qres.Trait(setup.trait.dick_tiny),
  ],
})


/**
 * @type {setup.DutyTemplatePrestigeSlave}
 */
// @ts-ignore
setup.dutytemplate.milkcowslave = () => new setup.DutyTemplatePrestigeSlave({
  key: 'milkcowslave',
  name: 'Milk Cow Slave',
  description_passage: 'DutyMilkCowSlave',
  type: 'prestige',
  relevant_traits: {
    breast_tiny: setup.DUTY_TRAIT_PRESTIGE1,
    breast_small: setup.DUTY_TRAIT_PRESTIGE1,
    breast_medium: setup.DUTY_TRAIT_PRESTIGE2,
    breast_large: setup.DUTY_TRAIT_PRESTIGE3,
    breast_huge: setup.DUTY_TRAIT_PRESTIGE4,
    breast_titanic: setup.DUTY_TRAIT_PRESTIGE5,
    value_high2: setup.DUTY_TRAIT_PRESTIGE1,
    value_high3: setup.DUTY_TRAIT_PRESTIGE1,
    value_high4: setup.DUTY_TRAIT_PRESTIGE2,
    value_high5: setup.DUTY_TRAIT_PRESTIGE2,
    value_high6: setup.DUTY_TRAIT_PRESTIGE3,
    value_high7: setup.DUTY_TRAIT_PRESTIGE6,
  },
  unit_restrictions: [
    setup.qres.Job(setup.job.slave),
    setup.qres.Trait(setup.trait.breast_tiny),
  ],
})
