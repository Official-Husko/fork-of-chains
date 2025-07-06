// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tongueVagina.CUNNILINGUS_SUB_RESIST
*/
import { MouthHoleDomBase } from "./MouthHoleBase";
export class MouthHoleDomResist extends MouthHoleDomBase {
    getActorDescriptions() {
        return [
            {
                energy: setup.Sex.ENERGY_SMALL,
                arousal: -setup.Sex.AROUSAL_SMALL,
                discomfort: setup.Sex.DISCOMFORT_TINY,
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
        const hole = this.getPenetrationTarget().rep(them, sex);
        const labia = this.getPenetrationTarget().repLabia(them, sex);
        const vaginal = this.getPenetrationTarget().repVaginal(them, sex);
        const cunn = this.getPenetrationTarget().repCunnilingus(them, sex);
        let t;
        if (theirpace == setup.sexpace.sub) {
            t = [
                `a|Rep a|try to pull a|their a|face back, but b|rep b|continue eagerly thrusting b|their ${hole} down against a|their lips, holding a|them in place as b|they b|force b|themself on a|them.`,
                `With a|a_sob, a|rep a|try to pull away from b|rep, but b|they quickly b|force a|their a|face right back into b|their ${hole}, eagerly grinding b|themself against a|them as b|they b|ignore a|their struggles.`,
                `Tears start to well up in a|reps a|eyes, and with a|a_sob, a|they a|try to pull a|their mouth away from b|reps ${hole}, but b|rep quickly b|shift position, ignoring a|their protests as b|they eagerly b|press b|their ${hole} against a|their lips.`
            ];
        }
        else if (theirpace == setup.sexpace.normal) {
            t = [
                `a|Rep a|try to pull a|their a|face back, but b|rep b|continue gently pressing b|their ${hole} down against a|their lips, holding a|them in place as b|they b|force b|themself on a|them.`,
                `With a|a_sob, a|rep a|try to pull away from b|rep, but b|they quickly b|force a|their a|face right back into b|their ${hole}, gently grinding b|themself against a|them as b|they b|ignore a|their struggles.`,
                `Tears start to well up in a|reps a|eyes, and with a|a_sob, a|they a|try to pull a|their mouth away from b|reps ${hole}, but b|rep quickly b|shift position, ignoring a|their protests as b|they b|press b|their ${hole} against a|their lips.`
            ];
        }
        else {
            t = [
                `a|Rep a|try to pull a|their a|face back, but b|rep roughly b|slam b|their ${hole} down against a|their lips, holding a|them in place as b|they violently b|force b|themself on a|them.`,
                `With a|a_sob, a|rep a|try to pull away from b|rep, but b|they violently b|force a|their a|face right back into b|their ${hole}, roughly grinding b|themself against a|them as b|they b|ignore a|their struggles.`,
                `Tears start to well up in a|reps a|eyes, and with a|a_sob, a|they a|try to pull a|their mouth away from b|reps ${hole}, but b|rep quickly b|shift position, ignoring a|their protests as b|they roughly b|grind b|their ${hole} against a|their lips.`
            ];
        }
        story += setup.rng.choice(t);
        return story;
    }
}
