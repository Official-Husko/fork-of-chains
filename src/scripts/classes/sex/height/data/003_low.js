"use strict";
// @ts-nocheck
setup.SexHeightClass.Low = class Low extends setup.SexHeight {
    constructor() {
        super('low', 
        /* height = */ 1);
    }
    getNextHigherHeight() { return setup.sexheight.medium; }
    repHeightLevel() {
        return 'knee';
    }
};
setup.sexheight.low = new setup.SexHeightClass.Low();
