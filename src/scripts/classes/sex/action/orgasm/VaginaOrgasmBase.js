// @ts-nocheck
export class VaginaOrgasmBase extends setup.SexAction.OrgasmBase {
    getTags() { return super.getTags().concat(['vagina',]); }
    /**
     * @returns {ActorDescription[]}
     */
    getActorDescriptions() {
        const desc = super.getActorDescriptions();
        // restrict to vagina owners
        desc[0].restrictions.push(setup.qres.Trait('vagina_tight'));
        return desc;
    }
}
