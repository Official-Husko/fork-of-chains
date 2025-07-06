// @ts-nocheck

setup.SexGoalClass.OrgasmThem = class OrgasmThem extends setup.SexGoal {
  constructor() {
    super(
      'orgasmthem',
      [ /* tags */
      ],
      'Orgasm on them',
      "Will try to satisfy other participants' desires above all",
      2,  /* base chance weight */
      {
        per_lavish: 1,
        per_frugal: -1,
        per_proud: -1,
        per_humble: 1,
        per_cruel: -1,
        per_kind: 1,
        per_masochistic: 5,
        per_dominant: -2,
        per_submissive: 2,
        per_honorable: -1,
        per_evil: -1,
        per_curious: 1,
        per_stubborn: -1,
      },
    )
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex 
   * @returns {setup.SexPlanner}
   */
  getPlanner(unit, sex) {
    return new setup.SexPlannerClass.OrgasmThem(unit, sex)
  }
}

setup.sexgoal.orgasmthem = new setup.SexGoalClass.OrgasmThem()
