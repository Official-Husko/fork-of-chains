// @ts-nocheck
class SexActionOnOngoing extends setup.SexAction {
    /**
     * @returns {setup.SexBodypart}
     */
    getPenetratorBodypart() { return setup.sexbodypart.penis; }
    /**
     * @returns {setup.SexBodypart}
     */
    getPenetrationTarget() { return setup.sexbodypart.mouth; }
    getTags() {
        return super.getTags().concat([
            this.getPenetratorBodypart().getTag(),
            this.getPenetrationTarget().getTag(),
        ]);
    }
}
export class SexActionOnOngoingDom extends SexActionOnOngoing {
    /**
     * Get additional restrictions with this sex actions
     * @returns {setup.Restriction[]}
     */
    getRestrictions() {
        return [
            setup.qres.SexIsOngoing('a', this.getPenetratorBodypart(), 'b', this.getPenetrationTarget()),
        ];
    }
    /**
     * Arousal multiplied by this
     * @param {string} actor_name
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @returns {number}
     */
    getArousalMultiplier(actor_name, unit, sex) {
        if (actor_name == 'a') {
            return (setup.SexUtil.receiveMultiplier(this.getActorUnit('a'), this.getPenetratorBodypart(), sex) *
                setup.SexUtil.giveMultiplier(this.getActorUnit('b'), this.getPenetrationTarget(), sex));
        }
        else {
            return (setup.SexUtil.giveMultiplier(this.getActorUnit('a'), this.getPenetratorBodypart(), sex) *
                setup.SexUtil.receiveMultiplier(this.getActorUnit('b'), this.getPenetrationTarget(), sex));
        }
    }
}
export class SexActionOnOngoingSub extends SexActionOnOngoing {
    /**
     * Get additional restrictions with this sex actions
     * @returns {setup.Restriction[]}
     */
    getRestrictions() {
        return [
            setup.qres.SexIsOngoing('b', this.getPenetratorBodypart(), 'a', this.getPenetrationTarget()),
        ];
    }
    /**
     * Arousal multiplied by this
     * @param {string} actor_name
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @returns {number}
     */
    getArousalMultiplier(actor_name, unit, sex) {
        if (actor_name == 'a') {
            return (setup.SexUtil.receiveMultiplier(this.getActorUnit('a'), this.getPenetrationTarget(), sex) *
                setup.SexUtil.giveMultiplier(this.getActorUnit('b'), this.getPenetratorBodypart(), sex));
        }
        else {
            return (setup.SexUtil.giveMultiplier(this.getActorUnit('a'), this.getPenetrationTarget(), sex) *
                setup.SexUtil.receiveMultiplier(this.getActorUnit('b'), this.getPenetratorBodypart(), sex));
        }
    }
}
