"use strict";
// @ts-nocheck
/**
 * darko original
 */
setup.SexActionClass.NibbleNeck = class NibbleNeck extends setup.SexAction {
    getTags() { return super.getTags().concat(['dom', 'mouth', 'discomfort',]); }
    desc() { return 'Nibble neck'; }
    getPenetratorBodypart() { return setup.sexbodypart.mouth; }
    getPenetrationTarget() { return setup.sexbodypart.mouth; }
    /**
     * @returns {setup.Restriction[]}
     */
    getRestrictions() {
        return [
            setup.qres.HasItem('sexmanual_nibble_neck'),
            setup.qres.SexBodypartsCanReach('a', this.getPenetratorBodypart(), 'b', this.getPenetrationTarget()),
        ];
    }
    getActorDescriptions() {
        return [
            {
                energy: setup.Sex.ENERGY_SMALL,
                arousal: setup.Sex.AROUSAL_SMALLMEDIUM,
                paces: [setup.sexpace.dom, setup.sexpace.normal],
                restrictions: [
                    setup.qres.SexCanUseBodypart(this.getPenetratorBodypart()),
                    setup.qres.AnyTrait([
                        setup.trait.mouth_neko,
                        setup.trait.mouth_werewolf,
                        setup.trait.mouth_dragonkin,
                    ], true)
                ],
            },
            {
                energy: setup.Sex.ENERGY_MEDIUM,
                arousal: setup.Sex.AROUSAL_SMALLMEDIUM,
                discomfort: setup.Sex.DISCOMFORT_LARGE,
                paces: setup.SexPace.getAllPaces(),
            },
        ];
    }
    /**
     * Discomfort multiplied by this
     * @param {string} actor_name
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @returns {number}
     */
    getDiscomfortMultiplier(actor_name, unit, sex) {
        if (actor_name == 'a') {
            return 1.0;
        }
        else {
            // multiply discomfort based on skin type
            return setup.SexUtil.skinDiscomfortMultiplier(this.getActorUnit('b'), sex);
        }
    }
    rawTitle(sex) {
        return `Nibble neck`;
    }
    rawDescription(sex) {
        return `Give in to your animalistic mating urge and chomp down b|reps neck.`;
    }
    /**
     * Returns a string telling a story about this action to be given to the player
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawStory(sex) {
        const me = this.getActorUnit('a');
        const mypace = sex.getPace(me);
        const them = this.getActorUnit('b');
        const theirpace = sex.getPace(them);
        const mypose = sex.getPose(me);
        const theirpose = sex.getPose(them);
        let story = '';
        let is_penetrating = (setup.qres.SexIsOngoing('a', setup.sexbodypart.penis, 'b', setup.sexbodypart.vagina).isOk(this) ||
            setup.qres.SexIsOngoing('a', setup.sexbodypart.penis, 'b', setup.sexbodypart.anus).isOk(this));
        let t;
        if (is_penetrating) {
            const hole = sex.getBodypartPenetrationTarget(them, setup.sexbodypart.penis).bodypart.rep(me, sex);
            t = [
                `With a|their a|dick still deep inside b|reps ${hole}, a|rep `,
                `Sinking a|their a|dick even deeper inside b|reps ${hole}, a|rep `,
                `Still feeling a|their a|dick inside b|reps ${hole}, a|rep `,
                `Breathing in b|reps b|scent, a|rep a|thrust a|their a|dick deeper inside b|reps ${hole} as a|they `,
                `a|Rep a|slide a|their a|dick even deeper into b|reps ${hole} before a|they `,
            ];
        }
        else {
            t = [
                `Breathing in b|reps b|scent, a|rep `,
                `a|Rep `,
                `Acompanied with b|reps warmth, a|rep `,
            ];
            if (me.isCanSee()) {
                t.push(`After gazing into b|rep, a|rep `);
            }
        }
        story += setup.rng.choice(t) + ' ';
        if (mypace == setup.sexpace.dom) {
            t = [
                `a|guide a|their a|mouth closer to b|reps b|neck, before giving in to a|their
         animalistic mating urges and harshly chomp down b|reps flesh.`,
                `a|give in fully into a|their animalistic mating urge and a|bite down b|reps b|neck.`,
                `lustfully a|bite into b|reps b|neck, solidifying b|their status as a|their current playmate.`,
                `possessively a|bite into b|reps b|neck, claiming b|them as a|their mate for the day.`,
            ];
        }
        else {
            t = [
                `a|guide a|their head close to b|reps b|neck, before gently chomping on b|reps flesh
         as urged by a|their animalistic instincts.`,
                `a|give b|reps b|neck a couple of tentative licks before softly biting on its flesh.`,
                `gently a|bite in b|reps b|neck, surrendering to a|their animalistic instincts of marking a|their mate.`,
            ];
        }
        story += setup.rng.choice(t) + ' ';
        const is_thickfur = them.isHasAnyTraitExact([
            setup.trait.body_werewolf,
            setup.trait.body_neko,
            setup.trait.body_dragonkin,
        ]);
        let painful = '';
        let painfully = '';
        let pained = '';
        if (!is_thickfur) {
            painful = 'painful';
            painfully = 'painfully';
            pained = 'pained';
        }
        let to, tp;
        const skin = setup.Text.Unit.Trait.skin(them, /* with eq = */ false, /* with adj = */ true);
        if (is_thickfur) {
            tp = [
                `b|their ${skin} protecting b|their flesh from actually being ruptured.`,
                `the ${skin} covering b|their b|body prevents the bite from drawing any blood.`,
                `b|their ${skin} muffling the pain from the chomp.`,
            ];
        }
        else {
            tp = [
                `trace of blood is drawn as the teeth pierce b|their ${skin} and rupture b|their flesh.`,
                `b|their ${skin} pierced by the invading teeth, drawing traces of blood.`,
                `b|their ${skin} ${painfully} pierced by the show of dominance.`,
            ];
        }
        if (them.isMasochistic()) {
            const base = setup.SexUtil.masochistReaction(me, them, [
                `being painfully chomped down`,
                `having b|their neck painfully bitten`,
                `having a|their teeths tearing down b|their flesh`,
            ], sex);
            to = [
                `${base} Accompanying b|their masochistic bliss, `,
                `${base} All the while, `,
            ];
        }
        else if (theirpace == setup.sexpace.dom) {
            to = [
                `b|Rep b|let out a protesting moan at the ${painful} chomp,`,
                `Trying to wrest control, b|rep b|growl at a|rep for the dominant treatment and
         the ${painful} sensation it delivers via the chomp,`,
            ];
        }
        else if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
            to = [
                `b|Rep b|eagerly b|let out a ${pained} moan from the sensual act, `,
                `Despite the rough treatment, b|rep b|let out a ${pained} but clearly aroused moan, `,
            ];
        }
        else if (theirpace == setup.sexpace.resist) {
            const base = setup.SexUtil.repResist(me, them, sex, [
                `dislodge a|reps teeth from b|them`,
                `push a|reps away from b|them`,
                `struggle uselessly`,
            ], [
                `a|rep a|feels the taste of b|reps flesh in a|their tongue`,
                `a|rep possessively a|assert a|their ownership over b|rep`,
            ]);
            to = [
                `${base} -- All the while `,
                `${base} b|Rep continues to cry and struggle, `,
            ];
        }
        else if (theirpace == setup.sexpace.forced) {
            to = [
                `b|Rep b|grimace ${painfully} at a|their assertion of dominance, `,
                `${is_thickfur ? 'A mixture of fear and pleasure' : 'A mixture of fear and pain'} can be seen in b|reps eyes, `,
            ];
        }
        else {
            const base = setup.SexUtil.mindbrokenReactionNoun(them, sex, [
                `the bite`,
                `the rough chomp`,
                `a|reps dominant bite`,
                `a|reps possessive bite`,
            ]);
            to = [
                `${base} b|They does not respond to the stimulus, `,
                `${base} b|They remains perfectly still, almost like a doll, `,
            ];
        }
        story += setup.rng.choice(to) + ' ';
        story += setup.rng.choice(tp) + ' ';
        return story;
    }
};
