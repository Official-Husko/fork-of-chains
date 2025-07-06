// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA : BLOWJOB_SUB_RESIST */
import { PenisMouthSubBaseResist } from "./PenisMouthBase";
setup.SexActionClass.PenisMouthSubResist = class PenisMouthSubResist extends PenisMouthSubBaseResist {
    getTags() { return super.getTags().concat(['normal',]); }
    getActorDescriptions() {
        return [
            {
                energy: setup.Sex.ENERGY_SMALL,
                discomfort: setup.Sex.DISCOMFORT_SMALL,
                arousal: -setup.Sex.AROUSAL_SMALL,
                paces: [setup.sexpace.resist],
                restrictions: [
                    setup.qres.SexPaceIn([setup.sexpace.resist])
                ],
            },
            {
                energy: setup.Sex.ENERGY_MEDIUM,
                arousal: setup.Sex.AROUSAL_SMALL,
                paces: setup.SexPace.getAllPaces(),
            },
        ];
    }
    /**
     * Returns the title of this action, e.g., "Blowjob"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawTitle(sex) {
        return `Resist performing blowjob`;
    }
    /**
     * Short description of this action. E.g., "Put your mouth in their dick"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawDescription(sex) {
        return `Try and push b|reps b|dick out of your mouth.`;
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
        if (theirpace == setup.sexpace.dom) {
            t = [
                `a|Rep a|let out a muffled sob, squirming and struggling in distress as b|rep forcefully holds a|them in place, roughly pumping b|their b|dick back and forth past a|their lips.`,
                `With a|a_sob, a|rep a|try to pull a|their head back, a|their protestations coming out in gargled bursts as b|rep b|continue roughly slamming b|their b|dick down a|their throat.`,
                `a|Rep a|feel tears running down a|reps cheeks as a|they weakly a|try to push b|rep away, sobbing in distress as b|rep b|continue roughly thrusting b|their b|dick in and out of a|their mouth.`,
                `Struggling against b|rep, a|rep a|let out a|a_sob as a|they weakly a|try to pull a|their a|face away from b|their groin, but b|reps grasp on a|their head is too strong, and b|they forcefully b|force a|them back into position.`,
                `a|Rep a|retch through a|their tears as a|they a|try and a|fail to get a|their a|mouth free from b|reps b|dick,
         who keeps roughly pounding away at a|their throat`,
            ];
        }
        else {
            t = [
                `a|Rep a|let out a muffled sob, squirming and struggling in distress as b|rep holds a|them in place, a|eagerly sliding b|their b|dick back and forth past a|their lips.`,
                `With a|a_sob, a|rep a|try to pull a|their head back, a|their protestations coming out in gargled bursts as b|rep b|continue a|eagerly pushing b|their b|dick down a|their throat.`,
                `a|Rep a|feel tears running down a|reps cheeks as a|they weakly a|try to push b|rep away, sobbing in distress as b|rep b|continue a|eagerly sliding b|their b|dick in and out of a|their mouth.`,
                `a|Rep a|try to push b|reps groin away from a|their a|face, but a|their efforts prove to be in vain as b|rep lustfully b|grab hold of a|their head and b|pull a|them back into b|their crotch.`,
            ];
        }
        story += setup.rng.choice(t);
        return story;
    }
};
