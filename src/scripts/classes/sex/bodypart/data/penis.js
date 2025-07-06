"use strict";
// @ts-nocheck
setup.SexBodypartClass.Penis = class Penis extends setup.SexBodypart {
    constructor() {
        super('penis', [ /* tags */], 'Dick', 'Dick');
    }
    /**
     * @param {setup.Unit} unit
     */
    repSimple(unit) {
        if (unit.isHasStrapOn()) {
            return setup.rng.choice(['strap-on', 'fake dick', 'fake cock',]);
        }
        return setup.rng.choice(['dick', 'cock', 'shaft', 'prick']);
    }
    getTraitSizeMap() {
        return {
            dick_tiny: 1,
            dick_small: 2,
            dick_medium: 3,
            dick_large: 4,
            dick_huge: 5,
            dick_titanic: 6,
            // strap-on
            default: 3,
        };
    }
    /**
     * @param {number} size
     * @returns {string}
     */
    static penisSizeAdjective(size) {
        if (size >= 6) {
            return setup.trait.dick_titanic.repSizeAdjective();
        }
        else if (size >= 5) {
            return setup.trait.dick_huge.repSizeAdjective();
        }
        else if (size >= 4) {
            return setup.trait.dick_large.repSizeAdjective();
        }
        else if (size >= 3) {
            return setup.trait.dick_medium.repSizeAdjective();
        }
        else if (size >= 2) {
            return setup.trait.dick_small.repSizeAdjective();
        }
        else if (size >= 1) {
            return setup.trait.dick_tiny.repSizeAdjective();
        }
        else {
            return setup.rng.choice([``,]);
        }
    }
    repSizeAdjective(unit, sex) {
        return setup.SexBodypartClass.Penis.penisSizeAdjective(this.getSize(unit, sex));
    }
    getEquipmentSlots() {
        return [
            setup.equipmentslot.legs,
            setup.equipmentslot.rear,
            setup.equipmentslot.genital,
        ];
    }
    repTip(unit, sex) {
        return `head`;
    }
    /**
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @returns
     */
    repFuck(unit, sex) {
        const other = sex.getBodypartPenetrationTarget(unit, this);
        if (other) {
            if (other.bodypart == setup.sexbodypart.mouth) {
                return `facefuck`;
            }
            else if (other.bodypart == setup.sexbodypart.breasts) {
                if (other.unit.isHasBreasts()) {
                    return `titfuck`;
                }
                else {
                    return `pecfuck`;
                }
            }
            else if (other.bodypart == setup.sexbodypart.anus) {
                return setup.rng.choice(['fuck', 'buttfuck', 'assfuck']);
            }
        }
        return `fuck`;
    }
    giveArousalMultiplier(me, sex) {
        let base = setup.SexUtil.calculateTraitMultiplier(me, {
            training_horny_basic: setup.Sex.TRAIT_MULTI_LOW,
            training_horny_advanced: setup.Sex.TRAIT_MULTI_MEDIUM,
            training_horny_master: setup.Sex.TRAIT_MULTI_HIGH,
            per_submissive: -setup.Sex.TRAIT_MULTI_LOW,
            per_dominant: setup.Sex.TRAIT_MULTI_LOW,
            dick_werewolf: setup.Sex.TRAIT_MULTI_LOW,
            training_mindbreak: -setup.Sex.TRAIT_MULTI_LOW,
        });
        if (me.isHasStrapOn()) {
            base *= setup.Sex.STRAPON_GIVE_PLEASURE_MULTI;
        }
        return base;
    }
    receiveArousalMultiplier(me, sex) {
        let base = setup.SexUtil.calculateTraitMultiplier(me, {
            training_horny_basic: setup.Sex.TRAIT_MULTI_LOW,
            training_horny_advanced: setup.Sex.TRAIT_MULTI_MEDIUM,
            training_horny_master: setup.Sex.TRAIT_MULTI_HIGH,
            per_submissive: -setup.Sex.TRAIT_MULTI_LOW,
            per_dominant: setup.Sex.TRAIT_MULTI_LOW,
            dick_werewolf: setup.Sex.TRAIT_MULTI_LOW,
        });
        if (me.isHasStrapOn()) {
            base *= setup.Sex.STRAPON_GIVE_PLEASURE_MULTI;
        }
        return base;
    }
    isCanPenetrate(bodypart) {
        return [setup.sexbodypart.mouth, setup.sexbodypart.anus, setup.sexbodypart.vagina].includes(bodypart);
    }
    /**
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     */
    isHasBodypart(unit, sex) { return unit.isHasDicklike(); }
    /**
     * Describe unit bodypart teasing to penetrate another.
     * @param {setup.Unit} unit
     * @param {setup.Unit} target
     * @param {setup.SexBodypart} target_bodypart
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawDescribeTease(unit, target, target_bodypart, sex) {
        if (![setup.sexbodypart.anus, setup.sexbodypart.vagina, setup.sexbodypart.mouth].includes(target_bodypart)) {
            return ``;
        }
        const hole = target_bodypart.rep(target, sex);
        return [
            `a|Reps a|cdick is now conveniently located next to b|reps ${hole}, ready for action.`,
            `a|Reps a|cdick is now just inches away from b|reps ${hole}.`,
            `All it takes is a push to insert a|reps a|cdick into b|reps ${hole}.`,
        ];
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
            `a|Rep a|withdraw a|their a|dick from b|reps ${desc}, leaving only its aftertaste.`,
            `b|Reps ${desc} is freed from a|their a|dick.`,
            `a|Rep unlodged a|their a|dick from within b|their ${desc}.`,
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
        if (target_bodypart == setup.sexbodypart.mouth) {
            if (pace == setup.sexpace.dom) {
                return [
                    `lodged deep within b|reps throat`,
                    `stuck deep inside b|reps b|mouth`,
                    `being stuck inside b|reps b|mouth`,
                ];
            }
            else {
                return [
                    `lodged within b|reps throat`,
                    `penetrating b|reps b|mouth`,
                    `stuck inside b|reps b|mouth`,
                ];
            }
        }
        else {
            const desc = target_bodypart.rep(target, sex);
            if (pace == setup.sexpace.dom) {
                let mult = ``;
                if (unit.isHasTrait('dick_werewolf')) {
                    mult = `, knot included,`;
                }
                else if (unit.isHasTrait('dick_dragonkin')) {
                    mult = `, with all the ridges delicious touching the inner walls,`;
                }
                else if (unit.isHasTrait('dick_demon')) {
                    mult = `, with all the barbs tickling the inner walls,`;
                }
                return [
                    `lodged all the way inside${mult} of b|reps ${desc}`,
                    `stuck all the way inside${mult} of b|reps ${desc}`,
                    `being shoved deep inside${mult} of b|reps ${desc}`,
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
        if (unit.isHasTrait('dick_dragonkin')) {
            t = [
                `All the while the ridges on a|reps a|dick amplify the stimulation as they ${adj} bump the inner walls.`,
                `The ridges lining a|reps a|dick add to the stimulation by ${adj} bumping into b|reps inner walls.`,
                `The ridges lining a|reps a|dick add another layer to the stimulation each time they hit and ${adj} graze the inner muscles in b|reps ${hole}.`,
            ];
        }
        else if (unit.isHasTrait('dick_demon')) {
            t = [
                `All the while the little sensitive barbs on a|reps a|dick amplify the stimulation as they ${adj} graze the inner walls.`,
                `The barbs lining a|reps a|dick add to the stimulation by ${adj} grazing b|reps inner walls.`,
                `The small sensitive barbs on a|reps a|dick pleasures a|rep as they ${adj} graze b|reps sensitive inner walls.`,
            ];
        }
        else if (unit.isHasTrait('dick_werewolf')) {
            t = [
                `a|Rep can a|feel a|their knot growing at the stimulation when the a|dick hits the inner walls.`,
                `a|Reps knotted a|dick threatens to grow to full size with every penetration.`,
                `a|Rep can a|feel blood pumping into a|their a|dick which will no doubt grow a|their knot to full size soon.`,
            ];
        }
        if (t.length) {
            return setup.rng.choice(t);
        }
        else {
            return '';
        }
    }
};
setup.sexbodypart.penis = new setup.SexBodypartClass.Penis();
