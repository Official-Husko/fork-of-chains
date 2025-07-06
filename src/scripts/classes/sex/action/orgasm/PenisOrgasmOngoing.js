// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
GenericOrgasms
DoggyStyle.DOGGY_DOMINANT_ORGASM
*/
import { titanicBallsCumNotStoppingSentence } from "../penis/util";
import { PenisOrgasm } from "./PenisOrgasm";
export class PenisOrgasmOngoing extends PenisOrgasm {
    getTags() { return super.getTags().concat([this.getPenetrationTarget().getTag(),]); }
    /**
     * @returns {setup.SexBodypart}
     */
    getPenetratorBodypart() {
        return setup.sexbodypart.penis;
    }
    /**
     * @returns {setup.SexBodypart}
     */
    getPenetrationTarget() {
        return setup.sexbodypart.mouth;
    }
    /**
     * Get additional restrictions with this sex actions
     * @returns {setup.Restriction[]}
     */
    getRestrictions() {
        return [
            setup.qres.SexIsOngoing('a', this.getPenetratorBodypart(), 'b', this.getPenetrationTarget())
        ];
    }
    /**
     * @returns {ActorDescription[]}
     */
    getActorDescriptions() {
        const desc = super.getActorDescriptions();
        // add the target as an actor for convenience
        desc.push({
            paces: setup.SexPace.getAllPaces(),
            restrictions: [],
        });
        return desc;
    }
    /**
     * Returns a string telling a story about this action to be given to the player
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawStory(sex) {
        let base = super.rawStory(sex);
        base += ' ';
        // describe cumming inside lover
        const me = this.getActorUnit('a');
        const them = this.getActorUnit('b');
        if (me.getLover() == them) {
            base += setup.rng.choice([
                `Cumming inside a|their lover brings much joy to a|rep.`,
                `b|Rep enjoys the feeling of having a|their lover's seed contained inside b|them.`,
                `As a|rep and b|rep are lovers, having one cum inside another just feels right to
          ${me.isYou() || them.isYou() ? 'you' : 'them'}.`,
            ]);
        }
        return base;
    }
    /**
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    describeOrgasm(sex) {
        const me = this.getActorUnit('a');
        const mypace = sex.getPace(me);
        const them = this.getActorUnit('b');
        const theirpace = sex.getPace(them);
        const myposition = sex.getPosition(me);
        const theirposition = sex.getPosition(them);
        const theirpose = sex.getPose(them);
        let story = '';
        const orifice = this.getPenetrationTarget().rep(them, sex);
        const floor = sex.getLocation().repSurface(sex);
        let t;
        if (me.isHasTrait('dick_werewolf')) {
            t = [
                ` Pushing forwards, a|rep a|ram the now-fully swollen knot at the base of a|their a|dick against b|reps ${orifice}.
        By now it's so engorged that it seems almost impossible to push it inside,
        but with a determined moan, a|rep violently a|thrust forwards, and with an accompanying cry
        from b|rep, a|they a|manage to force a|their fat knot into b|reps ${orifice}.`
            ];
        }
        else {
            t = [
                ` Ramming a|their a|dick deep into b|reps ${orifice}, a|rep a|let out a|a_moan as it starts to twitch inside of b|them.`,
            ];
        }
        story += setup.rng.choice(t);
        story += ' ';
        let modifiers = [];
        if (me.isHasTrait('dick_demon')) {
            modifiers.push(` a|Rep a|continue to make small, thrusting movements, raking a|their barbs back against the inner walls of b|reps ${orifice} and causing b|them to let out b|a_moan.`);
        }
        else if (me.isHasTrait('dick_dragonkin')) {
            if (me.isYou()) {
                modifiers.push(` You feel your ribbed a|dick bumping against the inner walls of b|their ${orifice}, which causes b|them to let out b|a_moan.`);
            }
            else {
                modifiers.push(` The ribbed length of a|reps a|dick bumps against the inner walls of b|reps ${orifice}, which causes b|them to let out b|a_moan.`);
            }
        }
        if (mypace == setup.sexpace.dom && theirpace != setup.sexpace.dom) {
            const floortrigger = (theirposition == setup.sexposition.center &&
                (!sex.getUnitAtPosition(setup.sexposition.top) || myposition == setup.sexposition.top) &&
                theirpose.isOnFloor());
            let text = `As a|rep a|feel b|reps ${orifice} squeezing down around a|their a|dick,
        a|they a|decide to show b|them how
        ${me.isHasTrait('race_wolfkin') ?
                ` an alpha treats their submissive little beta.` :
                ` a real dom treats their submissive bitch.`}
        Letting out a|a_moan, a|rep a|slam a|their a|dick deep into b|reps ${orifice},
        grinning devilishly as b|they b|let out b|a_moan. `;
            if (floortrigger) {
                text += `
          Reaching down, a|they then a|grab b|reps shoulders,
          before pushing a|their weight down onto b|their b|body as a|they roughly b|mount b|them.
          With a|reps weight now on top of b|them, b|rep b|collapses to the ${floor} with b|a_moan.
          Bending down, and with
        `;
            }
            else {
                text += ` With `;
            }
            text += `
        a|their throbbing a|dick still hilted in b|reps ${orifice},
        a|rep a|growl menacingly in b|their ear${sex.isCanTalk(me) ?
                `, "You little bitch! All you're good for is being my slutty cock-sleeve!"` :
                `.`}
        Upon hearing those degrading words, b|Rep b|let out another moan,
        which is enough to send a|rep over the edge. `;
            if (floortrigger) {
                text += `
        As a|they a|grind b|reps b|face into the ${floor},
        a|they can a|feel a|their climax reaching.`;
            }
            modifiers.push(text);
        }
        if (modifiers.length) {
            story += setup.rng.choice(modifiers);
            story += ' ';
        }
        if (me.isHasTrait('dick_werewolf')) {
            story += ` Keeping a|their hips pushed tightly against b|reps ${orifice}, a|rep a|let out a|a_moan as a|their knot swells up to its full size. a|They then a|buck back a little, and b|rep b|let out a startled cry as b|they a|is pulled along with a|them; evidence that a|their a|dick is now firmly
			locked inside b|their ${orifice}.`;
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
        const hole = this.getPenetrationTarget().rep(them, sex);
        let t;
        if (them.isYou()) {
            t = [
                ` deep into your hungry ${hole}, and you find yourself whining and moaning as you feel the cum deep inside of you.`,
                ` deep into your ${hole}, and you can feel the cum moving inside your stomach.`,
            ];
        }
        else {
            t = [
                ` deep into b|reps ${hole}.`,
                ` inside b|reps ${hole}.`,
            ];
        }
        story += setup.rng.choice(t);
        story += ' ';
        if (me.isHasTrait('balls_titanic')) {
            const w = titanicBallsCumNotStoppingSentence(me, them, sex);
            t = [
                ` ${w},
         and as a|their cum backs up and starts leaking out of b|their ${hole},
         b|they b|let out b|a_moan.
         a|Rep a|keep a|their a|dick hilted deep in b|their ${hole}, moaning
         as a|they a|wait for a|their a|balls to run dry.`,
                ` ${w},
         and as a|their warm cum starts to fill b|their ${hole} full and leaking out,
         b|they b|let out b|a_moan.
         a|Rep a|eagerly a|keep a|their a|dick deep within b|their ${hole}, ensuring that
         a|their massive amount of cum are all absorbed into b|them.`,
            ];
            story += setup.rng.choice(t) + ' ';
        }
        return story;
    }
    /**
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    postOrgasm(sex) {
        const me = this.getActorUnit('a');
        const mypace = sex.getPace(me);
        const mypose = sex.getPose(me);
        const them = this.getActorUnit('b');
        const theirpace = sex.getPace(them);
        const myposition = sex.getPosition(me);
        const theirposition = sex.getPosition(them);
        const theirpose = sex.getPose(them);
        let story = '';
        const orifice = this.getPenetrationTarget().rep(them, sex);
        const floor = sex.getLocation().repSurface(sex);
        if (mypace == setup.sexpace.dom && theirpace != setup.sexpace.dom) {
            story += setup.rng.choice([
                `As a|rep a|slide a|their still-throbbing shaft out from b|reps well-used ${orifice},
         a|they a|look at b|them, grinning at the mess a|they made of b|them.`,
                `Sliding a|their still-hard member out from b|reps well-used ${orifice},
         a|rep a|look at b|them, grinning at the cum splattered over b|their b|face.`,
            ]) + ' ';
            if (Math.random() < 0.5 &&
                sex.isCanUse(them, setup.sexbodypart.mouth) &&
                sex.isCanUse(me, setup.sexbodypart.arms) &&
                sex.isCanUse(me, setup.sexbodypart.legs) &&
                myposition != setup.sexposition.center &&
                (mypose.getFacingHeight(this.getPenetratorBodypart(), myposition, sex).height ==
                    theirpose.getFacingHeight(this.getPenetrationTarget(), theirposition, sex).height)) {
                story += setup.rng.choice([
                    `Panting heavily, a|rep suddenly
           a|have an evil idea, and a|shuffle around to where b|reps face is. Reaching down, a|they roughly a|grab
           b|reps b|neck, and before b|they b|have a chance to react,
           a|they a|shove b|their b|face onto a|their a|dick.`,
                    `Looking at the submissive slut gave a|rep a sudden brilliant idea.
           Shuffling around to where b|reps face is, a|rep a|reach into the face before suddenly yanking
           b|reps b|neck and shoving a|their dirty a|dick straight into b|their b|mouth.`,
                ]) + ' ';
                story += setup.rng.choice([
                    `b|Rep b|moan and b|squirm as a|rep a|give b|them a taste of b|their own ${orifice},
           and, holding b|them tightly in position, a|they a|groan as b|their frantic tongue cleans a|them off.`,
                    `b|Rep b|moan and b|squirm as b|they can b|taste the remnants of b|their own ${orifice}.
           Not allowing b|rep any movement, a|they a|let out a moan of pleasure as a|they can feel b|rep frantically working b|their tongue to clean a|them off.`
                ]) + ' ';
                story += setup.rng.choice([
                    `After a long minute of having b|rep b|clean a|their a|dick, a|rep finally allow b|reps b|mouth to be free from a|their a|dick, and with a deep gasp, b|rep b|collapse onto the ${floor}, completely spent from the rough treatment.`,
                    `After a minute of using b|rep in this manner, a|rep finally a|release b|them, and, with a deep gasp,
          b|they b|collapse to the ${floor}, completely exhausted from the dominant treatment.`,
                ]) + ' ';
            }
        }
        return story;
    }
}
