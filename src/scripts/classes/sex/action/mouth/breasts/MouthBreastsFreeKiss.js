// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
TongueBreasts.KISS_BREAST

and also from FCdev's "Kiss" interaction
*/
import { MouthBreastsFreeBaseDom } from "./MouthBreastsFreeBase";
setup.SexActionClass.MouthBreastsFreeKiss = class MouthBreastsFreeKiss extends MouthBreastsFreeBaseDom {
    getTags() { return super.getTags().concat(['normal']); }
    desc() { return 'Kiss chest'; }
    getActorDescriptions() {
        return [
            {
                energy: setup.Sex.ENERGY_MEDIUMLARGE,
                arousal: setup.Sex.AROUSAL_SMALL,
                paces: [setup.sexpace.dom, setup.sexpace.normal, setup.sexpace.sub],
            },
            {
                energy: setup.Sex.ENERGY_SMALL,
                arousal: setup.Sex.AROUSAL_SMALLMEDIUM,
                paces: setup.SexPace.getAllPaces(),
            },
        ];
    }
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_breasts_kiss'),
        ]);
    }
    rawTitle(sex) {
        return `Kiss b|breasts`;
    }
    rawDescription(sex) {
        return `Plant a series of kisses on b|reps exposed b|breasts.`;
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
        let story = '';
        let t;
        if (mypace == setup.sexpace.dom) {
            t = [
                `a|Rep greedily a|lean in to b|reps chest, roughly pressing a|their lips against b|their
        b|skin before starting to plant a series of forceful kisses on b|their b|breasts.`,
                `Greedily pressing a|their lips against b|reps chest, a|rep a|start delivering a series of rough kisses to b|their exposed b|breasts.`,
                `a|Rep a|start roughly kissing b|reps exposed b|breasts, breathing in b|their b|scent as a|they forcefully a|press a|their lips against b|their b|skin.`,
            ];
        }
        else {
            t = [
                `a|Rep a|eagerly a|lean in to b|reps chest, pressing a|their lips against b|their b|skin before starting to plant a series of kisses on b|their b|breasts.`,
                `a|Eagerly pressing a|their lips against b|reps chest, a|rep a|start delivering a series of loving kisses to b|their exposed b|breasts.`,
                `a|Rep a|start a|eagerly kissing b|reps exposed b|breasts, breathing in b|their b|scent as a|they a|press a|their lips against b|their b|skin.`,
            ];
        }
        story += setup.rng.choice(t) + ' ';
        t = [];
        if (them.isHasTrait('breast_titanic')) {
            t = [
                `b|Reps breasts is so gigantic that a|rep is practically resting a|their entire a|face inside the pillowy surface.`,
                `The gigantic breasts comfortably supports a|rep who is resting a|their a|head on top of the pillowy thing.`,
            ];
        }
        else if (them.isHasTrait('breast_huge')) {
            t = [
                `The huge breasts bounce and jiggles as a|rep kisses it, giving a comfortable sensation for a|rep.`,
                `a|Reps huge breasts sway and move with every kiss.`,
            ];
        }
        else if (!them.isHasTrait('breast_tiny') && them.isHasTrait('muscle_strong')) {
            t = [
                `The rock-solid chest feel nice touching a|reps lips.`,
                `The well-defined pecs becomes wet with a|reps saliva, accentuating its muscular shape.`,
            ];
        }
        if (t.length) {
            story += setup.rng.choice(t) + ' ';
        }
        if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
            t = [
                ` b|Rep b|let out b|a_moan in response, and b|eagerly b|pull a|reps a|face into b|their chest as b|they b|cry out for a|them to continue.`,
                ` b|A_moan drifts out from between b|reps lips as b|they b|push out b|their chest in response.`,
                ` b|Eagerly pushing b|their chest out into a|reps a|face, b|rep b|let out a soft moan as b|they b|plead for a|them to continue.`,
            ];
        }
        else if (theirpace == setup.sexpace.dom) {
            t = [
                ` b|Rep b|let out b|a_moan in response, and roughly b|yank a|reps a|face deep into b|their chest as b|they b|order a|them to continue.`,
                ` a|A_moan drifts out from between b|reps lips as b|they roughly b|push out b|their chest in response, while commanding a|rep to not stop.`,
                ` Forcefully pushing b|their chest out into a|reps a|face, b|rep b|let out b|a_moan as b|they b|order a|them to continue.`,
            ];
        }
        else if (theirpace == setup.sexpace.resist) {
            t = [
                setup.SexUtil.repResist(them, me, sex, [
                    `pull b|their b|breasts away from a|reps a|face`,
                    `pull b|their b|breasts away from a|their unwelcome lips`,
                    `pull b|their b|breasts away`,
                ], [
                    `b|they b|force b|their b|lips into a|their a|breasts`,
                    `b|rep b|carry on forcing b|their b|lips into a|their a|breasts`,
                ])
            ];
        }
        else if (theirpace == setup.sexpace.forced) {
            const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex);
            t = [
                ` b|Rep b|let out b|a_moan in response, and ${h} pull a|reps a|face into b|their chest, hoping this is what b|their owner wanted.`,
                ` a|A_moan drifts out involuntarily from between b|reps lips as b|they b|feel the unwanted tongue upon b|their b|breasts.`,
            ];
        }
        else {
            t = [
                setup.SexUtil.mindbrokenReactionDespite(them, sex, [
                    `Despite the conquest of b|their b|breasts`,
                    `Even with the pleasurable sensation of having b|their b|breasts kissed`,
                    `Despite b|their b|breasts being lovingly showered with kisses`,
                ])
            ];
        }
        story += setup.rng.choice(t) + ' ';
        return story;
    }
};
