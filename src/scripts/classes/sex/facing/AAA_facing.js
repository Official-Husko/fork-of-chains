"use strict";
// @ts-nocheck
setup.SexFacingClass = {};
setup.sexfacing = class {
};
/**
 * Where a bodypart faces. For aligning bodyparts for actions, e.g., mouth and dick to align for a blowjob.
 * How this work: look at this diagram:
 *
 *            [ unit4 ]
 * [ unit1 ]  [ unit2 ]  [ unit3 ]
 *  front->    <-front    <-front
 *
 * This is done like this instead of unit1 turning back so that it can accomodate 3 people.
 */
setup.SexFacing = class SexFacing extends setup.TwineClassCustom {
    constructor(key) {
        super();
        this.key = key;
    }
    /**
     * @returns {string}
     */
    getContainer() { return `setup.SexFacingClass`; }
    /**
     * @returns {setup.SexFacing[]}
     */
    static getAllFacings() {
        return Object.values(setup.sexfacing);
    }
    /**
     * @returns {setup.SexFacing}
     */
    getOpposite() {
        return setup.sexfacing.front;
    }
    /**
     * Whether this facing is facing up or down, not forward/bakcwards
     * @returns {boolean}
     */
    isUpDown() { return this.isUp() || this.isDown(); }
    /**
     * Whether this facing is front-ish, not back-ish
     * @returns {boolean}
     */
    isFrontIsh() { return false; }
    /**
     * Whether this facing is upwards
     * @returns {boolean}
     */
    isUp() { return true; }
    /**
     * Whether this facing is downwards
     * @returns {boolean}
     */
    isDown() { return true; }
};
