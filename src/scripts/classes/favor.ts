// @ts-nocheck

/**
 * Favor management system for tracking and decaying favor with companies.
 * Optimized for Twine JS games. Handles favor adjustments, decay, and conversions.
 *
 * Example usage:
 *   const favor = new setup.Favor();
 *   favor.adjustFavor(company, 10); // Add 10 favor to a company
 *   favor.advanceWeek(); // Apply weekly decay and effects
 *   const current = favor.getFavor(company); // Get current favor
 *
 * Expected structure of setup.FAVOR_DECAY and setup.FAVOR_DECAY_RELATIONSHIP_MANAGER:
 *   Both are arrays of [threshold, decay] pairs, sorted in ascending order by threshold.
 *   Example:
 *     setup.FAVOR_DECAY = [
 *       [10, 1],   // If favor <= 10, decay by 1
 *       [50, 2],   // If favor <= 50, decay by 2
 *       [100, 3],  // If favor <= 100, decay by 3
 *       ...
 *     ];
 *   setup.FAVOR_DECAY_RELATIONSHIP_MANAGER = [ ... ]; // Same structure, but for managed companies
 *
 * @extends setup.TwineClass
 */
setup.Favor = class Favor extends setup.TwineClass {
  constructor() {
    super();
    /**
     * Maps company keys to their current favor value.
     * @type {Object.<string, number>}
     */
    this.company_favor_map = {};
    /**
     * Set of company keys currently managed by the relationship manager.
     * @type {Set<string>}
     */
    this.managed_company_keys = new Set();
  }

  /**
   * Returns an array of companies currently managed, up to the allowed maximum.
   * @returns {Array<setup.Company>}
   */
  getManagedCompanies() {
    const max = this.getMaxManagedCompanies();
    return Array.from(this.managed_company_keys)
      .slice(0, max)
      .map(key => State.variables.company[key]);
  }

  /**
   * Returns all companies that are marked as managed, regardless of current limit.
   * @returns {Array<setup.Company>}
   */
  getAllManagedCompanies() {
    return Array.from(this.managed_company_keys).map(key => State.variables.company[key]);
  }

  /**
   * Adds a company to the managed list.
   * @param {setup.Company} company
   * @returns {boolean} True if added, false if already present or invalid.
   */
  addManagedCompany(company) {
    if (!company || typeof company.key !== 'string') return false;
    if (!this.managed_company_keys.has(company.key)) {
      this.managed_company_keys.add(company.key);
      return true;
    }
    return false;
  }

  /**
   * Removes a company from the managed list.
   * @param {setup.Company} company
   * @throws {Error} If the company is not managed or invalid.
   */
  removeManagedCompany(company) {
    if (!company || typeof company.key !== 'string') throw new Error('Invalid company');
    if (!this.managed_company_keys.has(company.key)) throw new Error(`${company.key} not found in managed companies`);
    this.managed_company_keys.delete(company.key);
  }

  /**
   * Calculates the maximum number of companies that can be managed based on the relationship manager's chance.
   * @returns {number}
   */
  getMaxManagedCompanies() {
    const duty = State.variables.dutylist.getDuty('relationshipmanager');
    if (!duty) return 0;
    const chance = duty.computeChance();
    return Math.min(
      setup.FAVOR_RELATIONSHIP_MANAGER_UPKEEPS.length,
      Math.ceil(chance / setup.FAVOR_RELATIONSHIP_MANAGER_COMPANY_EVERY)
    );
  }

  /**
   * Returns the weekly upkeep cost for the relationship manager, based on managed companies.
   * @returns {number}
   */
  getRelationshipManagerUpkeep() {
    const managed = this.getManagedCompanies().length;
    return managed ? setup.FAVOR_RELATIONSHIP_MANAGER_UPKEEPS[managed - 1] : 0;
  }

  /**
   * Adjusts favor for a company by a given amount, clamping between 0 and FAVOR_MAX.
   * @param {setup.Company} company
   * @param {number} favorDelta
   * @returns {number} Net change in favor after clamping.
   */
  adjustFavor(company, favorDelta) {
    if (!company || typeof company.key !== 'string') throw new Error('Invalid company');
    if (typeof favorDelta !== 'number' || isNaN(favorDelta)) throw new Error('Invalid favorDelta');
    const key = company.key;
    const prev = this.company_favor_map[key] || 0;
    let next = prev + favorDelta;
    next = Math.max(0, Math.min(next, setup.FAVOR_MAX));
    this.company_favor_map[key] = next;
    return next - prev;
  }

  /**
   * Gets the current favor value for a company.
   * @param {setup.Company} company
   * @returns {number}
   */
  getFavor(company) {
    if (!company || typeof company.key !== 'string') throw new Error('Invalid company');
    return Object.hasOwn(this.company_favor_map, company.key) ? this.company_favor_map[company.key] : 0;
  }

  /**
   * Checks if the company is known (favor tracked or known by ire system).
   * @param {setup.Company} company
   * @returns {boolean}
   */
  isCompanyKnown(company) {
    if (!company || typeof company.key !== 'string') return false;
    return (
      Object.hasOwn(this.company_favor_map, company.key) ||
      State.variables.ire._isCompanyKnown(company)
    );
  }

  /**
   * Advances the week: applies favor effects, decays favor, and pays upkeep.
   * Should be called at the end of each in-game week.
   */
  advanceWeek() {
    // Apply favor-based effects for each company
    for (const key in this.company_favor_map) {
      const company = State.variables.company[key];
      const favor = this.company_favor_map[key];
      if (company.isFavorActive()) {
        const effectsArr = company.getFavorEffects();
        for (let i = setup.FAVOR_EFFECT_THRESHOLDS.length - 1; i >= 0; --i) {
          if (favor >= setup.FAVOR_EFFECT_THRESHOLDS[i]) {
            setup.RestrictionLib.applyAll(effectsArr[i], company);
            break;
          }
        }
      }
    }
    // Decay favor for all companies
    for (const key in this.company_favor_map) {
      const company = State.variables.company[key];
      this.adjustFavor(company, -this.getDecay(company));
    }
    // Pay relationship manager upkeep if needed
    const upkeep = this.getRelationshipManagerUpkeep();
    if (upkeep) {
      const duty = State.variables.dutylist.getDuty('relationshipmanager');
      const managed = this.getManagedCompanies().length;
      if (duty) {
        setup.notify(
          `${setup.capitalize(duty.repYourDutyRep())} spent <<money ${upkeep}>> this week managing relationships with ${managed} companies.`
        );
      }
    }
  }

  /**
   * Calculates the favor decay for a company based on current favor and management status.
   * Uses decay tables for managed/unmanaged companies.
   * @param {setup.Company} company
   * @returns {number} Favor decay amount
   */
  getDecay(company) {
    if (!company || typeof company.key !== 'string') throw new Error('Invalid company');
    const favor = this.getFavor(company);
    const managed = this.getManagedCompanies().includes(company);
    const decayTable = managed ? setup.FAVOR_DECAY_RELATIONSHIP_MANAGER : setup.FAVOR_DECAY;
    let prevThreshold = 0, prevDecay = 0;
    for (let i = 0; i < decayTable.length; ++i) {
      const [threshold, decay] = decayTable[i];
      if (favor <= threshold) {
        // If decaying by full amount doesn't drop below previous threshold, apply full decay
        if (favor - decay >= prevThreshold) return decay;
        // Otherwise, decay is capped by either reaching the threshold or previous decay
        return Math.max(prevDecay, favor - prevThreshold);
      }
      prevThreshold = threshold;
      prevDecay = decay;
    }
    // If above all thresholds, apply max decay
    return prevDecay;
  }

  /**
   * Converts a money value to favor points (rounded).
   * @param {number} money
   * @returns {number}
   */
  static fromMoney(money) {
    if (typeof money !== 'number' || isNaN(money)) throw new Error('Invalid money value');
    return Math.round(money / 20);
  }
};
