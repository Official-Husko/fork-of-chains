// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
tongueVagina.RECEIVING_CUNNILINGUS_START
*/
import { PhallusHoleStartOther } from "../../phallus/hole/PhallusHoleStartOther";
export class MouthHoleStartOther extends PhallusHoleStartOther {
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
    /**
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    getExtraDescription(sex) {
        return '';
    }
    rawStory(sex) {
        const me = this.getActorUnit('a');
        const mypace = sex.getPace(me);
        const mypose = sex.getPose(me);
        const myposition = sex.getPosition(me);
        const them = this.getActorUnit('b');
        const theirpace = sex.getPace(them);
        let story = '';
        let t;
        const hole = this.getPenetrationTarget().rep(me, sex);
        const labia = this.getPenetrationTarget().repLabia(me, sex);
        const vaginal = this.getPenetrationTarget().repVaginal(me, sex);
        if (mypace == setup.sexpace.dom) {
            t = [
                `Roughly slamming a|their ${labia} down against b|reps b|face, a|rep a|let out a|a_moan as a|they a|start forcefully grinding a|their ${hole} down on b|their lips.`,
                `Shifting a|their hips so that b|reps b|face is forced into a|their ${labia}, a|Rep a|let out a|a_moan as a|they a|start roughly grinding a|their ${hole} down against b|their lips.`
            ];
        }
        else if (mypace == setup.sexpace.normal) {
            t = [
                `Gently pressing a|their ${labia} down against b|reps b|face, a|rep a|let out a soft moan as a|they a|start slowly grinding a|their ${hole} down on b|their lips.`,
                `Shifting a|their hips so that b|reps b|face is forced into a|their ${labia}, a|Rep a|let out a soft moan as a|they a|start gently pressing a|their ${hole} down against b|their lips.`
            ];
        }
        else if (mypace == setup.sexpace.sub) {
            t = [
                `Eagerly pressing a|their ${labia} down against b|reps b|face, a|rep a|let out a|a_moan as a|they a|start frantically grinding a|their ${hole} down on b|their lips.`,
                `Shifting a|their hips so that b|reps b|face is forced into a|their ${labia}, a|Rep a|let out a|a_moan as a|they a|start eagerly pressing a|their ${hole} down against b|their lips.`
            ];
        }
        else {
            t = [
                `Hesitantly pressing a|their ${labia} down against b|reps b|face, a|rep a|let out a|a_moan as a|they a|start grinding a|their ${hole} down on b|their lips.`,
                `Hesitantly shifting a|their hips so that b|reps b|face is forced into a|their ${labia}, a|Rep a|let out a|a_moan as a|they a|start pressing a|their ${hole} down against b|their lips.`
            ];
        }
        story += setup.rng.choice(t);
        story += ' ';
        if (theirpace == setup.sexpace.normal) {
            t = [
                ` b|Rep slowly b|slide b|their tongue into a|reps ${hole}, letting out a muffled moan as b|they b|start gently licking and kissing a|their ${labia}.`,
                ` Gently sliding b|their tongue out to deliver a long, slow lick to the ${labia} pressing down against b|their lips, b|rep b|let out a muffled moan as b|they b|start planting a series of tender kisses on a|reps ${hole}.`
            ];
        }
        else if (theirpace == setup.sexpace.dom) {
            t = [
                ` b|Rep forcefully b|thrust b|their tongue into a|reps ${hole}, letting out a muffled moan as b|they b|start roughly licking and kissing a|their ${labia}.`,
                ` Greedily thrusting b|their tongue out to deliver a rough, wet lick to the ${labia} pressing down against b|their lips, b|rep b|let out a muffled moan as b|they b|start planting a series of forceful kisses on a|reps ${hole}.`
            ];
        }
        else if (theirpace == setup.sexpace.sub) {
            t = [
                ` b|Rep greedily b|slide b|their tongue into a|reps ${hole}, letting out a muffled moan as b|they b|start happily licking and kissing a|their ${labia}.`,
                ` Greedily sliding b|their tongue out to deliver a long, wet lick to the ${labia} pressing down against b|their lips, b|rep b|let out a muffled moan as b|they b|start planting a series of passionate kisses on a|reps ${hole}.`
            ];
        }
        else if (theirpace == setup.sexpace.resist) {
            t = [
                ` Struggling in desperation, b|rep b|let out b|a_sob as a|rep a|force a|their ${hole} down against b|their lips.`,
                ` Sobbing and struggling in distress, b|reps protests prove to be in vain as a|rep a|press a|their ${labia} down over b|their b|face.`
            ];
        }
        else if (theirpace == setup.sexpace.forced) {
            t = [
                ` b|Rep hesitantly b|slide b|their tongue into a|reps ${hole}, letting out a muffled moan as b|they b|start licking and kissing a|their ${labia} out of fear for punishment.`,
                ` Sliding b|their tongue out to deliver a forced, but still very wet lick to the ${labia} pressing down against b|their lips, b|rep b|let out a muffled moan as b|they b|start planting a series of forced kisses on a|reps ${hole}.`
            ];
        }
        else if (theirpace == setup.sexpace.mindbroken) {
            t = [
                ` b|Rep reflexively b|struggle as b|their nose gets partially obstructed by the intruding ass.`,
                ` The mindbroken slave is incapable of intentionally extending b|their tongue towards the intruding ass.`,
            ];
        }
        story += setup.rng.choice(t);
        story += ' ';
        story += this.getExtraDescription(sex);
        return story;
    }
}
