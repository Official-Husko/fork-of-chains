/**
 * Tracks the amount of favor your company has with all other entities out there.
 * @extends setup.TwineClass
 */
setup.Favor = class Favor extends setup.TwineClass {
  constructor() {
    super()

    /**
     * company_key: favor_amount
     * @type {object}
     */
    this.company_favor_map = {}

    // list of company_keys managed by the relationship manager.
    this.managed_company_keys = []
  }

  /**
   * @returns {Array.<setup.Company>}
   */
  getManagedCompanies() {
    const max_managed = this.getMaxManagedCompanies()
    const result = []
    const managed_companies = this.getAllManagedCompanies()
    for (let i = 0; i < managed_companies.length; ++i) {
      if (i >= max_managed) break
      const company = managed_companies[i]
      result.push(company)
    }
    return result
  }

  /**
   * @returns {Array.<setup.Company>}
   */
  getAllManagedCompanies() {
    return this.managed_company_keys.map(key => State.variables.company[key])
  }

  /**
   * @param {setup.Company} company
   */
  addManagedCompany(company) {
    this.managed_company_keys.push(company.key)
  }

  /**
   * @param {setup.Company} company
   */
  removeManagedCompany(company) {
    if (!this.managed_company_keys.includes(company.key)) throw new Error(`${company.key} not found in remove managed companies`)
    this.managed_company_keys = this.managed_company_keys.filter(key => key != company.key)
  }

  /**
   * @returns {number}
   */
  getMaxManagedCompanies() {
    const relationshipmanager = State.variables.dutylist.getDuty('relationshipmanager')
    if (!relationshipmanager) return 0
    const chance = relationshipmanager.computeChance()
    return Math.min(
      setup.FAVOR_RELATIONSHIP_MANAGER_UPKEEPS.length,
      Math.ceil(chance / setup.FAVOR_RELATIONSHIP_MANAGER_COMPANY_EVERY))
  }

  /**
   * Upkeep for relationship manager. Returns 0 if you don't have one assigned or it's not managing anything.
   * @returns {number}
   */
  getRelationshipManagerUpkeep() {
    const managed = this.getManagedCompanies().length
    if (!managed) return 0
    return setup.FAVOR_RELATIONSHIP_MANAGER_UPKEEPS[managed - 1]
  }

  /**
   * favor with company += favor
   * @param {setup.Company} company
   * @param {number} favor
   */
  adjustFavor(company, favor) {
    if (!(company.key in this.company_favor_map)) {
      this.company_favor_map[company.key] = 0
    }

    const init_favor = this.company_favor_map[company.key]

    this.company_favor_map[company.key] += favor

    this.company_favor_map[company.key] = Math.max(
      this.company_favor_map[company.key],
      0)
    this.company_favor_map[company.key] = Math.min(
      this.company_favor_map[company.key],
      setup.FAVOR_MAX)

    const final_favor = this.company_favor_map[company.key]

    return final_favor - init_favor
  }


  /**
   * @param {setup.Company} company
   */
  getFavor(company) {
    if (!(company.key in this.company_favor_map)) return 0
    return this.company_favor_map[company.key]
  }

  /**
   * Whether your company has ever interacted with this company
   * @param {setup.Company} company
   */
  isCompanyKnown(company) {
    return (company.key in this.company_favor_map) || State.variables.ire._isCompanyKnown(company)
  }

  /**
   * Do end-of-week things, including decaying favors and granting bonuses from high favor
   */
  advanceWeek() {
    // first, apply all benefits
    for (const company_key in this.company_favor_map) {
      /**
       * @type {setup.Company}
       */
      const company = State.variables.company[company_key]
      const favor = this.company_favor_map[company_key]

      if (company.isFavorActive()) {
        for (let i = setup.FAVOR_EFFECT_THRESHOLDS.length - 1; i >= 0; --i) {
          if (favor >= setup.FAVOR_EFFECT_THRESHOLDS[i]) {
            // gain this effect.
            const effects = company.getFavorEffects()[i]
            setup.RestrictionLib.applyAll(effects, company)
            break
          }
        }
      }
    }

    // next, decay favors. Note: needs to be in a separate, second loop after the above
    for (const company_key in this.company_favor_map) {
      const company = State.variables.company[company_key]
      this.adjustFavor(company, -this.getDecay(company))
    }

    // finally, pay relationship manager upkeep
    const upkeep = this.getRelationshipManagerUpkeep()
    if (upkeep) {
      const duty = State.variables.dutylist.getDuty('relationshipmanager')
      const managed = this.getManagedCompanies().length
      setup.notify(`${setup.capitalize(duty.repYourDutyRep())} spent <<money ${upkeep}>> this week managing relationship with ${managed} companies.`,)
    }
  }

  /**
   * How much decay at this point of favor?
   * @param {setup.Company} company
   */
  getDecay(company) {
    const favor = this.getFavor(company)
    // get current decay rate, and previous decay rate
    let [previous_threshold, previous_decay] = [0, 0]
    let [current_threshold, current_decay] = [0, 0]

    let decay_table = setup.FAVOR_DECAY
    if (this.getManagedCompanies().includes(company)) {
      decay_table = setup.FAVOR_DECAY_RELATIONSHIP_MANAGER
    }
    for (let i = 0; i < decay_table.length; ++i) {
      const [threshold, decay] = decay_table[i]
      if (favor <= threshold) {
        [current_threshold, current_decay] = [threshold, decay]
        if (i) {
          [previous_threshold, previous_decay] = decay_table[i - 1]
        }
        break
      }
    }

    let base_decay = current_decay

    // if decaying still falls under current threshold, apply full decay
    if (favor - base_decay >= previous_threshold) return base_decay

    // otherwise, decay is capped by either getting to threshold, or by the amount of decay in previous threshold
    return Math.max(previous_decay, favor - previous_threshold)
  }

  /**
   * Convert money to favor.
   * @param {number} money 
   * @returns {number}
   */
  static fromMoney(money) {
    return Math.round(money / 20.0)
  }

}
