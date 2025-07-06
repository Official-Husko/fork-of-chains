"use strict";
// @ts-nocheck
setup.SexPoseClass.Kneel = class Kneel extends setup.SexPoseFloor {
    constructor() {
        super('kneel', [ /* tags */], 'Kneel', 'On the knees', {
            arms: { facing_key: 'front', height_key: 'medium' },
            legs: { facing_key: 'back', height_key: 'floor' },
            tail: { facing_key: 'back', height_key: 'low' },
            penis: { facing_key: 'front', height_key: 'low' },
            breasts: { facing_key: 'front', height_key: 'medium' },
            mouth: { facing_key: 'front', height_key: 'medium' },
            vagina: { facing_key: 'back', height_key: 'low' },
            anus: { facing_key: 'back', height_key: 'low' },
        });
    }
    /**
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawDescribe(unit, sex) {
        return [
            `a|Rep a|kneel.`,
            `a|Rep a|is now on a|their knees.`,
        ];
    }
    rawDescribePosition(unit, sex) {
        return [
            `Kneeling`,
            `Down on a|their knees`,
            `On a|their knees`,
        ];
    }
};
setup.sexpose.kneel = new setup.SexPoseClass.Kneel();
