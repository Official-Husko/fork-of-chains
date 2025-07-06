"use strict";
// @ts-nocheck
setup.qresImpl.SexArousalAtLeast = class SexArousalAtLeast extends setup.SexRestriction {
    /**
     * @param {number} arousal
     */
    constructor(arousal) {
        super();
        this.arousal = arousal;
    }
    explain() {
        return `Arousal at least ${this.arousal}`;
    }
    isOk(unit) {
        return this.sex.getArousal(unit) >= this.arousal;
    }
};
