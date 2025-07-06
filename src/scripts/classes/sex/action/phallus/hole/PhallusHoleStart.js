// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TailVagina.TAIL_FUCKING_START.
*/
import { phallusHoleSizeDifferenceStart } from "../util";
export class PhallusHoleStart extends setup.SexAction.OngoingStart {
    /**
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    getInitDescription(sex) {
        // describe how tail slithers into the hole
        return '';
    }
    /**
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    getExtraDescription(sex) {
        // describe size difference, and also anal acceptance if appropriate
        return '';
    }
    /**
     * @param {setup.SexInstance} sex
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
        const dick = this.getPenetratorBodypart().rep(me, sex);
        const tip = this.getPenetratorBodypart().repTip(me, sex);
        const hole = this.getPenetrationTarget().rep(them, sex);
        const labia = this.getPenetrationTarget().repLabia(them, sex);
        const vaginal = this.getPenetrationTarget().repVaginal(them, sex);
        const floor = sex.getLocation().repSurface(sex);
        const myfacingheight = mypose.getFacingHeight(this.getPenetratorBodypart(), myposition, sex);
        const theirfacingheight = theirpose.getFacingHeight(this.getPenetrationTarget(), theirposition, sex);
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
        story += this.getInitDescription(sex);
        story += ' ';
        if (mypace == setup.sexpace.dom) {
            t = [
                `Roughly grinding the ${tip} of a|their ${dick} between b|reps ${labia}, a|rep a|let out a|a_moan before violently slamming ${dir}wards, forcing a|their ${dick} deep into b|their ${hole}.`,
                `a|Rep a|position the ${tip} of a|their ${dick} between b|reps ${labia}, and with a forceful thrust, a|they roughly a|slam it deep into b|their ${hole}.`,
            ];
        }
        else if (mypace == setup.sexpace.normal || mypace == setup.sexpace.sub) {
            t = [
                `a|Eagerly teasing the ${tip} of a|their ${dick} between b|reps ${labia}, a|rep a|let out a|a_moan before thrusting ${dir}wards, greedily sinking a|their ${dick} into b|their ${hole}.`,
                `a|Rep a|position the ${tip} of a|their ${dick} between b|reps ${labia}, and with a determined thrust, a|they a|eagerly a|sink it deep into b|their ${hole}.`
            ];
        }
        else {
            t = [
                `Hesitantly teasing the ${tip} of a|their ${dick} between b|reps ${labia}, a|rep a|let out a|a_moan before forcing a|themself to thrust ${dir}wards, sinking a|their ${dick} into b|their ${hole}.`,
                `a|Rep hesitantly a|position the ${tip} of a|their ${dick} between b|reps ${labia}, and after looking for but not finding any mercy, a|they a|sink it deep with a little thrust into b|their ${hole}.`
            ];
        }
        story += setup.rng.choice(t);
        story += ' ';
        if (theirpace == setup.sexpace.dom) {
            t = [
                ` b|Rep b|let out b|a_moan as the ${dick} enters b|them, before violently thrusting b|their hips ${dir} in order to force it even deeper into b|their ${hole}.`,
                ` With b|a_moan, b|rep b|start violently bucking b|their hips ${dir}, roughly forcing a|rep to sink a|their ${dick} even deeper into b|their ${hole}.`
            ];
        }
        else if (theirpace == setup.sexpace.sub || theirpace == setup.sexpace.normal) {
            t = [
                ` b|Rep b|let out b|a_moan as the ${dick} enters b|them, before b|eagerly bucking b|their hips ${dir} in order to sink it even deeper into b|their ${hole}.`,
                ` With b|a_moan, b|rep b|start b|eagerly bucking b|their hips ${dir}, b|eagerly helping to sink a|reps ${dick} even deeper into b|their ${hole}.`
            ];
        }
        else if (theirpace == setup.sexpace.resist) {
            t = [
                ` b|Rep b|let out b|a_sob as the ${dick} enters b|them, and, with tears running down b|their b|face, b|they b|beg for a|rep to pull out.`,
                ` With b|a_sob, b|rep b|try, in vain, to pull away from the unwanted penetration, tears running down b|their b|face as a|reps unwelcome ${dick} pushes deep into b|their ${hole}.`
            ];
        }
        else if (theirpace == setup.sexpace.forced) {
            t = [
                ` b|Rep b|let out b|a_moan as the ${dick} enters b|them, lying still in a vain attempt to minimize the pain.`,
                ` With b|a_moan, b|rep b|sink into the ${floor}, trying b|their best to obediently take the ${dick} inside b|them.`
            ];
        }
        else if (theirpace == setup.sexpace.mindbroken) {
            t = [
                setup.SexUtil.mindbrokenReactionNoun(them, sex, [
                    `the ${dick} intruding b|their ${hole}`,
                    `the intruding ${dick}`,
                    `the ${dick} that is being pushed into b|their ${hole}`
                ])
            ];
        }
        story += setup.rng.choice(t);
        story += ' ';
        story += phallusHoleSizeDifferenceStart(me, this.getPenetratorBodypart(), them, this.getPenetrationTarget(), sex);
        story += ' ';
        story += this.getExtraDescription(sex);
        return story;
    }
}
