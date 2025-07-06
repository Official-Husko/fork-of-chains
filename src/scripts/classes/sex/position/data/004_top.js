"use strict";
// @ts-nocheck
setup.SexPositionClass.Top = class Top extends setup.SexPosition {
    constructor() {
        super('top', [ /* tags */], 'Top', 'Top');
    }
    /**
     * Describes what happens when a unit moves to this position. Assumes it's empty.
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawDescribe(unit, sex) {
        const swap_with = sex.getUnitAtPosition(this);
        if (swap_with) {
            return [
                `a|Rep a|swap positions with b|rep.`,
                `a|Rep a|exchange positions with b|rep.`,
            ];
        }
        else {
            return [
                `a|Rep a|move to top c|rep.`,
                `a|Rep a|proceed to top c|rep.`,
            ];
        }
    }
    /**
     * @returns {setup.SexPose}
     */
    getDefaultPose() { return setup.sexpose.missionary; }
    getRelativePosition(position) {
        if (position == setup.sexposition.center) {
            return `on top of`;
        }
        else {
            return `in front of`;
        }
    }
};
setup.sexposition.top = new setup.SexPositionClass.Top();
