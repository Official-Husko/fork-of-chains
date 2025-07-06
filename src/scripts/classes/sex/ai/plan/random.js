"use strict";
// @ts-nocheck
/**
 * Random select ouf of available options
 */
setup.SexPlanClass.Random = class Random extends setup.SexPlan {
    constructor(...args) {
        // @ts-ignore
        super(...args);
    }
    /**
     * @param {setup.SexAction[]} actions
     * @returns {setup.SexAction | null}
     */
    selectAction(actions) {
        // do nothing takes lowest priority, if any
        const others = actions.filter(action => !(action instanceof setup.SexActionClass.DoNothing));
        if (others.length)
            return setup.rng.choice(others);
        return setup.rng.choice(actions);
    }
    /**
     * Whether the plan has been completed or aborted, and a new plan should be taken
     * @returns {boolean}
     */
    isComplete() {
        return false;
    }
};
