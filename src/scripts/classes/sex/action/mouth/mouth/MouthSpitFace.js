"use strict";
// @ts-nocheck
/**
 * From Lilith's Throne's: SadisticActions.SPIT_FACE
 */
setup.SexActionClass.SpitFace = class SpitFace extends setup.SexAction {
    getTags() { return super.getTags().concat(['dom', 'mouth', 'discomfort',]); }
    desc() { return 'Spit in face'; }
    getPenetratorBodypart() { return setup.sexbodypart.mouth; }
    getPenetrationTarget() { return setup.sexbodypart.mouth; }
    /**
     * @returns {setup.Restriction[]}
     */
    getRestrictions() {
        return [
            setup.qres.HasItem('sexmanual_spit_face'),
            setup.qres.SexBodypartsCanReach('a', this.getPenetratorBodypart(), 'b', this.getPenetrationTarget()),
        ];
    }
    getActorDescriptions() {
        return [
            {
                energy: setup.Sex.ENERGY_SMALLMEDIUM,
                arousal: setup.Sex.AROUSAL_SMALLMEDIUM,
                paces: [setup.sexpace.dom, setup.sexpace.normal],
                restrictions: [
                    setup.qres.SexCanUseBodypart(this.getPenetratorBodypart()),
                ],
            },
            {
                energy: setup.Sex.ENERGY_SMALL,
                discomfort: setup.Sex.DISCOMFORT_MEDIUM,
                paces: setup.SexPace.getAllPaces(),
            },
        ];
    }
    rawTitle(sex) {
        return `Spit in face`;
    }
    rawDescription(sex) {
        return `Spit in b|reps face show b|them that b|they a|is worthless.`;
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
        let t = [
            `Wanting to show b|rep that b|they a|is a worthless bitch, a|rep a|lean in towards b|them, before spitting on b|their face.`,
            `Leaning in towards b|rep, a|rep a|purse a|their lips, before spitting directly on b|their face.`,
            `Seeking to remind b|rep of how worthless b|they b|is, a|rep a|lean in towards b|them, before pursing a|their lips and spitting directly on b|their face.`,
        ];
        story += setup.rng.choice(t) + ' ';
        if (them.isMasochistic()) {
            t = [
                `A clearly aroused moan escapes from b|reps b|mouth as the ball of saliva splatters onto b|their cheek, letting a|rep know that b|they a|is deriving masochistic pleasure from being abused in such a fashion.`,
                `The horny squeal that escapes b|reps mouth is enough to let anyone realise that b|they a|is getting turned on from being treated in such a degrading manner.`,
                `Instead of a disgusted cry, b|rep b|let out a horny moan, letting a|rep know that b|they a|is a masochist who's getting turned on by being abused like this.`,
            ];
        }
        else if (theirpace == setup.sexpace.dom || theirpace == setup.sexpace.normal) {
            t = [
                `A cry of discomfort escapes from b|reps b|mouth as the ball of saliva splatters onto b|their
        cheek
        ${me.isYou()
                    ? ` which is precisely the reaction you were looking for.`
                    : ` and from the wicked grin that settles on a|reps face, this was just the reaction a|they a|was looking for.`}`,
                `The protestations which b|rep immediately b|make is exactly what a|rep a|was looking for, and a|they can't help but grin as a|they a|see the discomfort well up in
        ${them.isYou()
                    ? `your eyes.`
                    : `a|their bitch's b|eyes.`}`,
                `After letting out a shocked cry, b|rep b|glare back in return, letting a|rep know that a|their abuse is having the exact effect a|they a|was looking for.`,
            ];
        }
        else if (theirpace == setup.sexpace.sub) {
            t = [
                `A submissive moan escapes from b|reps b|mouth as the ball of saliva splatters onto b|their cheek, some drooling inside b|their mouth, letting a|rep know that b|they a|is deriving pleasure from being put in b|their place.`,
                `The horny squeal that escapes b|reps mouth is enough to let anyone realise that the submissive bitch a|is getting turned on from being put in place in such a degrading manner.`,
                `Instead of a disgusted cry, b|rep b|let out a horny moan, trying to lick the saliva in b|their face while letting a|rep know that b|they a|is getting turned on by being put in place like this.`,
            ];
        }
        else if (theirpace == setup.sexpace.resist || theirpace == setup.sexpace.forced) {
            t = [
                ` A disgusted cry escapes from b|reps b|mouth as the ball of saliva splatters onto b|their
        cheek
        ${me.isYou()
                    ? ` which is precisely the reaction you were looking for.`
                    : ` and from the wicked grin that settles on a|reps face, this was just the reaction a|they a|was looking for.`}`,
                `The horrified protestations which b|rep immediately b|make is exactly what a|rep a|was looking for, and a|they can't help but grin as a|they a|see tears well up in
        ${them.isYou()
                    ? `your eyes.`
                    : `a|their submissive bitch's b|eyes.`}`,
                `After letting out a shocked cry, tears start to well up in b|reps b|eyes, letting a|rep know that a|their abuse is having the exact effect a|they a|was looking for.`,
            ];
        }
        else {
            // mindbroken
            t.push(setup.SexUtil.mindbrokenReactionNoun(them, sex, [
                `the ball of saliva splattering onto b|their cheek`,
                `the abusive act`,
                `the wet and slimy saliva on b|their face`,
            ]));
        }
        story += setup.rng.choice(t) + ' ';
        return story;
    }
};
