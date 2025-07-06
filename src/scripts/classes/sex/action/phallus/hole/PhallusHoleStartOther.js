// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TailVagina.USING_TAIL_START
universal/Cowgirl.java
*/
import { phallusHoleSizeDifferenceStart } from "../util";
export class PhallusHoleStartOther extends setup.SexAction.OngoingStartOther {
    /**
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    getExtraDescription(sex) {
        // describe size difference, and also anal acceptance if appropriate
        return '';
    }
    /**
     * Returns a string telling a story about this action to be given to the player
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawStory(sex) {
        const me = this.getActorUnit('a');
        const mypace = sex.getPace(me);
        const mypose = sex.getPose(me);
        const myposition = sex.getPosition(me);
        const them = this.getActorUnit('b');
        const theirpace = sex.getPace(them);
        const theirpose = sex.getPose(them);
        const theirposition = sex.getPosition(them);
        let story = '';
        let t;
        const dick = this.getPenetratorBodypart().rep(them, sex);
        const tip = this.getPenetratorBodypart().repTip(them, sex);
        const fuck = this.getPenetratorBodypart().repFuck(them, sex);
        const hole = this.getPenetrationTarget().rep(me, sex);
        const labia = this.getPenetrationTarget().repLabia(me, sex);
        const vaginal = this.getPenetrationTarget().repVaginal(me, sex);
        const myfacingheight = mypose.getFacingHeight(this.getPenetrationTarget(), myposition, sex);
        const theirfacingheight = theirpose.getFacingHeight(this.getPenetratorBodypart(), theirposition, sex);
        let dir = 'for';
        let odir = 'back';
        if (myfacingheight.facing.isDown()) {
            dir = 'down';
            odir = 'up';
        }
        else if (myfacingheight.facing.isUp()) {
            dir = 'up';
            odir = 'down';
        }
        if (mypace == setup.sexpace.dom) {
            t = [
                `Grabbing b|reps ${dick}, a|rep roughly a|yank it up to a|their ${labia}, letting out a|a_moan before violently slamming a|their hips ${dir}wards and forcing b|them to penetrate a|their ${hole}.`,
                `Grabbing b|reps ${dick}, a|rep a|line it up to a|their ${hole}, before eagerly slamming a|their hips ${dir}wards and letting out a|a_moan as a|they a|penetrate a|themself on b|their ${dick}.`
            ];
            if (myfacingheight.facing.isDown() && theirfacingheight.facing.isUp()) {
                t = t.concat([
                    `a|Rep reaches down and roughly a|grab b|reps b|dick, before shuffling around to get into a good position. After taking a moment to tease the cock head between a|their outer ${labia}, a|they a|let out a|a_moan as a|they forcefully a|drop down and penetrates a|their ${hole} on b|reps b|dick.`,
                    `Shuffling around into a better position, a|rep a|line the cock head of b|reps b|dick up between a|their a|legs, and with a single movement, a|they roughly a|drop down, penetrating a|their ${hole} on b|reps b|dick.`
                ]);
            }
        }
        else if (mypace == setup.sexpace.normal || mypace == setup.sexpace.sub) {
            t = [
                `Grabbing b|reps ${dick}, a|rep a|eagerly a|guide it up to a|their ${labia}, letting out a little moan before a|eagerly bucking a|their hips ${dir}wards and forcing b|them to penetrate a|their ${hole}.`,
                `Grabbing b|reps ${dick}, a|rep a|line it up to a|their ${hole}, before a|eagerly pushing a|their hips ${dir}wards and letting out a soft moan as a|they a|penetrate a|themself on b|their ${dick}.`
            ];
            if (myfacingheight.facing.isDown() && theirfacingheight.facing.isUp()) {
                t = t.concat([
                    `a|Rep reaches down to take hold of b|reps b|dick, before shuffling around to get into a good position. After taking a moment to tease the cock head between a|their outer ${labia}, a|they a|let out a little moan as a|they a|eagerly a|drop down and penetrates a|their ${hole} on b|reps b|dick.`,
                    `Shuffling around into a better position, a|rep a|line the cock head of b|reps b|dick up between a|their a|legs, and with a ${mypace == setup.sexpace.normal ? `slow, steady` : `a single`} movement, a|they a|eagerly a|drop down, penetrating a|their ${hole} on b|reps b|dick.`,
                ]);
            }
        }
        else {
            const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(me, sex);
            t = [
                `Grabbing b|reps ${dick}, a|rep ${h} guide it up to a|their ${labia}, letting out a|a_moan before bucking a|their hips and forcing b|them to penetrate a|their ${hole}.`,
                `Grabbing b|reps ${dick}, a|rep ${h} line it up to a|their ${hole}, before pushing a|their hips back and letting out a|a_moan as a|they a|penetrate a|themself on b|their ${dick}.`
            ];
            t = t.concat([
                `a|Rep reaches down, then ${h} take an unsure hold of b|reps b|dick, before shuffling around to get into a relatively comfortable position. After taking a moment, a|they a|let out a|a_moan as a|they a|drop down and penetrates a|their ${hole} on b|reps b|dick.`,
                `Shuffling around into a somewhat better position, a|rep ${h} line the cock head of b|reps b|dick up between a|their a|legs, and a|they carefully a|drop down, penetrating a|their ${hole} on b|reps b|dick.`
            ]);
        }
        story += setup.rng.choice(t);
        story += ' ';
        if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
            t = [
                ` b|Rep b|let out b|a_moan as b|they b|enter a|them, b|eagerly pushing b|their ${dick} ${odir}wards as b|they b|start b|eagerly ${fuck}ing a|reps ${hole}.`,
                ` With b|a_moan, b|rep b|eagerly b|thrust b|their ${dick} ${odir}wards, sinking it deep into a|reps ${hole} as b|they b|start b|eagerly ${fuck}ing a|them.`
            ];
            if (myfacingheight.facing.isDown() && theirfacingheight.facing.isUp()) {
                t = t.concat([
                    ` b|Rep b|let out b|a_moan as b|rep enter a|them, b|eagerly bucking b|reps hips up as b|rep b|start fucking a|their ${hole}.`,
                    ` With b|a_moan, b|rep b|eagerly b|thrust b|reps hips up into a|their groin, sinking b|reps b|dick into a|their ${hole} as b|rep b|start b|eagerly fucking a|them.`
                ]);
            }
        }
        else if (theirpace == setup.sexpace.dom) {
            t = [
                ` b|Rep b|let out b|a_moan as b|they b|enter a|them, and, seeking to remind a|rep who's in charge, b|they roughly slams b|their ${dick} ${odir}wards and b|start to ruthlessly ${fuck} a|their ${hole}.`,
                ` With b|a_moan, b|rep roughly b|slam b|their ${dick} ${odir}wards, seeking to remind a|rep who's in charge as b|they b|start ruthlessly ${fuck}ing a|reps ${hole}.`
            ];
            if (myfacingheight.facing.isDown() && theirfacingheight.facing.isUp()) {
                t = t.concat([
                    ` b|Rep b|let out commanding grunt as b|rep enter a|them, aggressively bucking b|reps hips up as b|rep b|b|start fucking a|their ${hole} while continuing to molest the rest of a|reps body.`,
                    ` With a commanding grunt, b|rep violently b|thrust b|reps hips up into a|their groin, painfully sinking b|reps b|dick into a|their ${hole} as b|rep b|start fucking a|them.`
                ]);
            }
        }
        else if (theirpace == setup.sexpace.resist) {
            t = [
                ` b|Rep b|let out b|a_sob as a|rep a|force b|their ${dick} inside of a|them, and, struggling against a|them, b|they desperately b|try to pull b|their ${dick} free from a|their ${hole}.`,
                ` With b|a_sob, b|rep struggles against a|rep as a|they a|force b|their ${dick} deep into a|their ${hole}.`
            ];
            if (myfacingheight.facing.isDown() && theirfacingheight.facing.isUp()) {
                t = t.concat([
                    ` b|Rep b|let out b|a_sob as a|they a|force b|reps b|dick inside of a|them, and, struggling against a|them in vain, b|rep desperately b|try to push a|them off of b|rep.`,
                    ` With b|a_sob, b|rep b|struggle against a|rep as a|they a|force b|reps b|dick deep into a|their ${hole}.`
                ]);
            }
        }
        else if (theirpace == setup.sexpace.forced) {
            const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex);
            t = [
                ` b|Rep b|let out b|a_moan as b|they b|enter a|them. b|They ${h} push b|their ${dick} ${odir}wards as b|they b|start ${fuck}ing a|reps ${hole}.`,
                ` b|Rep ${h} thrust b|their ${dick} ${odir}wards, sinking it deep into a|reps ${hole} as b|they b|start ${fuck}ing a|them.`
            ];
        }
        else if (theirpace == setup.sexpace.mindbroken) {
            t = [
                setup.SexUtil.mindbrokenReactionDespite(them, sex, [
                    `Although anyone else would have enjoyed the sensation on b|their ${dick}`,
                    `Despite the ongoing stimulations on b|their ${dick}`,
                ])
            ];
        }
        story += setup.rng.choice(t);
        story += ' ';
        story += phallusHoleSizeDifferenceStart(them, this.getPenetratorBodypart(), me, this.getPenetrationTarget(), sex);
        story += ' ';
        story += this.getExtraDescription(sex);
        return story;
    }
}
