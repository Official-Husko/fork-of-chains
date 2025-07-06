// @ts-nocheck

/**
 * Aims to maximize self pleasure.
 */
class SexPlannerConsensualBase extends setup.SexPlanner {
  constructor(...args) {
    // @ts-ignore
    super(...args)
    this.plan_count = 0
    this.is_last_orgasm = false
  }

  /**
   * @returns {setup.SexPlan}
   */
  getSexPlan() {
    return new setup.SexPlanClass.OrgasmSelf(this.unit, this.sex)
  }

  /**
   * @returns {setup.SexPlan}
   */
  getNextPlan() {
    this.plan_count += 1
    if (this.plan_count == 1) {
      if (this.sex.getPermission(this.unit).getDisallowedTags().includes('positionself')) {
        // cannot change position, abort plan
        this.plan_count += 1
      } else {
        // position change to a random one.
        const planclass = setup.rng.choice([
          setup.SexPlanClass.PositionChangeFront,
          setup.SexPlanClass.PositionChangeCenter,
          setup.SexPlanClass.PositionChangeBack,
          setup.SexPlanClass.PositionChangeTop,
        ])
        return new planclass(this.unit, this.sex)
      }
    }
    if (this.plan_count == 2 ||
        (this.is_last_orgasm && Math.random() < setup.Sex.AI_POSE_CHANGE_PLAN_CHANCE)) {
      if (this.sex.getPermission(this.unit).getDisallowedTags().includes('poseself')) {
        // cannot change pose
        this.plan_count += 1
      } else {
        this.is_last_orgasm = false
        if (this.sex.getPace(this.unit) == setup.sexpace.dom) {
          // a small chance to change position
          if (Math.random() < setup.Sex.AI_POSITION_CHANGE_PLAN_CHANCE) {
            const planclass = setup.rng.choice([
              setup.SexPlanClass.PositionChangeFront,
              setup.SexPlanClass.PositionChangeCenter,
              setup.SexPlanClass.PositionChangeBack,
              setup.SexPlanClass.PositionChangeTop,
            ])
            return new planclass(this.unit, this.sex)
          }
        }
        return new setup.SexPlanClass.PoseChange(this.unit, this.sex)
      }
    }

    this.is_last_orgasm = true
    return this.getSexPlan()
  }
}


/**
 * Aims to maximize self pleasure.
 */
setup.SexPlannerClass.OrgasmSelf = class OrgasmSelf extends SexPlannerConsensualBase {
  /**
   * @returns {setup.SexPlan}
   */
  getSexPlan() {
    return new setup.SexPlanClass.OrgasmSelf(this.unit, this.sex)
  }
}


/**
 * Aims to maximize both pleasure.
 */
setup.SexPlannerClass.OrgasmAll = class OrgasmAll extends SexPlannerConsensualBase {
  /**
   * @returns {setup.SexPlan}
   */
  getSexPlan() {
    return new setup.SexPlanClass.OrgasmAll(this.unit, this.sex)
  }
}

/**
 * Aims to maximize both pleasure.
 */
setup.SexPlannerClass.OrgasmThem = class OrgasmThem extends SexPlannerConsensualBase {
  /**
   * @returns {setup.SexPlan}
   */
  getSexPlan() {
    return new setup.SexPlanClass.OrgasmThem(this.unit, this.sex)
  }
}






