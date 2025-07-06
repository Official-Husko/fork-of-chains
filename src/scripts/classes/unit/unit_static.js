"use strict";
// @ts-nocheck
/**
 * Return list of pair of traits where these two units conflict with each other.
 *
 * @param {setup.Unit} unit1
 * @param {setup.Unit} unit2
 * @returns {Array<[setup.Trait, setup.Trait]>}
 */
setup.Unit.getConflictingPerTraits = function (unit1, unit2) {
    const traits = setup.TraitHelper.getAllTraitsOfTags(['per']);
    /**
     * @type {Array<[setup.Trait, setup.Trait]>}
     */
    const result = [];
    for (const trait of traits) {
        const trait_group = trait.getTraitGroup();
        if (trait_group && unit1.isHasTraitExact(trait)) {
            const enemy_trait = unit2.getTraitFromTraitGroup(trait_group);
            if (enemy_trait &&
                (!trait_group.isOrdered() || trait_group._getTraitIndex(trait) * trait_group._getTraitIndex(enemy_trait) < 0)) {
                result.push([trait, enemy_trait]);
            }
        }
    }
    return result;
};
/**
 * Return list of pair of traits where these two units conflict with each other.
 *
 * @param {setup.Unit} unit1
 * @param {setup.Unit} unit2
 * @returns {[setup.Trait, setup.Trait] | null}
 */
setup.Unit.getAnyConflictingPerTraits = function (unit1, unit2) {
    const traits = setup.Unit.getConflictingPerTraits(unit1, unit2);
    if (traits.length) {
        return setup.rng.choice(traits);
    }
    else {
        return null;
    }
};
/**
 * Return list of per traits that bost unit have in common
 *
 * @param {setup.Unit} unit1
 * @param {setup.Unit} unit2
 * @returns {Array<setup.Trait>}
 */
setup.Unit.getSamePerTraits = function (unit1, unit2) {
    return setup.TraitHelper.getAllTraitsOfTags(['per']).filter(trait => unit1.isHasTraitExact(trait) && unit2.isHasTraitExact(trait));
};
/**
 * Return list of pair of traits where these two units conflict with each other.
 *
 * @param {setup.Unit} unit1
 * @param {setup.Unit} unit2
 * @returns {setup.Trait | null}
 */
setup.Unit.getAnySamePerTraits = function (unit1, unit2) {
    const traits = setup.Unit.getSamePerTraits(unit1, unit2);
    if (traits.length) {
        return setup.rng.choice(traits);
    }
    else {
        return null;
    }
};
