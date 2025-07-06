"use strict";
// @ts-nocheck
setup.qresImpl.SexIsOngoing = class SexIsOngoing extends setup.SexRestriction {
    /**
     * @param {string} my_actor_name
     * @param {setup.SexBodypart} my_bodypart
     * @param {string} their_actor_name
     * @param {setup.SexBodypart} their_bodypart
     */
    constructor(my_actor_name, my_bodypart, their_actor_name, their_bodypart) {
        super();
        this.my_actor_name = my_actor_name;
        this.my_bodypart = my_bodypart;
        this.their_actor_name = their_actor_name;
        this.their_bodypart = their_bodypart;
    }
    explain() {
        return `${this.my_actor_name}'s ${this.my_bodypart.repsimple()} is penetrating ${this.their_actor_name}'s ${this.their_bodypart.repsimple()}`;
    }
    /**
     * @param {setup.SexAction} action
     */
    isOk(action) {
        const me = action.getActorUnit(this.my_actor_name);
        const them = action.getActorUnit(this.their_actor_name);
        const target = this.sex.getBodypartPenetrationTarget(me, this.my_bodypart);
        return target && target.unit == them && target.bodypart == this.their_bodypart;
    }
};
