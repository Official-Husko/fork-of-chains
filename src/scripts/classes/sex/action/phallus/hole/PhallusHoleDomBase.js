// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
tailVagina.TAIL_FUCKING_DOM_GENTLE
tailVagina.TAIL_FUCKING_DOM_NORMAL
tailVagina.TAIL_FUCKING_DOM_ROUGH
tailVagina.TAIL_FUCKING_SUB_NORMAL
tailVagina.TAIL_FUCKING_SUB_EAGER
.*/
import { SexActionOnOngoingDom } from "../../SexActionOnOngoing";
import { phallusHoleSizeDifferenceOngoing } from "../util";
export class PhallusHoleDomBase extends SexActionOnOngoingDom {
    /**
     * Multiply discomfort from size difference.
     * @param {string} actor_name
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @returns {number}
     */
    getDiscomfortMultiplier(actor_name, unit, sex) {
        const my_size = this.getPenetratorBodypart().getSize(this.getActorUnit('a'), sex);
        const their_size = (this.getPenetrationTarget().getSize(this.getActorUnit('b'), sex) +
            this.getPenetrationTarget().getTraitSizeModifier(this.getActorUnit('b'), sex));
        const size_diff = my_size - their_size;
        const idx = size_diff + setup.Sex.BODYPART_MAX_SIZE;
        const base = super.getDiscomfortMultiplier(actor_name, unit, sex);
        if (actor_name == 'a') {
            return base * setup.Sex.BODYPART_SIZE_DIFFERENCE_DISCOMFORT_MULTIPLIER_GIVER[idx];
        }
        else {
            return base * setup.Sex.BODYPART_SIZE_DIFFERENCE_DISCOMFORT_MULTIPLIER_RECEIVER[idx];
        }
    }
    /**
     * Multiply arousal from size difference.
     * @param {string} actor_name
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @returns {number}
     */
    getArousalMultiplier(actor_name, unit, sex) {
        // arousal disregard training multipliers. They will be taken into account via bodypart giver/receiver.
        const my_size = this.getPenetratorBodypart().getSize(this.getActorUnit('a'), sex);
        const their_size = this.getPenetrationTarget().getSize(this.getActorUnit('b'), sex);
        const size_diff = my_size - their_size;
        const idx = size_diff + setup.Sex.BODYPART_MAX_SIZE;
        const base = super.getDiscomfortMultiplier(actor_name, unit, sex);
        if (actor_name == 'a') {
            return base * setup.Sex.BODYPART_SIZE_DIFFERENCE_AROUSAL_MULTIPLIER_GIVER[idx];
        }
        else {
            return base * setup.Sex.BODYPART_SIZE_DIFFERENCE_AROUSAL_MULTIPLIER_RECEIVER[idx];
        }
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
        const dick = this.getPenetratorBodypart().rep(me, sex);
        const tip = this.getPenetratorBodypart().repTip(me, sex);
        const fuck = this.getPenetratorBodypart().repFuck(me, sex);
        const hole = this.getPenetrationTarget().rep(them, sex);
        const labia = this.getPenetrationTarget().repLabia(them, sex);
        const vaginal = this.getPenetrationTarget().repVaginal(them, sex);
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
        let t;
        if (mypace == setup.sexpace.sub || mypace == setup.sexpace.normal) {
            t = [
                `a|Eagerly sinking a|their ${dick} deep into b|reps ${hole}, a|rep a|start a|eagerly pumping it in and out, letting out a|a_moan with every thrust as a|they happily ${fuck} b|rep.`,
                `a|Eagerly pushing a|their ${dick} deep into b|reps ${hole}, a|rep a|eagerly a|start thrusting it in and out, letting out a|a_moan as a|they ${fuck} b|them.`,
                `Thrusting a|their ${dick} deep into b|reps ${hole}, a|rep a|let out a|a_moan as a|they a|start to a|eagerly pump it in and out, breathing in b|reps b|scent as a|they desperately ${fuck} b|them.`,
            ];
        }
        else if (mypace == setup.sexpace.dom) {
            t = [
                `Roughly slamming a|their ${dick} deep into b|reps ${hole}, a|rep a|start roughly pumping it in and out, letting out a|a_moan with every thrust as a|they brutally ${fuck} b|rep.`,
                `Violently thrusting a|their ${dick} deep into b|reps ${hole}, a|rep a|start roughly thrusting it in and out, letting out a|a_moan as a|they forcefully ${fuck} b|them.`,
                `Forcefully driving a|their ${dick} deep into b|reps ${hole}, a|rep a|let out a|a_moan as a|they a|start to roughly slam it in and out, breathing in b|reps b|scent as a|they violently ${fuck} b|them.`,
                `In one fell thrust, a|rep a|drive a|their ${dick} all the way into b|reps ${hole}, using b|them as nothing but a fuck toy for a|their pleasure.`,
            ];
        }
        else {
            const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex);
            t = [
                `Sinking a|their ${dick} into b|reps ${hole}, a|rep ${h} start pumping it in and out, letting out a|a_moan with every thrust as a|they hesitantly ${fuck} b|rep.`,
                `Pushing a|their ${dick} into b|reps ${hole}, a|rep ${h} start thrusting it in and out, letting out a|a_moan as a|they fearfully ${fuck} b|them.`,
                `Thrusting a|their ${dick} into b|reps ${hole}, a|rep a|let out a|a_moan as a|they ${h} start to pump it in and out, involuntarily breathing in b|reps b|scent as a|they ${fuck} b|them.`
            ];
        }
        story += setup.rng.choice(t);
        story += ' ';
        if (theirpace == setup.sexpace.resist) {
            t = [
                ` Desperately trying, and failing, to pull away from a|reps ${dick}, b|rep b|let out b|a_sob, tears streaming down b|their b|face as b|they weakly b|beg for a|rep to pull out of b|their ${hole}.`,
                ` b|A_sob bursts out from between b|reps lips as b|they weakly b|try to push a|rep away, tears streaming down b|their b|face as b|they b|plead for a|them to pull out of b|their ${hole}.`,
                ` Sobbing in distress, and with tears running down b|their b|face, b|rep weakly b|struggle against a|rep, pleading and crying for a|them to pull out of b|their ${hole}.`
            ];
        }
        else if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
            t = [
                ` b|Rep b|eagerly b|buck b|their hips in response, letting out b|a_moan as b|they b|eagerly b|help to sink a|reps ${dick} deep into b|their ${hole}.`,
                ` b|A_moan bursts out from between b|reps lips, and, b|eagerly thrusting b|their hips back, b|they b|beg for a|rep to carry on ${fuck}ing b|them.`,
                ` Moaning in delight, b|rep b|eagerly b|thrust b|their hips back, b|eagerly begging for a|rep to continue ${fuck}ing b|them as b|their movements help to sink a|their ${dick} deep into b|their ${hole}.`
            ];
        }
        else if (theirpace == setup.sexpace.dom) {
            t = [
                ` b|Rep violently b|buck b|their hips in response, letting out b|a_moan as b|they roughly b|demand that a|rep a|continue fucking b|them.`,
                ` b|A_moan bursts out from between b|reps lips, and, roughly slamming b|their hips back, b|they b|order a|rep to carry on ${fuck}ing b|them.`,
                ` Moaning in delight, b|rep roughly b|slam b|their hips back, ordering a|rep to continue ${fuck}ing b|them as b|their movements force a|their ${dick} deep into b|their ${hole}.`,
            ];
        }
        else if (theirpace == setup.sexpace.mindbroken) {
            t = [
                setup.SexUtil.mindbrokenReactionNoun(them, sex, [
                    `the ${dick} shoved inside of b|them`,
                    `the ${vaginal} abuse`,
                    `the use of b|their ${hole}`,
                    `the ${dick} grazing in and out of b|them`,
                ])
            ];
        }
        else {
            const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex);
            t = [
                ` b|Rep ${h} buck b|their hips, letting out b|a_moan as b|they b|sink a|reps ${dick} deep into b|their ${hole}.`,
                ` b|A_moan bursts out from between b|reps lips, and, fearfully thrusting b|their hips back, b|they b|beg for a|rep to be gentle to b|them.`,
                ` b|rep ${h} push b|their hips back, begging for a|rep to be gentle.`
            ];
        }
        story += setup.rng.choice(t);
        story += ' ';
        story += phallusHoleSizeDifferenceOngoing(me, this.getPenetratorBodypart(), them, this.getPenetrationTarget(), sex);
        story += ' ';
        story += this.getPenetratorBodypart().repPenetrateFlavorSentence(me, them, this.getPenetrationTarget(), sex);
        story += ' ';
        return story;
    }
}
