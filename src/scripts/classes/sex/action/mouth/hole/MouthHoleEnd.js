// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TongueVagina.CUNNILINGUS_STOP
.*/
import { PhallusHoleEnd } from "../../phallus/hole/PhallusHoleEnd";
export class MouthHoleEnd extends PhallusHoleEnd {
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_penetration_mouthhole'),
        ]);
    }
    /**
     * @returns {setup.SexBodypart}
     */
    getPenetratorBodypart() {
        return setup.sexbodypart.mouth;
    }
    rawStory(sex) {
        const me = this.getActorUnit('a');
        const them = this.getActorUnit('b');
        const mypace = sex.getPace(me);
        const mypose = sex.getPose(me);
        const myposition = sex.getPosition(me);
        const theirpace = sex.getPace(them);
        let story = '';
        let t;
        const hole = this.getPenetrationTarget().rep(them, sex);
        const labia = this.getPenetrationTarget().repLabia(them, sex);
        const vaginal = this.getPenetrationTarget().repVaginal(them, sex);
        if (mypace == setup.sexpace.dom) {
            t = [
                `With one last rough lick, a|rep a|pull a|their a|face away from b|reps ${hole}.`,
                `Giving b|reps ${labia} a final, rough kiss, a|rep a|pull a|their a|face away from b|their ${hole}.`
            ];
        }
        else {
            t = [
                `With one last lick, a|rep a|pull a|their a|face away from b|reps ${hole}.`,
                `Giving b|reps labia a final, wet kiss, a|rep a|pull a|their a|face away from b|their ${hole}.`
            ];
        }
        story += setup.rng.choice(t);
        story += ' ';
        story += setup.SexUtil.afterPenetrationReactionSub(me, them, [
            `a|rep a|take a|their tongue away from b|their ${hole}`,
            `the invading tongue retreats from b|their ${hole}`,
            `the ${vaginal} stimulation ends`,
            `a|reps intruding a|tongue retreats`,
        ], [
            `continue having a|rep a|service a|their ${hole}`,
            `have a warm tongue servicing a|their ${hole}`,
            `receive more ${vaginal} attention`,
        ], sex);
        return story;
    }
}
