// @ts-nocheck
export class PenisOrgasmBase extends setup.SexAction.OrgasmBase {
    getTags() { return super.getTags().concat(['penis',]); }
    rawTitle(sex) {
        return `Masturbate`;
    }
    rawDescription(sex) {
        return `You've reached your climax, and can't hold back your orgasm any longer. Time to masturbate the cum out.`;
    }
    /**
     * @returns {ActorDescription[]}
     */
    getActorDescriptions() {
        const desc = super.getActorDescriptions();
        // restrict to penis owners
        desc[0].restrictions.push(setup.qres.IsCanPhysicallyCum());
        return desc;
    }
}
