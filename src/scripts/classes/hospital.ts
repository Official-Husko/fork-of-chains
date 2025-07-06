// @ts-nocheck

// special. Will be assigned to State.variables.hospital
setup.Hospital = class Hospital extends setup.TwineClass {
  constructor() {
    super()
    // {'unitkey': 5}
    this.unit_injury_map = {}
  }

  /**
   * @param {setup.Unit} unit 
   */
  deleteUnit(unit) {
    delete this.unit_injury_map[unit.key]
  }

  /**
   * @param {setup.Unit} unit 
   * @param {number} injury_amt 
   */
  injureUnit(unit, injury_amt) {
    // statistics 
    if (unit.isSlaver()) {
      // how many slaver/slave ever got injured?
      State.variables.statistics.add('injury_slaver_count', 1)
      // total number of injury weeks on your slavers/slave
      State.variables.statistics.add('injury_slaver_week_sum', injury_amt)
    } else if (unit.isSlave()) {
      // how many slaver/slave ever got injured?
      State.variables.statistics.add('injury_slave_count', 1)
      // total number of injury weeks on your slavers/slave
      State.variables.statistics.add('injury_slave_week_sum', injury_amt)
    }

    if (injury_amt === undefined || injury_amt === null) injury_amt = 1
    if (injury_amt <= 0) return

    {
      // if unit has blessing of weakness, use it
      let added = 0
      while (
        added + setup.CURSE_INJURY_WEEKS <= (setup.CURSE_INJURY_MULTIPLIER - 1) * injury_amt &&
        unit.isHasTrait(setup.trait.curse_weakness1
        )) {

        added += setup.CURSE_INJURY_WEEKS
        unit.decreaseTrait(setup.trait.curse_weakness1.getTraitGroup())
      }
      injury_amt += added
      if (added && unit.isYourCompany()) {
        setup.notify(`a|Reps Curse of Weakness adds ${added} extra weeks of injuries`, { a: unit })
      }

      // if unit has blessing of protection, use it
      let prevented = 0
      while (injury_amt && unit.isHasTrait(setup.trait.blessing_protection1)) {
        let new_prevention = Math.min(injury_amt, setup.BLESSING_INJURY_WEEKS)
        prevented += new_prevention
        injury_amt -= new_prevention
        unit.decreaseTrait(setup.trait.blessing_protection1.getTraitGroup())
      }

      if (prevented && unit.isYourCompany()) {
        setup.notify(`a|Reps Blessing of Injury prevents ${prevented} weeks of injuries`, { a: unit })
      }
    }

    if (injury_amt) {
      if (!(unit.key in this.unit_injury_map)) {
        this.unit_injury_map[unit.key] = 0
      }
      this.unit_injury_map[unit.key] += injury_amt
      if (unit.isYourCompany()) {
        setup.notify(`a|Rep a|is <<dangertext 'injured'>> for ${injury_amt} week${injury_amt !== 1 ? 's' : ''}.`, { a: unit })
        if (unit.isSlaver()) {
          State.variables.statistics.setMax('injury_slaver_week_max', this.getInjury(unit))
          State.variables.statistics.setMax(
            'injury_slaver_simultaneous', State.variables.company.player.getUnits({ job: setup.job.slaver, injured: true }).length)
        } else if (unit.isSlave()) {
          State.variables.statistics.setMax('injury_slave_week_max', this.getInjury(unit))
          State.variables.statistics.setMax(
            'injury_slave_simultaneous', State.variables.company.player.getUnits({ job: setup.job.slave, injured: true }).length)
        }
      }
    }
  }

  healUnit(unit, heal_amt) {
    if (!(unit.key in this.unit_injury_map)) return   // nothing to heal
    if (heal_amt === undefined || heal_amt === null) heal_amt = 1
    this.unit_injury_map[unit.key] -= heal_amt
    if (this.unit_injury_map[unit.key] <= 0) {
      delete this.unit_injury_map[unit.key]
      if (unit.isYourCompany()) {
        setup.notify(`a|Rep a|have <<successtext 'recovered'>> from injuries.`, { a: unit })
      }
    }
  }

  /**
   * Heal a random unit by one week.
   */
  healRandom() {
    let units = State.variables.company.player.getUnits({ injured: true })
    if (units.length) {
      let unit = setup.rng.choice(units)
      this.healUnit(unit)
      return unit
    }
    return null
  }

  advanceWeek() {
    // heal all injured units by one week.
    let unitkeys = Object.keys(this.unit_injury_map)
    for (let i = 0; i < unitkeys.length; ++i) {
      let unit = State.variables.unit[unitkeys[i]]
      if (!unit) {
        // unit was deleted due to a bug. V1.4.1.3
        delete this.unit_injury_map[unitkeys[i]]
      } else {
        this.healUnit(unit)
      }
    }

    let doctor = State.variables.dutylist.getDuty('doctor')
    if (doctor) {
      let doctor_heal = 0
      let attempts = setup.DOCTOR_ATTEMPTS
      if (doctor.getProc() == 'crit') {
        attempts = setup.DOCTOR_ATTEMPTS_CRIT
      }
      for (let i = 0; i < attempts; ++i) {
        let proc = doctor.getProc()
        if (proc == 'proc' || proc == 'crit') {
          if (this.healRandom()) {
            doctor_heal += 1
          }
        }
      }
      if (doctor_heal) {
        setup.notify(`${setup.capitalize(doctor.repYourDutyRep())} helps heal ${doctor_heal} weeks of injuries`,)
      }
    }
  }

  isInjured(unit) {
    return this.getInjury(unit) > 0
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {number}
   */
  getInjury(unit) {
    if (!(unit.key in this.unit_injury_map)) return 0
    if (!unit.isYourCompany() && !unit.getMarket()) {
      this.healUnit(unit, setup.INFINITY)
      return 0
    }
    return this.unit_injury_map[unit.key]
  }

}
