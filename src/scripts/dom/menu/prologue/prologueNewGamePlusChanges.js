"use strict";
// @ts-nocheck
/**
 * @param {setup.Trait} [trait]
 */
function traitCallback(trait) {
    return () => {
        if (trait) {
            const player = State.variables.unit.player;
            const trait_group = trait.getTraitGroup();
            let current = null;
            if (trait_group && !trait_group.isOrdered()) {
                current = player.getTraitFromTraitGroup(trait_group);
            }
            if (current) {
                player.removeTraitExact(current);
            }
            else {
                player.addTrait(trait);
            }
        }
        setup.runSugarCubeCommand(`<<goto PrologueCompanyGenIntro>>`);
    };
}
/**
 * Turn a unit into the player character.
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.prologueNewGamePlusPCChange = function () {
    /**
     * @type {Array<[setup.Trait | null, string, string]>}
     */
    const choices = [];
    const found = {};
    const player = State.variables.unit.player;
    const basic_tags = ['per', 'muscle', 'tough', 'face', 'height',];
    const traits_basic = basic_tags.map(tag => setup.TraitHelper.getAllTraitsOfTags([tag]));
    for (const trait of [].concat.apply([], traits_basic)) {
        if (player.isHasTrait(trait)) {
            continue;
        }
        const trait_group = trait.getTraitGroup();
        if (trait_group &&
            trait_group.isOrdered() &&
            trait_group.getSmallestTrait() != trait &&
            trait_group.getLargestTrait() != trait) {
            continue;
        }
        let current = null;
        if (trait_group) {
            current = player.getTraitFromTraitGroup(trait_group);
        }
        let hobby;
        if (trait.getTags().includes('face')) {
            if (trait == setup.trait.face_beautiful) {
                hobby = `consulting a famous flesh-shaper to make your face looks easier on the eyes`;
            }
            else {
                hobby = `getting scarred intentionally in a bid to make you look terrifying`;
            }
        }
        else if (trait.getTags().includes('height')) {
            if (trait == setup.trait.height_giant) {
                hobby = `gulping down questionable potions in the hope of getting taller`;
            }
            else {
                hobby = `munching down strange-colored mushrooms in the hope of getting shorter`;
            }
        }
        else {
            hobby = setup.Text.Hobby.verb(player, trait);
        }
        let effect = `gain ${trait.rep()}`;
        if (trait_group && trait_group.isOrdered()) {
            const result = trait_group.computeResultingTrait(player, trait);
            if (!result) {
                effect = `lose ${current.rep()}`;
            }
            else {
                effect = `gain ${result.rep()}`;
            }
        }
        else if (trait_group && !trait_group.isOrdered() && current) {
            effect = `lose ${current.rep()}`;
        }
        choices.push([trait, effect, hobby]);
    }
    choices.push([
        null,
        "no changes",
        "doing absolutely nothing as you're already perfect",
    ]);
    const fragments = choices.map(choice => html `
    <div>
      ${setup.DOM.Nav.link(choice[2], traitCallback(choice[0]))}
      (${choice[1]})
    </div>
  `);
    return setup.DOM.create('div', {}, fragments);
};
