"use strict";
// @ts-nocheck
setup.qcImpl.SexEnd = class SexEnd extends setup.SexCost {
    constructor() {
        super();
    }
    /**
     * @param {setup.SexAction} action
     */
    apply(action) {
        this.sex.endSex();
    }
    explain() {
        return `Ends sex`;
    }
};
