"use strict";
// @ts-nocheck
setup.qresImpl.SexIsBodypartUncovered = class SexIsBodypartUncovered extends setup.SexRestriction {
    /**
     * @param {setup.SexBodypart} bodypart
     */
    constructor(bodypart) {
        super();
        this.bodypart = bodypart;
    }
    explain() {
        return `${this.bodypart.repsimple()} is uncovered`;
    }
    /**
     * @param {setup.Unit} unit
     */
    isOk(unit) {
        return !this.sex.getCoveringEquipment(unit, this.bodypart);
    }
};
