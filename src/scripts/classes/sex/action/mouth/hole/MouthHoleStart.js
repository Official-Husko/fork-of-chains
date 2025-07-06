// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TongueVagina.CUNNILINGUS_START.
*/
import { PhallusHoleStart } from "../../phallus/hole/PhallusHoleStart";
export class MouthHoleStart extends PhallusHoleStart {
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
        const hole = this.getPenetrationTarget().rep(them, sex);
        const labia = this.getPenetrationTarget().repLabia(them, sex);
        const vaginal = this.getPenetrationTarget().repVaginal(them, sex);
        if (mypace == setup.sexpace.dom) {
            t = [
                `Roughly grinding a|their lips against b|reps ${hole}, a|rep a|plant a series of forceful kisses on b|their ${labia}, before greedily sliding a|their tongue into b|their ${hole}.`,
                `Planting a series of forceful kisses on b|reps ${labia}, a|rep a|give b|their ${hole} a rough lick, before greedily pushing a|their tongue deep inside.`
            ];
        }
        else if (mypace == setup.sexpace.normal) {
            t = [
                `Pressing a|their lips against b|reps ${hole}, a|rep a|plant a series soft kisses on b|their ${labia}, before slowly, but firmly, sliding a|their tongue into b|their ${hole}.`,
                `Planting a series of soft kisses on b|reps ${labia}, a|rep a|give b|their ${hole} a long, wet lick, before gently pushing a|their tongue deep inside.`
            ];
        }
        else if (mypace == setup.sexpace.sub) {
            t = [
                `Eagerly pressing a|their lips against b|reps ${hole}, a|rep a|plant a series of passionate kisses on b|their ${labia}, before desperately sliding a|their tongue into b|their ${hole}.`,
                `Planting a series of passionate kisses on b|reps ${labia}, a|rep a|give b|their ${hole} a hungry lick, before greedily pushing a|their tongue deep inside.`
            ];
        }
        else {
            t = [
                `a|Rep fearfully a|eye b|rep before pressing a|their lips against b|reps ${hole}. a|Rep then a|plant a series of forced kisses on b|their ${labia}, before painstakingly sliding a|their tongue into b|their ${hole}.`,
                `Planting a series of forced kisses on b|reps ${labia}, after a glare from b|rep, a|rep hurriedly b|give b|their ${hole} a wet lick, before pushing a|their tongue deep inside.`
            ];
        }
        story += setup.rng.choice(t);
        story += ' ';
        if (theirpace == setup.sexpace.normal) {
            t = [
                ` b|Rep b|let out a soft moan in response, gently bucking b|their hips out against a|reps a|face as b|they b|beg for a|them to keep going.`,
                ` Gently bucking b|their hips out against a|reps a|face in response to a|their oral attention, b|rep b|moan out loud, begging for a|them to continue.`
            ];
        }
        else if (theirpace == setup.sexpace.dom) {
            t = [
                ` b|Rep b|let out b|a_moan in response, roughly thrusting b|their hips out against a|reps a|face as b|they b|order a|them to keep going.`,
                ` Roughly thrusting b|their hips out against a|reps a|face in an eager response to a|their oral attention, b|rep b|moan out loud, commanding a|them to continue.`
            ];
        }
        else if (theirpace == setup.sexpace.sub) {
            t = [
                ` b|Rep b|let out b|a_moan in response, eagerly bucking b|their hips out against a|reps a|face as b|they b|beg for a|them to keep going.`,
                ` Desperately bucking b|their hips out against a|reps a|face in response to a|their oral attention, b|rep b|moan out loud, begging for a|them to continue.`
            ];
        }
        else if (theirpace == setup.sexpace.resist) {
            t = [
                ` b|Rep frantically b|try to wriggle away from a|reps unwanted oral attention, sobbing and squirming as b|they b|beg for a|them to leave b|them alone.`,
                ` b|A_sob bursts out from b|reps mouth, and, struggling against a|rep, b|they b|beg for a|them to take a|their tongue away from b|their ${hole}.`
            ];
        }
        else if (theirpace == setup.sexpace.forced) {
            t = [
                ` b|Rep b|let out b|a_moan involuntarily in response, bucking b|their hips out against a|reps a|face as b|they b|enjoy the unwanted attention.`,
                ` Bucking b|their hips out against a|reps a|face in response to a|their oral attention, b|rep b|moan out loud, hoping that this is what b|their owner wants from b|them.`
            ];
        }
        else if (theirpace == setup.sexpace.mindbroken) {
            t = [
                setup.SexUtil.mindbrokenReactionDespite(them, sex, [
                    `Despite the stimulations showered on b|their ${hole}`,
                    `However, even with the tongue stimulating b|their ${hole}`,
                ])
            ];
        }
        story += setup.rng.choice(t);
        story += ' ';
        story += this.getExtraDescription(sex);
        return story;
    }
}
