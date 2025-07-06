"use strict";
// @ts-nocheck
setup.SexBodypartClass.Arms = class Arms extends setup.SexBodypart {
    constructor() {
        super('arms', [ /* tags */], 'Arms', 'Arms');
    }
    repSimple(unit) {
        return setup.rng.choice(['arms',]);
    }
    getEquipmentSlots() {
        return [
            setup.equipmentslot.arms,
        ];
    }
    heightTolerance() { return 1; }
    giveArousalMultiplier(me, sex) {
        return 1.0;
    }
    receiveArousalMultiplier(me, sex) {
        return 1.0;
    }
    isCanUseCovered() { return true; }
    isFlexible() { return true; }
    /**
     * @param {setup.Unit} unit
     * @param {setup.Unit} target
     * @param {setup.SexBodypart} target_bodypart
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawDescribeEnd(unit, target, target_bodypart, sex) {
        // supports anus, vagina
        const desc = target_bodypart.rep(target, sex);
        return [
            `a|rep a|withdraw a|their finger from b|reps ${desc}, leaving it empty and unfilled.`,
        ];
    }
};
setup.sexbodypart.arms = new setup.SexBodypartClass.Arms();
