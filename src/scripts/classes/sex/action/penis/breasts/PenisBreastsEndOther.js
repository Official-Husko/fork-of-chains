// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA : PenisBreasts.FUCKED_STOP */
import { PenisHoleEndOther } from "../hole/PenisHoleEndOther";
setup.SexActionClass.PenisBreastsEndOther = class PenisBreastsEndOther extends PenisHoleEndOther {
    getTags() { return super.getTags().concat(['dom',]); }
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_penetration_penisbreasts'),
            setup.qres.SexCanTitfuck('b', 'a'),
        ]);
    }
    /**
     * @returns {setup.SexBodypart}
     */
    getPenetrationTarget() {
        return setup.sexbodypart.breasts;
    }
    rawTitle(sex) {
        const me = this.getActorUnit('a');
        const them = this.getActorUnit('b');
        const titfuck = setup.sexbodypart.breasts.repTitfuck(them, me);
        return `Stop ${titfuck}ing`;
    }
    rawDescription(sex) {
        const me = this.getActorUnit('a');
        const them = this.getActorUnit('b');
        const titfuck = setup.sexbodypart.breasts.repTitfuck(them, me);
        return `Push b|reps b|dick away from your a|breasts and stop giving b|them a ${titfuck}.`;
    }
    rawStory(sex) {
        const me = this.getActorUnit('a');
        const them = this.getActorUnit('b');
        const mypace = sex.getPace(me);
        const mypose = sex.getPose(me);
        const myposition = sex.getPosition(me);
        const theirpace = sex.getPace(them);
        const theirpose = sex.getPose(them);
        const theirposition = sex.getPosition(them);
        let story = '';
        let t;
        const myfacingheight = mypose.getFacingHeight(this.getPenetrationTarget(), myposition, sex);
        const theirfacingheight = theirpose.getFacingHeight(this.getPenetratorBodypart(), theirposition, sex);
        const titfuck = setup.sexbodypart.breasts.getTitfuck(them, me);
        let push = setup.sexbodypart.breasts.repPush(them, me);
        if (mypace == setup.sexpace.dom) {
            t = [
                `a|Rep roughly a|push b|rep away from a|them, and, in a menacing
        tone, a|order b|them to stop fucking a|their a|breasts.`,
                `With a menacing growl, a|rep roughly a|push b|rep away, and a|order
        b|them to stop fucking a|their a|breasts.`,
            ];
        }
        else {
            t = [
                `a|Rep a|push b|rep away from a|them, and a|ask b|them to stop
        fucking a|their a|breasts.`,
                `With one last moan, a|rep a|push b|rep away, and a|ask b|them to
        stop fucking a|their a|breasts.`,
            ];
        }
        story += setup.rng.choice(t);
        story += ' ';
        story += setup.SexUtil.afterPenetrationReactionDom(me, them, [
            `a|they a|stop the ${titfuck}`,
            `a|rep a|stop b|them from fucking a|their a|breasts`,
            `a|rep a|withdraw a|their a|breasts away from b|reps b|dick`,
        ], [
            `continue the ${titfuck}`,
            `continue fucking a|reps a|breasts`,
            `continue sliding b|their b|dick between a|their a|breasts`,
        ], sex);
        return story;
    }
};
