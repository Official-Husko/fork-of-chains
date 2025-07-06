"use strict";
// @ts-nocheck
setup.qresImpl.SexCanTitfuck = class SexCanTitfuck extends setup.SexRestriction {
    /**
     * @param {string} my_actor_name
     * @param {string} their_actor_name
     */
    constructor(my_actor_name, their_actor_name) {
        super();
        this.my_actor_name = my_actor_name;
        this.their_actor_name = their_actor_name;
    }
    /**
     * @returns {setup.Restriction}
     */
    getRestriction() {
        return setup.qres.And([
            setup.qres.Actor('a', setup.qres.Trait(setup.trait.dick_tiny)),
            setup.qres.Actor('b', setup.qres.Or([
                setup.qres.Trait(setup.sexbodypart.breasts.getMinBreastTraitForTitfuck()),
                setup.qres.And([
                    setup.qres.NoTrait(setup.trait.breast_tiny),
                    setup.qres.Trait(setup.sexbodypart.breasts.getMinMuscleTraitForPecjob()),
                ])
            ])),
        ]);
    }
    explain() {
        const breast_size = setup.sexbodypart.breasts.getMinBreastTraitForTitfuck();
        const muscle_size = setup.sexbodypart.breasts.getMinMuscleTraitForPecjob();
        return `${this.my_actor_name} has a dick, while ${this.their_actor_name} either has ${breast_size.rep()} or does not have a breast but has ${muscle_size.rep()}`;
    }
    /**
     * @param {setup.SexAction} action
     */
    isOk(action) {
        const restriction = this.getRestriction();
        return restriction.isOk(action);
    }
};
