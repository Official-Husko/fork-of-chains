"use strict";
// @ts-nocheck
setup.SexGoalClass.Resist = class Resist extends setup.SexGoal {
    constructor() {
        super('resist', [ /* tags */], 'Resist', 'Will try to resist getting penetrated', 0, /* base chance weight */ {
            per_lunatic: 2,
        });
    }
    /**
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @returns {setup.SexPlanner}
     */
    getPlanner(unit, sex) {
        return new setup.SexPlannerClass.Random(unit, sex);
    }
};
setup.sexgoal.resist = new setup.SexGoalClass.Resist();
