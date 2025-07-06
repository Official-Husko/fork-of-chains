"use strict";
// @ts-nocheck
setup.SexGoalClass.OrgasmSelf = class OrgasmSelf extends setup.SexGoal {
    constructor() {
        super('orgasmself', [ /* tags */], 'Orgasm on self', 'Will try to satisfy own desires above all', 2, /* base chance weight */ {
            per_gregarious: -1,
            per_loner: 1,
            per_lavish: -1,
            per_frugal: 1,
            per_proud: 2,
            per_humble: -2,
            per_cruel: 2,
            per_kind: -2,
            per_masochistic: -5,
            per_loyal: -1,
            per_independent: 1,
            per_dominant: 2,
            per_submissive: -2,
            per_honorable: -2,
            per_evil: 2,
            per_stubborn: 1,
            per_curious: -1,
        });
    }
    /**
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @returns {setup.SexPlanner}
     */
    getPlanner(unit, sex) {
        return new setup.SexPlannerClass.OrgasmSelf(unit, sex);
    }
};
setup.sexgoal.orgasmself = new setup.SexGoalClass.OrgasmSelf();
