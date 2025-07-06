"use strict";
// @ts-nocheck
setup.SexPoseClass.AllFours = class AllFours extends setup.SexPoseFloor {
    constructor() {
        super('allfours', [ /* tags */], 'All-fours', 'Just like a dog', {
            arms: { facing_key: 'downfront', height_key: 'floor' },
            legs: { facing_key: 'downback', height_key: 'floor' },
            tail: { facing_key: 'upback', height_key: 'low' },
            penis: { facing_key: 'downback', height_key: 'low' },
            breasts: { facing_key: 'downfront', height_key: 'low' },
            mouth: { facing_key: 'front', height_key: 'low' },
            vagina: { facing_key: 'back', height_key: 'low' },
            anus: { facing_key: 'back', height_key: 'low' },
        });
    }
    getRestrictions() {
        return super.getRestrictions().concat([setup.qres.HasItem('sexmanual_allfours')]);
    }
    /**
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawDescribe(unit, sex) {
        const floor = sex.getLocation().repSurface(sex);
        return [
            `a|Rep a|get down on all fours on the ${floor}.`,
            `a|Rep a|get on the ${floor} on all fours.`,
            `a|Rep a|assume the all-fours position, with a|their ass in the air.`,
        ];
    }
    rawDescribePosition(unit, sex) {
        return [
            `Being on all-fours`,
            `Standing on all-fours`,
            `Facing the ground on all-fours`,
        ];
    }
    rawRepResist(me, them, sex) {
        const floor = sex.getLocation().repSurface(sex);
        return [
            `a|Rep a|let out a|a_sob as a|they a|try to crawl away from b|rep, but a|their efforts prove to be in vain as b|rep b|grab a|their hips and b|pull a|them back to the ${floor}.`,
            `Trying to crawl away from b|rep on all fours, a|rep a|let out a|a_sob as b|they b|grasp a|their hips, before pulling a|them back into position.`,
            `Begging for b|rep to leave a|them alone, a|rep desperately a|try to crawl away from b|them, sobbing in distress as b|they b|take hold of a|their hips and b|pull a|them back into b|them.`,
        ];
    }
};
setup.sexpose.allfours = new setup.SexPoseClass.AllFours();
