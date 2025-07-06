"use strict";
// @ts-nocheck
setup.SexBodypartClass.Mouth = class Mouth extends setup.SexBodypart {
    constructor() {
        super('mouth', [ /* tags */], 'Mouth', 'Mouth');
    }
    /**
     * @param {setup.Unit} unit
     */
    repSimple(unit) {
        let t;
        if (unit.isHasTrait(setup.trait.mouth_werewolf)) {
            t = ['muzzle', 'maw',];
        }
        else if (unit.isHasTrait(setup.trait.mouth_dragonkin)) {
            t = ['snout', 'maw',];
        }
        else {
            t = [`mouth`,];
        }
        return setup.rng.choice(t);
    }
    getTraitSizeModifierMap() {
        return {
            training_oral_basic: setup.Sex.BODYPART_SIZE_TRAINING_BASIC,
            training_oral_advanced: setup.Sex.BODYPART_SIZE_TRAINING_ADVANCED,
            training_oral_master: setup.Sex.BODYPART_SIZE_TRAINING_MASTER,
            default: 0,
        };
    }
    repVaginal(unit, sex) {
        return 'oral';
    }
    getTraitSizeMap() {
        return {
            default: 4,
        };
    }
    repFuck(unit, sex) {
        return `eat`;
    }
    isSubmissivePenetration(bodypart) {
        return true;
    }
    getEquipmentSlots() {
        return [
            setup.equipmentslot.mouth,
        ];
    }
    giveArousalMultiplier(me, sex) {
        return setup.SexUtil.calculateTraitMultiplier(me, {
            training_none: -setup.Sex.TRAIT_MULTI_MEDIUM,
            training_oral_basic: setup.Sex.TRAIT_MULTI_LOW,
            training_oral_advanced: setup.Sex.TRAIT_MULTI_MEDIUM,
            training_oral_master: setup.Sex.TRAIT_MULTI_HIGH,
            per_submissive: setup.Sex.TRAIT_MULTI_LOW,
            per_dominant: -setup.Sex.TRAIT_MULTI_LOW,
            per_lustful: setup.Sex.TRAIT_MULTI_LOW,
            per_sexaddict: setup.Sex.TRAIT_MULTI_LOW,
            per_chaste: -setup.Sex.TRAIT_MULTI_LOW,
            mouth_demon: setup.Sex.TRAIT_MULTI_MEDIUM,
            training_mindbreak: -setup.Sex.TRAIT_MULTI_HIGH,
        });
    }
    receiveArousalMultiplier(me, sex) {
        return setup.SexUtil.calculateTraitMultiplier(me, {
            training_none: -setup.Sex.TRAIT_MULTI_MEDIUM,
            training_oral_advanced: setup.Sex.TRAIT_MULTI_LOW,
            training_oral_master: setup.Sex.TRAIT_MULTI_MEDIUM,
            per_sexaddict: setup.Sex.TRAIT_MULTI_LOW,
            per_chaste: -setup.Sex.TRAIT_MULTI_LOW,
        });
    }
    /**
     * Can this bodypart penetrate another? Filled manually for efficiency
     * @param {setup.SexBodypart} bodypart
     * @returns {boolean}
     */
    isCanPenetrate(bodypart) {
        return [setup.sexbodypart.anus, setup.sexbodypart.vagina].includes(bodypart);
    }
    /**
     * Describe unit bodypart teasing to penetrate another.
     * @param {setup.Unit} unit
     * @param {setup.Unit} target
     * @param {setup.SexBodypart} target_bodypart
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawDescribeTease(unit, target, target_bodypart, sex) {
        if (![setup.sexbodypart.anus, setup.sexbodypart.vagina].includes(target_bodypart)) {
            return ``;
        }
        const hole = target_bodypart.rep(target, sex);
        return [
            `a|Rep can already taste b|reps ${hole} located right in front of a|their lips.`,
            `a|Reps a|tongue can probably reach b|reps ${hole} from this position.`,
            `With a|breps ${hole} situated right next to a|reps a|mouth, there could only be one possible way the action could go.`,
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
            `a|Rep a|withdraw a|their a|tongue from b|reps ${desc}, and left with nothing but its taste.`,
            `a|Rep a|stop eating out b|reps ${desc} for the time being.`,
            `a|Rep a|retract their b|tongue back to inside b|their b|mouth.`,
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
        const hole = target_bodypart.rep(target, sex);
        if (target_bodypart == setup.sexbodypart.anus || target_bodypart == setup.sexbodypart.vagina) {
            return [
                `busy eating out b|reps ${hole}`,
                `working its way in b|reps ${hole}`,
                `exploring b|reps ${hole}`,
            ];
        }
        return '';
    }
};
setup.sexbodypart.mouth = new setup.SexBodypartClass.Mouth();
