"use strict";
// @ts-nocheck
setup.SexHeightClass.VeryHigh = class VeryHigh extends setup.SexHeight {
    constructor() {
        super('veryhigh', 
        /* height = */ 4);
    }
    getNextVeryHigherHeight() { return setup.sexheight.veryhigh; }
    repHeightLevel() {
        return 'above head';
    }
};
setup.sexheight.veryhigh = new setup.SexHeightClass.VeryHigh();
