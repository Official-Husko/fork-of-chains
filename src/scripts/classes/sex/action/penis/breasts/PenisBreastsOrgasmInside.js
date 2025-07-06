// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
GenericOrgasms
*/
import { cumFaceReaction, titanicBallsCumNotStoppingSentence } from "../util";
import { PenisBreastsOrgasmBase } from "./PenisBreastsOrgasmBase";
import { getDickPokeOutScore } from "./util";
setup.SexActionClass.PenisBreastsOrgasmInside = class PenisBreastsOrgasmInside extends PenisBreastsOrgasmBase {
    getTags() { return super.getTags().concat(['normal',]); }
    desc() { return 'Cum during titfuck / pecjob'; }
    /**
     * Returns the title of this action, e.g., "Blowjob"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawTitle(sex) {
        const me = this.getActorUnit('a');
        const them = this.getActorUnit('b');
        const titfuck = setup.sexbodypart.breasts.repTitfuck(me, them);
        return `Cum during ${titfuck}`;
    }
    /**
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    describeOrgasm(sex) {
        const me = this.getActorUnit('a');
        const them = this.getActorUnit('b');
        let story = '';
        let t = [
            ` a|Rep a|continue a|eagerly thrusting a|their a|dick within b|reps b|cleavage, letting out a|a_moan as a|they a|feel a|their orgasm coming.`,
            ` a|Reps a|dick starts to twitch, and in response a|they rapidly thrust it in and out of b|reps b|cleavage in anticipation of an upcoming climax.`,
            ` a|Rep a|eagerly a|thrust a|their a|dick along b|reps b|cleavage as it starts to twitch and jerk.`,
        ];
        story += setup.rng.choice(t) + ' ';
        let soft = 'soft';
        if (setup.sexbodypart.breasts.getTitfuck(me, them) == setup.SexBodypartClass.Breasts.TITFUCK.pecjob) {
            soft = 'hard';
        }
        t = [];
        if (me.isHasTrait('dick_demon')) {
            t = [
                `a|Their movements cause the barbs lining a|their a|dick to rake against the ${soft} sides of
         b|reps breasts, causing b|them to let out b|a_moan.`,
                `The sensitive little barbs lining a|reps demonic dick grazes against the ${soft} flesh of
         b|reps breasts,`,
            ];
        }
        else if (me.isHasTrait('dick_werewolf')) {
            t = [
                `a|Their fat knot swells up, and with each thrust, bumps wildly
        against the ${soft} flesh of b|reps b|breasts, which in turn causes b|them to let out
        b|a_moan.`,
                `a|Their fat knot swells up, painfully pushing away the ${soft} flesh of b|reps b|breasts
        in a futile attempt to lock itself in.`,
            ];
        }
        else if (me.isHasTrait('dick_dragonkin')) {
            t = [
                ` a|Their ribbed shaft repeatedly bumps against the ${soft} flesh of b|reps b|breasts on
        every thrust, which in turn causes b|them to let out b|a_moan.`,
                ` The ridges on a|their a|dick bumps against the ${soft} flesh of b|reps b|breasts, drawing out a moan.`,
            ];
        }
        if (t.length) {
            story += setup.rng.choice(t) + ' ';
        }
        return story;
    }
    /**
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    cumTargetDescription(sex) {
        const me = this.getActorUnit('a');
        const them = this.getActorUnit('b');
        let story = '';
        let t;
        const score = getDickPokeOutScore(me, them, sex);
        if (score <= -1) {
            // cum inside breasts
            t = [
                ` all on b|reps b|cleavage and b|breasts as the dick is buried deep within inside.`,
                ` messily over b|reps b|cleavage and b|breasts as the dick is buried within.`,
            ];
        }
        else if (score == 0) {
            // cum at neck
            t = [
                ` all over b|reps b|breasts and b|neck but barely decorating b|their face.`,
                ` messily over b|reps b|breasts and b|neck.`,
            ];
        }
        else {
            // cum at face
            t = [
                ` all over b|reps b|breasts and face from the dickhead poking out of b|their b|breasts.`,
                ` messily over b|reps b|breasts and face since the dick is long enough to poke out of b|their b|cleavage.`,
            ];
        }
        story = setup.rng.choice(t) + ' ';
        if (score >= 1) {
            // cum at face, give out reaction.
            story += cumFaceReaction(me, them, sex) + ' ';
        }
        if (me.isHasTrait('balls_titanic')) {
            const w = titanicBallsCumNotStoppingSentence(me, them, sex);
            if (score >= 1) {
                t = [
                    `${w}, and soon after b|their face is almost entirely covered in cum.`,
                    `${w}, and before long b|their entire face is wet and sticky with cum.`,
                ];
            }
            else {
                t = [
                    `${w}, and soon after b|their torso is drenched in cum.`,
                    `${w}, and before long b|their b|breasts are entirely coated in cum.`,
                ];
            }
            story += setup.rng.choice(t) + ' ';
        }
        return story;
    }
};
