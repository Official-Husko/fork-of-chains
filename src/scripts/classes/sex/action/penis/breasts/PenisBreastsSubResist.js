// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
PenisBreasts.FUCKED_SUB_RESIST
*/
import { PenisBreastsSubBaseResist } from "./PenisBreastsBase";
setup.SexActionClass.PenisBreastsSubResist = class PenisBreastsSubResist extends PenisBreastsSubBaseResist {
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
        const me = this.getActorUnit('a');
        const them = this.getActorUnit('b');
        const titfuck = setup.sexbodypart.breasts.repTitfuck(them, me);
        return `Resist performing ${titfuck}`;
    }
    /**
     * Short description of this action. E.g., "Put your breasts in their dick"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawDescription(sex) {
        return `Try and push b|reps b|dick away from your a|breasts.`;
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
        const titfuck = setup.sexbodypart.breasts.getTitfuck(me, them);
        let push = setup.sexbodypart.breasts.repPush(me, them);
        let t;
        if (theirpace == setup.sexpace.dom) {
            t = [
                `a|Rep a|try to push the invading b|dick away from a|their a|breasts,
         but b|rep just b|eagerly b|${push} a|their a|breasts even tighter together,
         locking the dick securely inside.`,
                `a|Rep weakly try to push away the b|dick from a|their a|cleavage,
         but b|rep simply b|reinsert b|their b|dick into the opening and b|continue the unrelentless fucking.`,
                `a|Reps incoherent begging for mercy falls on deaf ears as b|rep
         b|continue b|eagerly thrusting b|their b|dick into a|their vulnerable a|cleavage.`,
            ];
        }
        else {
            t = [
                `a|Rep a|try to push the invading b|dick away from a|their a|breasts,
         but b|rep just b|eagerly b|${push} a|their a|breasts even tighter together,
         locking the dick securely inside.`,
                `a|Rep weakly try to push away the b|dick from a|their a|cleavage,
         but b|rep simply b|reinsert b|their b|dick into the opening and b|continue the fucking.`,
                `a|Reps incoherent begging for mercy falls on deaf ears as b|rep
         b|continue b|eagerly thrusting b|their b|dick into a|their vulnerable a|cleavage.`,
            ];
        }
        story += setup.rng.choice(t);
        return story;
    }
};
