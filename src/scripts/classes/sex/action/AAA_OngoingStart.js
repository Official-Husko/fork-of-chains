// @ts-nocheck
export class OngoingBase extends setup.SexAction {
    getTags() {
        const base = super.getTags().concat([
            'penetration',
            this.getPenetratorBodypart().getTag(),
            this.getPenetrationTarget().getTag(),
        ]);
        return base;
    }
    /**
     * @returns {setup.SexBodypart}
     */
    getPenetratorBodypart() {
        return setup.sexbodypart.penis;
    }
    /**
     * @returns {setup.SexBodypart}
     */
    getPenetrationTarget() {
        return setup.sexbodypart.mouth;
    }
    /**
     * Whether this is a dominant-initiated sex.
     * @returns {boolean}
     */
    isDominantSex() {
        return !this.getPenetratorBodypart().isSubmissivePenetration(this.getPenetrationTarget());
    }
}
// abstract
setup.SexAction.OngoingStart = class OngoingStart extends OngoingBase {
    getTags() {
        return super.getTags().concat(['penetrationstartdom']);
    }
    /**
     * @returns {ActorDescription[]}
     */
    getActorDescriptions() {
        let paces;
        if (this.isDominantSex()) {
            paces = [setup.sexpace.dom, setup.sexpace.normal];
        }
        else {
            paces = [setup.sexpace.normal, setup.sexpace.sub];
        }
        return [
            {
                energy: setup.Sex.ENERGY_TINY,
                paces: paces,
                restrictions: [],
            },
            {
                energy: setup.Sex.ENERGY_TINY,
                paces: setup.SexPace.getAllPaces(),
                restrictions: [],
            },
        ];
    }
    /**
     * @returns {setup.Restriction[]}
     */
    getRestrictions() {
        return [
            setup.qres.SexBodypartsCanInteract('a', this.getPenetratorBodypart(), 'b', this.getPenetrationTarget()),
        ];
    }
    getOutcomes() {
        return super.getOutcomes().concat([
            setup.qc.SexOngoingStart('a', this.getPenetratorBodypart(), 'b', this.getPenetrationTarget())
        ]);
    }
    /**
     * Returns the title of this action, e.g., "Blowjob"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawTitle(sex) {
        const me = this.getActorUnit('a');
        const them = this.getActorUnit('b');
        const my_bp = this.getPenetratorBodypart().rep(me, sex);
        const their_bp = this.getPenetrationTarget().rep(them, sex);
        return `Put a|their ${my_bp} in b|their ${their_bp}`;
    }
    /**
     * Short description of this action. E.g., "Put your mouth in their dick"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawDescription(sex) {
        return this.rawTitle(sex);
    }
    /**
     * Returns a string telling a story about this action to be given to the player
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawStory(sex) {
        const me = this.getActorUnit('a');
        const them = this.getActorUnit('b');
        return '';
    }
};
