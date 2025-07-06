"use strict";
// @ts-nocheck
setup.qresImpl.SexPositionCanChangeTo = class SexPositionCanChangeTo extends setup.SexRestriction {
    /**
     * @param {setup.SexPosition} position
     */
    constructor(position) {
        super();
        this.position = position;
    }
    explain() {
        return `Can move to ${this.position.rep()}`;
    }
    isOk(unit) {
        return this.sex.getPosition(unit) != this.position && this.position.isAllowed(unit, this.sex);
    }
};
