"use strict";
// @ts-nocheck
setup.qresImpl.SexIsBeingPenetrated = class SexIsBeingPenetrated extends setup.SexRestriction {
    /**
     * @param {setup.SexBodypart} [my_bodypart]
     */
    constructor(my_bodypart) {
        super();
        this.my_bodypart = my_bodypart;
    }
    explain() {
        if (this.my_bodypart) {
            return `${this.my_bodypart.repsimple()} is being penetrated`;
        }
        else {
            return `Is being penetrated`;
        }
    }
    /**
     * @param {setup.Unit} unit
     */
    isOk(unit) {
        if (this.my_bodypart) {
            return !!this.sex.getBodypartPenetrator(unit, this.my_bodypart);
        }
        else {
            return this.sex.isBeingPenetrated(unit);
        }
    }
};
