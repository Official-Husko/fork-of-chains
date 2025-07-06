// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA : BLOWJOB_END */
import { PenisHoleEnd } from "../hole/PenisHoleEnd";
/**
 * @param {setup.Unit} me
 * @param {setup.Unit} them
 * @param {setup.SexInstance} sex
 * @return {string | string[]}
 */
export function getPenisMouthEndText(me, them, sex) {
    const mypace = sex.getPace(me);
    const mypose = sex.getPose(me);
    const myposition = sex.getPosition(me);
    const theirpace = sex.getPace(them);
    let story = '';
    let t;
    if (mypose.getFacingHeight(setup.sexbodypart.penis, myposition, sex).facing.isUpDown()) {
        // up or down pose
        t = [
            `Using a|their knees to lift a|themself up, a|rep a|allow a|their a|dick to slide up and out of b|reps mouth. A slimy strand of saliva links b|reps lips to the cock head of a|their a|dick for a brief moment, before breaking to fall down over b|their face.`
        ];
    }
    else {
        // forward
        if (mypace == setup.sexpace.dom) {
            t = [
                `Roughly slamming a|their a|dick deep down b|reps throat one last time, a|rep then b|pull a|their hips back, grinning as b|rep b|splutter and b|gasp for air.`,
                `Slamming a|their hips into b|reps b|face, a|rep forces a|their a|dick deep down b|their throat, before pulling completely back and out of b|their mouth.`,
                `Slamming and pressing a|their groin to b|reps b|face, a|rep a|receive one last throat fuck from b|rep before
        pulling out completely from the now-gaping mouth.`,
            ];
        }
        else {
            t = [
                `a|Eagerly sliding a|their a|dick out of b|reps mouth, a|rep a|let out a|a_moan as a|they puts an end to the blowjob.`,
                `With a|a_moan, a|rep a|pull a|their hips back, a|eagerly sliding a|their a|dick fully out of b|reps mouth.`
            ];
        }
    }
    story += setup.rng.choice(t);
    const afterwards = setup.SexUtil.afterPenetrationReactionDom(me, them, [
        'a|rep a|withdraw from b|their mouth',
        'b|their b|mouth is finally freed',
        'a|rep a|unclog their a|dick from b|their mouth',
        'a|their a|dick is unlodged from b|their throat',
    ], [
        'continue sucking on a|their a|dick',
        'continue sucking a|reps a|dick',
        'have the dick lodged back in b|their mouth',
        'taste more of a|reps a|dick',
        'choke more on a|resp a"dick',
    ], sex);
    story += ' ' + afterwards;
    return setup.SexUtil.convert(story, { a: me, b: them }, sex);
}
setup.SexActionClass.PenisMouthEnd = class PenisMouthEnd extends PenisHoleEnd {
    getTags() { return super.getTags().concat(['normal',]); }
    /**
     * @returns {setup.SexBodypart}
     */
    getPenetrationTarget() {
        return setup.sexbodypart.mouth;
    }
    rawTitle(sex) {
        return `Stop receiving blowjob`;
    }
    rawDescription(sex) {
        return `Pull your a|dick out of b|reps mouth and stop receiving a blowjob from b|them.`;
    }
    rawStory(sex) {
        const me = this.getActorUnit('a');
        const them = this.getActorUnit('b');
        return getPenisMouthEndText(me, them, sex);
    }
};
