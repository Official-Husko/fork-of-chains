// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
PenisBreasts.FUCKING_DOM_GENTLE
PenisBreasts.FUCKING_DOM_NORMAL
PenisBreasts.FUCKING_DOM_ROUGH
PenisBreasts.FUCKING_SUB_NORMAL
PenisBreasts.FUCKING_SUB_EAGER
*/
import { PenisBreastsDomBase } from "./PenisBreastsBase";
setup.SexActionClass.PenisBreastsDom = class PenisBreastsDom extends PenisBreastsDomBase {
    getTags() { return super.getTags().concat(['dom',]); }
    desc() { return 'Continue receiving titfuck / pecjob'; }
    getActorDescriptions() {
        return [
            {
                energy: setup.Sex.ENERGY_SMALL,
                arousal: setup.Sex.AROUSAL_SMALL,
                paces: [setup.sexpace.dom, setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.forced],
            },
            {
                energy: setup.Sex.ENERGY_MEDIUM,
                arousal: setup.Sex.AROUSAL_SMALL,
                paces: setup.SexPace.getAllPaces(),
            },
        ];
    }
    /**
     * Returns the title of this action, e.g., "Blowjob"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawTitle(sex) {
        const me = this.getActorUnit('a');
        const them = this.getActorUnit('b');
        const titfuck = setup.sexbodypart.breasts.repTitfuck(me, them);
        return `Receive ${titfuck}`;
    }
    /**
     * Short description of this action. E.g., "Put your breasts in their dick"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawDescription(sex) {
        return `Fuck b|reps b|breasts.`;
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
        const theirpose = sex.getPose(them);
        const theirpace = sex.getPace(them);
        const theirposition = sex.getPosition(them);
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
        let story = '';
        const titfuck = setup.sexbodypart.breasts.getTitfuck(me, them);
        let push = setup.sexbodypart.breasts.repPush(me, them);
        let t;
        if (mypace == setup.sexpace.forced) {
            t = [
                `Unsure what to do to please b|rep, a|rep decide to slide a|their a|dick between
         b|reps b|breasts, letting out a moan as a|they a|feel a|their dick squeezed tight by
         b|reps b|breasts.`,
                `Pushing a|their a|dick between the b|cleavage formed between b|reps
         b|breasts, a|rep mechanically thrust a|their hips forwards, letting
         out a little moan as a|they hope this is what b|rep b|want from a|them.`,
                `After a short pause, a|rep a|squeeze b|reps b|breasts together,
         before forcing a|themself to pump a|their hips back and forth, fucking b|their b|cleavage.`,
            ];
        }
        else if (mypace == setup.sexpace.dom) {
            t = [
                `Roughly slamming a|their a|dick between b|reps b|breasts, a|rep
         a|start violently bucking a|their hips back and forth, letting out
         a|a_moan with every thrust as a|they forcefully a|fuck b|their
         b|cleavage.`,
                `Violently pushing a|their a|dick between the b|cleavage formed between
         b|reps b|breasts, a|rep a|start roughly thrusting a|their hips
         forwards, letting out moans as a|they dominantly a|fuck b|their
         b|breasts.`,
                `Greedily squeezing b|reps b|breasts together, a|rep a|let out a|a_moan
         as a|they a|start to dominantly pump a|their hips back and forth,
         breathing in b|their b|scent as a|they roughly a|fuck b|their
         cleavage.`,
                `a|Rep forcefully a|press b|reps b|breasts together, which squeeze the dick
         trapped in the b|cleavage, eliciting a pleasant sensation for a|them.`,
            ];
        }
        else {
            t = [
                `Sliding a|their a|dick a|eagerly between b|reps b|breasts, a|rep a|start
         steadily bucking a|their hips back and forth, letting out a little moan
         with every thrust as a|they a|eagerly a|fuck b|their cleavage.`,
                `Pushing a|their a|dick between the b|cleavage formed between b|reps
         b|breasts, a|rep a|start a|eagerly thrusting a|their hips forwards, letting
         out a little moan as a|they a|eagerly a|fuck b|their b|breasts.`,
                `Squeezing b|reps b|breasts together, a|rep a|let out a little moan
         as a|they a|start to a|eagerly pump a|their hips back and forth, breathing
         in b|their b|scent as a|they a|eagerly a|fuck b|their b|cleavage.`,
                `a|Rep a|eagerly a|press b|reps b|breasts together, which squeeze the dick
         trapped in the b|cleavage, eliciting a pleasant sensation for a|them.`,
            ];
        }
        story += setup.rng.choice(t);
        story += ' ';
        push = setup.sexbodypart.breasts.repPush(me, them);
        const titfuck_type = setup.sexbodypart.breasts.getTitfuck(me, them);
        t = [];
        if (titfuck_type == setup.SexBodypartClass.Breasts.TITFUCK.titfuck) {
            if (them.isHasTrait('breast_large')) {
                t = [
                    `a|Reps dick slides up and down from inside b|reps cleavage, flanked by a pair of b|breasts.`,
                    `b|Reps b|breasts graze harmlessly along a|reps a|dick, which continues to slide up and down along the b|cleavage.`,
                    `b|Reps b|breasts occasionally grip the invading a|dick, giving it a powerful stimulation.`,
                ];
                if (them.isHasTrait('breast_huge')) {
                    t.push(`b|Reps pillowy breasts bounces occasionally as the dick continue to slide along its cleavage.`, `a|Reps dick barely poke out from within the pillowy mass of flesh.`, `b|Reps b|breasts are huge, providing great sensation on a|reps a|dick.`);
                }
            }
            else {
                t = [
                    t.push(`The dick slides almost harmlessly along the b|cleavage.`, `The b|cleavage is barely large enough to allow the dick to slide in a stable way.`, `b|Reps b|breasts are not large enough to allow a proper ${titfuck}.`)
                ];
            }
        }
        else if (titfuck_type == setup.SexBodypartClass.Breasts.TITFUCK.pecjob) {
            t = [
                `b|Reps b|breasts grip the invading phallus powerfully, stimulating it.`,
                `The muscles in b|reps chest grip the dick reflexively as b|they b|breathe.`,
                `b|Reps b|cleavage powerfully grip and stimulate the dick trapped inside.`,
            ];
        }
        else {
            throw new Error(`Unrecognized titfuck: ${titfuck}`);
        }
        story += setup.rng.choice(t);
        story += ' ';
        push = setup.sexbodypart.breasts.repPush(me, them);
        if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
            t = [
                ` b|Rep b|eagerly b|${push} b|their b|breasts together in response,
        letting out b|a_moan as b|they b|encourage a|rep to continue fucking
        b|their b|cleavage.`,
                ` b|A_moan bursts out from between b|reps lips, and, b|eagerly pushing
        b|their b|breasts together, b|they b|encourage
        a|rep to continue sliding a|their a|dick up and down between b|their
        b|cleavage.`,
                ` Moaning in delight, b|rep b|eagerly b|wrap b|their b|breasts around
        a|reps a|dick, before begging for a|them to continue fucking b|their
        b|breasts.`,
                ` b|Rep b|eagerly b|${push} b|their b|breasts together, squeezing a|reps a|dick that is
        trapped inside, b|eagerly stimulating it.`,
            ];
        }
        else if (theirpace == setup.sexpace.dom) {
            t = [
                ` b|Rep roughly b|${push} b|their b|breasts together in response,
          letting out b|a_moan as b|they b|order a|rep to continue fucking
          b|their b|cleavage.`,
                ` b|A_moan bursts out from between b|reps lips, and, forcefully
        pressing b|their b|breasts together, b|they b|order
        a|rep to continue thrusting a|their a|dick up and down between
        b|their b|cleavage.`,
                ` Moaning in delight, b|rep dominantly b|wrap b|their b|breasts
        around a|reps a|dick, before ordering a|them to continue fucking
        b|their b|breasts.`,
                ` b|Rep forcefully b|${push} b|their b|breasts tightly together, cruelly squeezing the a|dick
        trapped inside, giving it a mixture of pain and pleasure.`,
            ];
        }
        else if (theirpace == setup.sexpace.forced) {
            const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex);
            t = [
                ` b|Rep ${h} stay as still as possible while a|rep a|continue to use b|their b|breasts.`,
                ` b|Rep ${h} stimulate the dick trapped inside b|their b|cleavage by squeezing b|their b|breasts.`,
                ` b|Rep ${h} press b|their b|breasts together, stimulating the dick trapped inside.`,
            ];
        }
        else if (theirpace == setup.sexpace.resist) {
            t = [
                ` Desperately trying, and failing, to pull away b|their b|breasts from a|reps a|dick,
        b|rep b|let out b|a_sob, tears streaming down b|their b|face as
        b|they weakly b|beg for a|rep to leave b|their b|breasts alone.`,
                ` b|A_sob bursts out from between b|reps lips as b|they weakly b|try
        to push a|rep away, tears streaming down b|their b|face as b|they
        b|plead for a|them to leave b|their b|breasts alone.`,
                ` Sobbing in distress, and with tears running down b|their b|face,
        b|rep weakly b|struggle against a|rep, pleading and crying for a|them
        to get away from b|their b|breasts.`,
            ];
        }
        else if (theirpace == setup.sexpace.mindbroken) {
            t = [
                setup.SexUtil.mindbrokenReactionDespite(them, sex, [
                    `a|rep a|eagerly sliding a|their a|dick along b|their b|cleavage`,
                    `the ongoing ${titfuck}`,
                    `a|rep squeezing b|their b|breasts tight together`,
                ])
            ];
        }
        story += setup.rng.choice(t);
        story += ' ';
        return story;
    }
};
