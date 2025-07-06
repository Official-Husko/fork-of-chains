"use strict";
// @ts-nocheck
setup.SexPoseClass.Stand = class Stand extends setup.SexPoseFloor {
    constructor() {
        super('stand', [ /* tags */], 'Stand', 'Standing tall on two legs', {
            arms: { facing_key: 'front', height_key: 'high' },
            legs: { facing_key: 'front', height_key: 'floor' },
            tail: { facing_key: 'back', height_key: 'medium' },
            penis: { facing_key: 'front', height_key: 'medium' },
            breasts: { facing_key: 'front', height_key: 'high' },
            mouth: { facing_key: 'front', height_key: 'high' },
            vagina: { facing_key: 'back', height_key: 'medium' },
            anus: { facing_key: 'back', height_key: 'medium' },
        });
    }
    /**
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawDescribe(unit, sex) {
        return [
            `a|Rep a|stand up.`,
            `a|Rep a|get on a|their two feets.`,
            `a|Rep a|get up to stand.`,
        ];
    }
    rawDescribePosition(unit, sex) {
        return [
            `Standing`,
            `Standing tall`,
        ];
    }
};
setup.sexpose.stand = new setup.SexPoseClass.Stand();
