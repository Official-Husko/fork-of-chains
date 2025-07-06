"use strict";
// @ts-nocheck
setup.qresImpl.SexBodypartsCanInteract = class SexBodypartsCanInteract extends setup.SexRestriction {
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
        return `${this.my_actor_name}'s ${this.my_bodypart.repsimple()} can interact with ${this.their_actor_name}'s ${this.their_bodypart.repsimple()}`;
    }
    /**
     * @param {setup.SexAction} action
     */
    isOk(action) {
        const me = action.getActorUnit(this.my_actor_name);
        const them = action.getActorUnit(this.their_actor_name);
        const sex = this.sex;
        const my_position = sex.getPosition(me);
        const their_position = sex.getPosition(them);
        if (!sex.isCanUse(me, this.my_bodypart))
            return false;
        if (!sex.isCanUse(them, this.their_bodypart))
            return false;
        return this.my_bodypart.isCanInteractWith(this.sex.getPosition(me), this.sex.getPose(me).getFacingHeight(this.my_bodypart, my_position, sex), this.their_bodypart, this.sex.getPosition(them), this.sex.getPose(them).getFacingHeight(this.their_bodypart, their_position, sex));
    }
};
