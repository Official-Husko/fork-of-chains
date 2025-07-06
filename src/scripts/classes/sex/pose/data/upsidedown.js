"use strict";
// @ts-nocheck
setup.SexPoseClass.UpsideDown = class UpsideDown extends setup.SexPoseFloor {
    constructor() {
        super('upsidedown', [ /* tags */], 'Upside Down', 'Legs hanging helplessly from the ceiling', {
            arms: { facing_key: 'front', height_key: 'floor' },
            legs: { facing_key: 'front', height_key: 'high' },
            tail: { facing_key: 'back', height_key: 'medium' },
            penis: { facing_key: 'front', height_key: 'medium' },
            breasts: { facing_key: 'front', height_key: 'low' },
            mouth: { facing_key: 'front', height_key: 'floor' },
            vagina: { facing_key: 'back', height_key: 'medium' },
            anus: { facing_key: 'back', height_key: 'medium' },
        });
    }
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_upsidedown'),
            setup.qres.SexIsInLocationSupportingUpsideDown(),
        ]);
    }
    /**
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawDescribe(unit, sex) {
        const floor = sex.getLocation().repSurface(sex);
        const furniture = sex.getLocation().repUpsideDownFurniture();
        return [
            `a|Reps a|feet are secured to the ${furniture}, and a|their head a|is now just inches from the ${floor}`,
            `a|Reps a|feet are hoisted up to the ceiling and securely into the ${furniture}, leaving a|them hanging upside-down`,
            `a|Rep a|is positioned upside-down as a|their a|feet are secured to the ${furniture}.`,
        ];
    }
    rawDescribePosition(unit, sex) {
        return [
            `Being upside-down`,
            `Hanging upside-down`,
            `Hanging helplessly from the ceiling`,
        ];
    }
    rawRepResist(me, them, sex) {
        const floor = sex.getLocation().repSurface(sex);
        const furniture = sex.getLocation().repUpsideDownFurniture();
        return [
            `a|Rep a|let out a|a_sob as a|they hang helplessly from the ${furniture}, unable to
      resist anything that is coming to a|them.`,
            `a|Rep a|is helpless to do anything as a|they a|is suspended from the ${furniture}, making a|their
      entire a|body available for whatever b|rep b|desire.`,
            `Begging for b|rep to release a|them from the ${furniture},
      a|rep desperately a|try whatever a|they can to avoid b|rep, before sobbing in distress as b|they b|take
      hold of a|their helpless body and b|pull a|them closer.`,
        ];
    }
};
setup.sexpose.upsidedown = new setup.SexPoseClass.UpsideDown();
