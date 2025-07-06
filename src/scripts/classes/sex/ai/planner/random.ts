// @ts-nocheck

/**
 * Aims to maximize self pleasure.
 */
setup.SexPlannerClass.Random = class Random extends setup.SexPlanner {
  constructor(...args) {
    // @ts-ignore
    super(...args)
  }

  /**
   * @returns {setup.SexPlan}
   */
  getNextPlan() {
    return new setup.SexPlanClass.Random(this.unit, this.sex)
  }
}

