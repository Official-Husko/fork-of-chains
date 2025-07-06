// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TailVagina.USING_TAIL_STOP
universal/Cowgirl.java
*/
export class PhallusHoleEndOther extends setup.SexAction.OngoingEndOther {
    /**
     * Returns a string telling a story about this action to be given to the player
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
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
        const dick = this.getPenetratorBodypart().rep(them, sex);
        const tip = this.getPenetratorBodypart().repTip(them, sex);
        const fuck = this.getPenetratorBodypart().repFuck(them, sex);
        const hole = this.getPenetrationTarget().rep(me, sex);
        const labia = this.getPenetrationTarget().repLabia(me, sex);
        const vaginal = this.getPenetrationTarget().repVaginal(me, sex);
        const myfacingheight = mypose.getFacingHeight(this.getPenetrationTarget(), myposition, sex);
        const theirfacingheight = theirpose.getFacingHeight(this.getPenetratorBodypart(), theirposition, sex);
        if (mypace == setup.sexpace.dom) {
            t = [
                `Yanking b|reps ${dick} out of a|their ${hole}, a|rep a|let out a menacing growl as a|they a|command b|rep to stop ${fuck}ing a|them.`,
                `a|Rep a|lean into b|rep, inhaling b|their b|scent before yanking b|their ${dick} out of a|their ${hole}.`
            ];
            if (myfacingheight.facing.isDown() && theirfacingheight.facing.isUp()) {
                t = t.concat([
                    `Reaching down, a|rep roughly a|grab the base of b|reps b|dick, before lifting a|themself up and allowing b|reps b|dick to slide out of a|their ${hole}.`
                ]);
            }
        }
        else {
            t = [
                `Sliding b|reps ${dick} out of a|their ${hole}, a|rep a|let out a|a_moan as a|they a|tell b|rep to stop ${fuck}ing a|them.`,
                `a|Rep a|lean into b|rep, inhaling b|their b|scent before sliding b|their ${dick} out of a|their ${hole}.`
            ];
            if (myfacingheight.facing.isDown() && theirfacingheight.facing.isUp()) {
                t = t.concat([
                    `Reaching down, a|rep takes hold of the base of b|reps b|dick, before lifting a|themself up and allowing b|reps b|dick to slide out of a|their ${hole}.`
                ]);
            }
        }
        story += setup.rng.choice(t);
        story += ' ';
        story += setup.SexUtil.afterPenetrationReactionDom(me, them, [
            `a|they a|stop riding b|rep`,
            `a|rep a|stop b|them from fucking a|their ${hole}`,
            `a|rep a|withdraw a|their ${hole} away from b|reps ${dick}`,
        ], [
            `continue ${fuck}ing a|reps ${hole}`,
            `continue ${fuck}ing a|rep`,
        ], sex);
        return story;
    }
}
