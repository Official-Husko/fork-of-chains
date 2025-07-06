"use strict";
// @ts-nocheck
setup.SexBodypartClass.Tail = class Tail extends setup.SexBodypart {
    constructor() {
        super('tail', [ /* tags */], 'Tail', 'Tail');
    }
    repSimple(unit) {
        return setup.rng.choice(['tail',]);
    }
    getTraitSizeMap() {
        return {
            tail_werewolf: 4,
            tail_neko: 3,
            tail_dragonkin: 6,
            tail_demon: 4,
        };
    }
    /**
     * @param {number} size
     * @returns {string}
     */
    static tailSizeAdjective(size) {
        let t;
        if (size >= 6) {
            t = [`huge`,];
        }
        else if (size >= 4) {
            t = [`large`,];
        }
        else {
            t = [``,];
        }
        return setup.rng.choice(t);
    }
    repSizeAdjective(unit, sex) {
        return setup.SexBodypartClass.Tail.tailSizeAdjective(this.getSize(unit, sex));
    }
    heightTolerance() { return 1; }
    giveArousalMultiplier(me, sex) {
        let base = setup.SexUtil.calculateTraitMultiplier(me, {
            per_curious: setup.Sex.TRAIT_MULTI_LOW,
            per_stubborn: -setup.Sex.TRAIT_MULTI_LOW,
            per_playful: setup.Sex.TRAIT_MULTI_LOW,
            per_serious: -setup.Sex.TRAIT_MULTI_LOW,
            per_dominant: setup.Sex.TRAIT_MULTI_LOW,
            per_submissive: -setup.Sex.TRAIT_MULTI_LOW,
            training_mindbreak: -setup.Sex.TRAIT_MULTI_MEDIUM,
        });
        return base;
    }
    receiveArousalMultiplier(me, sex) {
        return this.giveArousalMultiplier(me, sex);
    }
    /**
     * @returns {setup.Restriction[]}
     */
    getHasRestrictions() {
        return [
            setup.qres.AnyTrait(setup.TraitHelper.getAllTraitsOfTags(['tail']), true),
        ];
    }
    /**
     * Whether this bodypart is flexible towards facing
     * @returns {boolean}
     */
    isFlexible() { return true; }
    /**
     * Whether this bodypart is completely directionless and disregard facing altogether
     */
    isDirectionless() { return true; }
    isCanPenetrate(bodypart) {
        return [setup.sexbodypart.anus, setup.sexbodypart.vagina].includes(bodypart);
    }
    repTip(unit, sex) {
        if (unit.isHasTrait('tail_werewolf')) {
            return `fluffy tip`;
        }
        else if (unit.isHasTrait('tail_neko')) {
            return `tip`;
        }
        else if (unit.isHasTrait('tail_dragonkin')) {
            return `scaly tip`;
        }
        else if (unit.isHasTrait('tail_demon')) {
            return `sharp tip`;
        }
    }
    repFuck(unit, sex) {
        return `tail-fuck`;
    }
    /**
     * @param {setup.Unit} unit
     * @param {setup.Unit} target
     * @param {setup.SexBodypart} target_bodypart
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawDescribeEnd(unit, target, target_bodypart, sex) {
        // supports anus, vagina
        const desc = target_bodypart.rep(target, sex);
        return [
            `a|Rep a|withdraw a|their a|tail from b|reps ${desc}, leaving a gaping hole.`,
            `b|Reps desc contracts as a|rep a|withdraw a|their a|tail from the ${desc}`,
            `Slowly, a|rep a|retract a|their a|tail from deep within b|their ${desc}.`,
        ];
    }
    /**
     * Gives a verb for this bodypart penetrating another. E.g., "penetrating b|anus"
     * @param {setup.Unit} unit
     * @param {setup.Unit} target
     * @param {setup.SexBodypart} target_bodypart
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawVerbPenetrate(unit, target, target_bodypart, sex) {
        const pace = sex.getPace(unit);
        const desc = target_bodypart.rep(target, sex);
        if (pace == setup.sexpace.dom) {
            let mult = ``;
            if (unit.isHasTrait('tail_werewolf')) {
                mult = `, all the fluffs included,`;
            }
            else if (unit.isHasTrait('tail_neko')) {
                // no special text for cats
            }
            else if (unit.isHasTrait('tail_dragonkin')) {
                mult = `, including some of the painful-looking ridges,`;
            }
            else if (unit.isHasTrait('tail_demon')) {
                mult = `, including the pointy edge,`;
            }
            return [
                `lodged deep${mult} inside of b|reps ${desc}`,
                `stuck deep${mult} inside of b|reps ${desc}`,
                `being shoved deep${mult} inside of b|reps ${desc}`,
            ];
        }
        else {
            return [
                `lodged inside b|reps`,
                `penetrating b|reps ${desc}`,
                `stuck inside b|reps`,
            ];
        }
    }
    /**
     * Gives a sentence describing extra flavor text when this bodypart penetrating another.
     * @param {setup.Unit} unit
     * @param {setup.Unit} target
     * @param {setup.SexBodypart} target_bodypart
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawPenetrateFlavorSentence(unit, target, target_bodypart, sex) {
        const accom = this.getAccomodatingValue(unit, target, target_bodypart);
        const hole = target_bodypart.rep(target, sex);
        let t = [];
        let adj = '';
        if (accom >= 2) {
            adj = setup.rng.choice([`roughly`, `violently`, `harshly`, `painfully`, `cruelly`, `mercilessly`]);
        }
        else if (accom == 0) {
            adj = setup.rng.choice([`harmlessly`, `barely`, `slightly`, `softly`]);
        }
        if (unit.isHasTrait('tail_dragonkin')) {
            t = [
                `All the while the sharp ridges on a|reps a|tail greatly amplify the stimulation as they ${adj}
         bump the inner walls.`,
                `The sharp ridges lining a|reps a|tail enhance the stimulation by ${adj} bumping into b|reps soft inner walls.`,
                `The sharp ridges lining a|reps a|tail add another layer of complexity to the stimulation each
         time they hit, bump, and ${adj} graze the inner muscles in b|reps ${hole}.`,
            ];
        }
        else if (unit.isHasTrait('tail_demon')) {
            t = [
                `All the while the sharp tip of a|reps a|tail amplify the stimulation as it ${adj} grazes the soft inner walls of b|rep, which was never designed to ever be filled with such an appendage.`,
                `The sharp tip at the end of a|reps a|tail add to the stimulation by ${adj} grazing b|reps inner walls, amplifying the pain and pleasure.`,
                `The sensitive sharp tip at the end of a|reps a|tail gives an extra source of pleasure as it
         ${adj} hit and bump b|reps sensitive inner walls.`,
            ];
        }
        else if (unit.isHasTrait('tail_werewolf')) {
            t = [
                `The fluffy tail ${adj} tickles the inner walls of b|rep.`,
                `b|Rep b|let out b|a_moan as b|they feel b|their ${hole} stimulated by a|reps fluffy tail, which ${adj} tickles its innner walls.`,
                `a|Rep can feel their a|tail as it ${adj} penetrate and tickles the inner walls of b|rep.`,
            ];
        }
        else if (unit.isHasTrait('tail_neko')) {
            // TODO: ??? what do neko tail do
            t = [];
        }
        if (t.length) {
            return setup.rng.choice(t);
        }
        else {
            return '';
        }
    }
};
setup.sexbodypart.tail = new setup.SexBodypartClass.Tail();
