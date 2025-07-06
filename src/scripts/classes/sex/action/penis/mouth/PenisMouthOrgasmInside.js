// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
GenericOrgasms
*/
import { titanicBallsCumNotStoppingSentence } from "../util";
import { PenisMouthOrgasmBase } from "./PenisMouthOrgasmBase";
setup.SexActionClass.PenisMouthOrgasmInside = class PenisMouthOrgasmInside extends PenisMouthOrgasmBase {
    getTags() { return super.getTags().concat(['normal',]); }
    desc() { return 'Cum inside mouth'; }
    /**
     * Returns the title of this action, e.g., "Blowjob"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawTitle(sex) {
        return `Cum down b|reps throat`;
    }
    /**
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    describeOrgasm(sex) {
        const me = this.getActorUnit('a');
        const them = this.getActorUnit('b');
        let story = '';
        let t;
        let fully = '';
        let entire = '';
        let throat = 'mouth';
        let downtheirthroat = 'in b|their mouth';
        let deep = '';
        let deepthroat = 'swallow';
        if (sex.getPace(me) == setup.sexpace.dom) {
            fully = setup.rng.choice([
                'fully',
                'entirely',
            ]);
            entire = setup.rng.choice([
                `entire`,
                `full`,
            ]);
            throat = 'throat';
            downtheirthroat = 'down b|reps throat';
            deepthroat = `deep-throat`;
            deep = 'deep';
        }
        if (me.isHasTrait('dick_werewolf')) {
            t = [
                ` a|Rep a|push ${fully} forwards, ramming the knot at the base of a|their a|dick against b|reps lips. It's already started to swell up so much that a|they a|don't manage to get it into b|reps b|mouth on the first thrust, but, after pulling back and slamming a|their hips forwards, a|they a|succeed in pushing the thick knot past b|their lips.
        The moment a|they a|feel it pop inside, a|rep a|let out a|a_moan, and as a|they a|press a|their groin firmly against b|reps b|face, a|their knot fully expands and locks a|their a|dick ${downtheirthroat}.`,
                ` As a|rep a|feel a|their knot swelling, a|they a|ram ${fully} forwards, trying to fit the entire swelled-up thing inside b|reps b|mouth. It took several deliberate thrusts, but in one fell thrust, a|they a|succeed in pushing the swollen knot past b|their lips and into b|their b|mouth.
        a|They a|press a|their groin firmly against b|reps b|face as a|they a|feel a|their knot pops inside of b|rep, fulling expanding and locking the member ${downtheirthroat}.`,
            ];
        }
        else {
            t = [
                ` Ramming a|their a|dick ${deep} ${downtheirthroat},
          a|rep a|let out a|a_moan as a|they a|feel it starts to twitch inside of b|them.`,
                ` As a|rep a|feel a|their a|dick starting to twitch, a|they a|pick up the pace and slam a|their a|dick ${downtheirthroat}.`,
            ];
        }
        story += setup.rng.choice(t) + ' ';
        t = [];
        if (me.isHasTrait('dick_demon')) {
            t = [
                `a|They a|continue to make small, thrusting movements, raking a|their barbs back against the lining of b|their throat and causing b|them to let out a choking moan.`,
                `a|They a|keep making small, deliberate thrusting movements, all while making sure that a|their barbs touch and graze the inner walls of b|their b|throat, eliciting a choked moan.`,
            ];
        }
        else if (me.isHasTrait('dick_dragonkin')) {
            if (me.isYou()) {
                t = [
                    ` You feel your ribbed a|dick bumping against the lining of b|their throat, which causes b|them to let out a muffled moan.`,
                ];
            }
            else {
                t = [
                    ` The ribbed length of a|reps a|dick bumps against the lining of b|reps throat, which causes b|them to let out a muffled moan.`,
                ];
            }
            t.push(`a|Rep can a|feel the ridges of a|their a|dick bumping and hitting the inner walls of b|their b|mouth, eliciting
        a muffled moan from b|them.`);
        }
        if (t.length) {
            story += setup.rng.choice(t) + ' ';
        }
        story += ' ';
        t = [];
        if (me.isHasTrait('dick_werewolf')) {
            t = [
                ` Keeping a|their hips pushed tightly against b|reps b|face, a|rep lets out a|a_moan as
        a|their knot swells up to its full size. a|They then a|buck back a little, and b|they let out a very
        muffled cry as b|they b|is pulled along with a|them; evidence that a|their a|dick is now firmly locked
        inside b|their b|mouth.`,
                ` a|Rep a|let out a moan as a|they a|start to feel their knot growing to full size. Before long,
        b|Rep b|let out a very muffled cry as b|they b|is stuck, and is pulled around whenever a|rep a|move;
        proof that a|reps a|dick is now fully locked inside b|their b|mouth.`,
            ];
        }
        if (t.length) {
            story += setup.rng.choice(t) + ' ';
        }
        return story;
    }
    /**
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    cumTargetDescription(sex) {
        const me = this.getActorUnit('a');
        const them = this.getActorUnit('b');
        let story = '';
        let t;
        t = [
            ` deep down b|their throat, and b|they b|find b|themself making muffled whining noises as b|they
        b|feel the cum sliding down into b|their stomach.`,
            ` into b|their tongue before entering b|their stomach, eliciting muffled whining noises as b|they
        a|get a taste of a|reps still warm cum.`,
        ];
        story += setup.rng.choice(t) + ' ';
        story += setup.rng.choice([
            ` The salty taste of cum rises up to hit b|their tongue, and b|they `,
            ` As b|they b|feel the salty taste of cum hitting b|their tastebuds, b|they `,
        ]);
        if (them.getMainTraining().getTags().includes('troral')) {
            story += setup.rng.choice([`greedily`, `hungrily`]);
            story += ' ';
        }
        else if (them.isObedient()) {
            story += setup.rng.choice([`obediently`, `submissively`]);
        }
        else {
            story += setup.rng.choice([
                `b|is left with no other option but to`,
                `b|is offered no choice but to`,
            ]);
        }
        story += setup.rng.choice([
            ` gulp down as much of the cum as b|they possibly can.`,
            ` drink down the cum as much as b|they possibly can.`,
        ]);
        story += ' ';
        if (me.isHasTrait('balls_titanic')) {
            const w = titanicBallsCumNotStoppingSentence(me, them, sex);
            story += setup.rng.choice([
                ` ${w}, b|rep b|realise that a|rep a|is not even close to stopping, and as
        a|their cum backs up and starts drooling out of the corners of b|their mouth,
        b|they b|let out a desperate, muffled moan. a|Rep a|keep a|their a|dick hilted deep
        down b|their throat, moaning as a|they a|wait for a|their a|balls to run dry.`,
                ` ${w}, and as the plentiful cum starts to back up from b|their throat
        into b|their mouth, b|they b|let out a frantic, muffled moan. Ignoring the pleas,
        a|Rep a|maintain a|their a|dick deep down b|their throat, moaning as |they can feel it steadily
        gushing down cum and filling b|reps stomach with a|their seed, until it eventually runs dry.`,
            ]);
            story += ' ';
        }
        return story;
    }
};
