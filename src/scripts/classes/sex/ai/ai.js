"use strict";
// @ts-nocheck
/**
 * Abstract class. Governs how NPC gets their next action.
 */
setup.SexAI = class SexAI extends setup.TwineClass {
    /**
     * Create an AI for this unit.
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     */
    constructor(unit, sex) {
        super();
        this.unit = unit;
        this.sex = sex;
        /**
         * @type {setup.SexPlan}
         */
        this.plan = null;
        /**
         * @type {setup.SexPlanner}
         */
        this.planner = null;
        // create a planner
        if (this.unit.isMindbroken()) {
            this.planner = new setup.SexPlannerClass.Random(this.unit, this.sex);
        }
        else {
            const goal = sex.getGoal(unit);
            this.planner = goal.getPlanner(unit, sex);
        }
    }
    /**
     * @param {setup.SexAction[]} actions
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @return {setup.SexAction}
     */
    _doSelectAction(actions, unit, sex) {
        // If orgasming, it takes priority
        {
            const orgasms = actions.filter(action => action.getTags().includes('orgasm'));
            if (orgasms.length) {
                return setup.rng.choice(orgasms);
            }
        }
        // If no more energy, chance to end the intercourse
        {
            if (sex.isEnergyDepleted(unit) && Math.random() < setup.Sex.AI_END_SEX_CHANCE) {
                const end_sex = actions.filter(action => action instanceof setup.SexActionClass.SexEnd);
                if (end_sex.length)
                    return setup.rng.choice(end_sex);
            }
        }
        // If in great discomfort, also takes priority
        {
            const discomfort = sex.getDiscomfort(unit);
            let chance = (discomfort - setup.Sex.DISCOMFORT_MIN_TRIGGER) / (setup.Sex.DISCOMFORT_MAX_TRIGGER - setup.Sex.DISCOMFORT_MIN_TRIGGER);
            if (!this.unit.isMasochistic() && Math.random() < chance) {
                // Force a relieving action.
                const reliefs = actions.filter(action => action.getDiscomfort(unit, sex) < 0);
                if (reliefs.length) {
                    return setup.rng.sampleArray(reliefs.map(action => [action, -action.getDiscomfort(unit, sex)]), 
                    /* normalize = */ true);
                }
            }
        }
        // If cannot orgasm and arousing is starting to bud, then arousal reducers take priority.
        {
            const arousal = sex.getArousal(unit);
            let chance = (arousal - setup.Sex.AROUSAL_MIN_TRIGGER) / (setup.Sex.AROUSAL_MAX_TRIGGER - setup.Sex.AROUSAL_MIN_TRIGGER);
            if (!this.unit.isCanOrgasm() && Math.random() < chance) {
                // Force an arousal decreasing action
                const reliefs = actions.filter(action => action.getArousal(unit, sex) < 0);
                if (reliefs.length) {
                    return setup.rng.sampleArray(reliefs.map(action => [action, -action.getArousal(unit, sex)]), 
                    /* normalize = */ true);
                }
            }
        }
        // Use planner to pick
        while (!this.plan || this.plan.isComplete()) {
            this.plan = this.planner.getNextPlan();
        }
        const action = this.plan.selectAction(actions);
        if (action) {
            return action;
        }
        // Do nothing then.
        return actions.filter(action => action instanceof setup.SexActionClass.DoNothing)[0];
    }
    /**
     * Choose an action out of the given list of possible actions
     * Should take into account: Pace, goal, permissions, unit traits, action history
     *
     * @param {setup.Unit} unit
     * @param {setup.SexAction[]} raw_actions
     * @param {setup.SexInstance} sex
     */
    selectAction(unit, raw_actions, sex) {
        const goal = sex.getGoal(unit);
        let actions = raw_actions.filter(action => action.isAIAllowed(unit, sex));
        if (!actions.length)
            throw new Error(`Must have at least one eligible action!`);
        return this._doSelectAction(actions, unit, sex);
    }
};
