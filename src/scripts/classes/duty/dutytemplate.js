export const EXPORTABLE = true

setup.DutyTemplateClass = {}

// Holds an instance of dutytemplate
setup.dutytemplate = class { }

// Base class for all duty templates
setup.DutyTemplate = class DutyTemplate extends setup.TwineClass {
  static TYPE = {
    util: 'Utility',
    scout: 'Scout',
    pimp: 'Pimp',
    prestige: 'Prestige',
    bedchamber: 'Bedchamber',
  }

  static HAS_TRIGGER_CHANCE = ['util', 'scout', 'pimp']
  static HAS_PRESTIGE = ['prestige']

  // create a new instance of a duty template
  /**
   * 
   * @param {{
   * key: string,
   * type: string,
   * name: string,
   * description_passage: string,
   * unit_restrictions: setup.Restriction[],
   * relevant_traits?: Object<string, number>,
   * relevant_skills?: Object<string, number>,
   * is_can_replace_with_specialist?: boolean,
   * is_allow_leader?: boolean
   * }} param0 
   */
  constructor({
    key,
    type,
    name,
    description_passage,
    unit_restrictions,
    relevant_traits,
    relevant_skills,
    is_can_replace_with_specialist,
    is_allow_leader,
  }) {
    super() // dummy call, will do nothing (required by js)

    this.key = key
    this.type = type
    if (!(type in setup.DutyTemplate.TYPE)) throw new Error(`Unrecognized duty type ${type}`)

    this.name = name
    this.description_passage = description_passage
    this.unit_restrictions = setup.deepCopy(unit_restrictions)
    if (!is_allow_leader) {
      this.unit_restrictions.push(setup.qres.NotYou())
    }
    this.is_can_replace_with_specialist = !!is_can_replace_with_specialist

    // check traits actually exists
    if (relevant_traits) {
      for (let traitkey in relevant_traits) {
        if (!(traitkey in setup.trait)) throw new Error(`Unknown trait ${traitkey} in DutyTemplate ${key}`)
      }
      this.relevant_traits = relevant_traits
    } else {
      this.relevant_traits = {}
    }

    // check skills actually exists
    if (relevant_skills) {
      for (let skillkey in relevant_skills) {
        if (!(skillkey in setup.skill)) throw new Error(`Unknown skill ${skillkey} in DutyTemplate ${key}`)
      }
      this.relevant_skills = relevant_skills
    } else {
      this.relevant_skills = {}
    }
  }

  /**
   * @returns {string}
   */
  rep() { return this.getName() }

  /**
   * @returns {boolean}
   */
  isCanReplaceWithSpecialist() { return this.is_can_replace_with_specialist }

  /**
   * @returns {boolean}
   */
  isHasTriggerChance() {
    return setup.DutyTemplate.HAS_TRIGGER_CHANCE.includes(this.getType())
  }

  /**
   * @returns {boolean}
   */
  isHasPrestigeAmount() {
    return setup.DutyTemplate.HAS_PRESTIGE.includes(this.getType())
  }

  /**
   * @returns {setup.Job[]}
   */
  getEligibleJobs() {
    return this.getUnitRestrictions().filter(
      restriction => restriction instanceof setup.qresImpl.Job).map(
        // @ts-ignore
        restriction => setup.job[restriction.job_key]
      )
  }

  /**
   * @returns {string}
   */
  getCssClass() {
    const job_class = this.getEligibleJobs().includes(setup.job.slaver) ? 'duty-image-slaver' : 'duty-image-slave'
    return 'duty-image ' + job_class
  }

  /**
   * @returns {string}
   */
  getImage() {
    return 'img/duty/' + this.key + '.svg'
  }

  /**
   * @returns {Object<string, number>}
   */
  getRelevantTraits() { return this.relevant_traits }

  /**
   * @returns {Object<Number, setup.Trait[]>}
   */
  getRelevantTraitsGrouped() {
    const groups = {}
    const traits = this.getRelevantTraits()
    for (const traitkey in traits) {
      const chance = traits[traitkey]
      if (!(chance in groups)) {
        groups[chance] = []
      }
      groups[chance].push(setup.trait[traitkey])
    }
    return groups
  }

  /**
   * @returns {Object<string, number>}
   */
  getRelevantSkills() { return this.relevant_skills }

  /**
   * actually a static method.
   * @param {setup.Unit} unit 
   */
  computeChanceForUnit(unit) {
    let chance = 0

    const skillmap = this.getRelevantSkills()
    for (const skillkey in skillmap) {
      const skill = setup.skill[skillkey]
      const unitskill = unit.getSkill(skill)
      chance += unitskill * skillmap[skillkey]
    }

    const traitmap = this.getRelevantTraits()
    for (const traitkey in traitmap) {
      if (unit.isHasTraitExact(setup.trait[traitkey])) chance += traitmap[traitkey]
    }

    if (unit.isHasTrait(setup.trait.perk_duty)) {
      const bonus = Math.min(setup.PERK_DUTY_BONUS, chance * setup.PERK_DUTY_BONUS)
      chance += bonus
    }

    return chance
  }

  /**
   * @returns {string}
   */
  getName() { return this.name }

  /**
   * @returns {string}
   */
  getType() { return this.type }

  /**
   * @returns {string}
   */
  getDescriptionPassage() { return this.description_passage }

  /**
   * @returns {setup.Restriction[]}
   */
  getUnitRestrictions() { return this.unit_restrictions }

  /**
   * @param {setup.DutyInstance} duty_instance 
   */
  advanceWeek(duty_instance) {
    // give the unit exp from drill sergeant, if you have one.
    const active_unit = duty_instance.getUnitIfAvailable()
    if (active_unit && active_unit.isSlaver()) {
      const trainer = State.variables.dutylist.getDuty('trainer')
      if (trainer) {
        const proc = trainer.getProc()
        if (proc == 'proc' || proc == 'crit') {
          let multi = 0
          if (proc == 'crit') {
            multi = setup.TRAINER_CRIT_EXP_MULTI
          } else {
            multi = 1.0
          }
          if (multi) active_unit.gainExp(Math.round(multi * active_unit.getOnDutyExp()))
        }
      }
    }
  }

  /**
   * Called when unit is assigned to this duty
   * @param {setup.DutyInstance} duty_instance 
   * @param {setup.Unit} unit 
   */
  onAssign(duty_instance, unit) { }

  /**
   * Called when unit is unassigned from this duty
   * @param {setup.DutyInstance} duty_instance 
   * @param {setup.Unit} unit 
   */
  onUnassign(duty_instance, unit) { }

  /**
   * @param {string} type 
   * @returns {string}
   */
  static getTypeRep = function (type) {
    if (!(type in setup.DutyTemplate.TYPE)) throw new Error(`Unknown duty type ${type}`)
    const tooltip = setup.DutyTemplate.TYPE[type]
    const image = `img/tag_duty/${type}.svg`
    return setup.repImgIcon(image, tooltip)
  }

  static initialize() {
    const keys = Object.keys(setup.dutytemplate)
    for (const key of keys) {
      setup.dutytemplate[key] = setup.dutytemplate[key]()
    }
  }
}
