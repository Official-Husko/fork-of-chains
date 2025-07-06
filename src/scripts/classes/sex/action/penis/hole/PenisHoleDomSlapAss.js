// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
DoggyStyle.SLAP_ASS
SadisticActions.SLAP_FACE
*/
import { PenisHoleDomBase } from "./PenisHoleBase";
export class PenisHoleDomSlapAss extends PenisHoleDomBase {
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_slap_ass'),
            setup.qres.SexBodypartsCanReach('a', setup.sexbodypart.arms, 'b', setup.sexbodypart.anus),
        ]);
    }
    getActorDescriptions() {
        return [
            {
                energy: setup.Sex.ENERGY_SMALL,
                arousal: setup.Sex.AROUSAL_MEDIUM,
                paces: [setup.sexpace.dom],
                restrictions: [
                    setup.qres.SexCanUseBodypart(setup.sexbodypart.arms),
                ],
            },
            {
                energy: setup.Sex.ENERGY_MEDIUMLARGE,
                arousal: setup.Sex.AROUSAL_SMALL,
                discomfort: setup.Sex.DISCOMFORT_MEDIUMLARGE,
                paces: setup.SexPace.getAllPaces(),
            },
        ];
    }
    rawTitle(sex) {
        return `Slap ass`;
    }
    /**
     * Short description of this action. E.g., "Put your mouth in their dick"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawDescription(sex) {
        const me = this.getActorUnit('a');
        const them = this.getActorUnit('b');
        const dick = this.getPenetratorBodypart().rep(me, sex);
        const hole = this.getPenetrationTarget().rep(them, sex);
        return `With your ${dick} still deep inside b|reps ${hole}, use your a|arms to slap b|their exposed b|ass.`;
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
        let t = [];
        t = [
            `Growling down into b|reps b|ears, a|rep a|reach and a|grab b|their b|waist,
       using one a|hand to hold b|them still, while using a|their other to `,
            `Hilting a|their ${dick} deep inside b|reps ${hole}, a|rep a|reach down and a|eagerly a|grope
       b|their b|ass, before starting to`,
            `Still ploughing away at b|their ${hole}, a|rep a|growl down that a|they a|is going to put b|rep in
       b|their place, before starting make good on a|their threat by starting to`,
            `While a|rep a|continue pounding away at b|reps ${hole}, a|they a|reach down and a|start to `,
            `With a|their ${dick} still inside b|reps ${hole} but wanting to put b|rep even more in b|their place, a|rep a|lift a|their a|hand, before swinging down to deliver a series of spanking to b|their b|ass.`,
            `Without pausing the fucking, a|rep a|lift a|their a|hand and a|swing down,
       delivering a sharp slap to b|reps b|ass in order to put b|them in b|their place.`,
            `Seeking to reinforce a|their control and a|remind b|rep who's in charge, a|rep a|raise a|their a|hand, before swiping down and delivering a series of sharp spanks to b|their b|ass.`
        ];
        if (them.getTail()) {
            t = t.concat([
                `Growling down into b|reps [npc2.ear], a|rep a|eagerly a|grab the base of b|their b|tail
        and a|yank it upwards, raising b|their b|ass up high in the air before starting to `,
                `a|Rep a|reach down and a|grab the base of b|reps b|tail,
        causing b|them to let out a surprised yelp as a|they a|eagerly a|yank upwards,
        forcing b|them to push b|their b|ass up high in the air as a|rep a|start to `,
                `Hilting a|their ${dick} deep inside b|reps ${hole}, a|rep a|eagerly a|grab the base of b|their b|tail and
         a|yank upwards, raising b|their b|ass up high in the air before starting to `,
                `Still ploughing away at b|their ${hole}, a|rep a|grab the base of b|reps b|tail in one a|hand, a|eagerly
         yanking b|their b|ass up high in the air before starting to`,
            ]);
        }
        story += setup.rng.choice(t) + ' ';
        t = [
            `a|eagerly a|slap b|their exposed cheeks.`,
            `a|eagerly a|deliver a series of stinging slaps to b|their exposed cheeks.`,
            `a|eagerly a|slap b|their b|ass.`,
            `a|eagerly a|deliver a series of spanks on b|their b|ass.`,
        ];
        story += setup.rng.choice(t) + ' ';
        if (them.isMasochistic()) {
            t = [
                setup.SexUtil.masochistReaction(me, them, [
                    `being spanked`,
                    `being simultaneously spanked and penetrated`,
                    `having b|their ass slapped`,
                ], sex)
            ];
        }
        else if ([setup.sexpace.forced, setup.sexpace.resist].includes(theirpace)) {
            t = [
                ` A protesting yelp escapes from b|reps b|mouth at the moment of contact,
          ${me.isYou() ?
                    ` which is precisely the reaction you were looking for.` :
                    ` and from the wicked grin that settles on a|reps face, this was just the reaction
              a|they a|is looking for.`}`,
                ` The pained squeal which immediately escapes from b|reps b|mouth is exactly what
          a|rep a|is looking for, and a|rep can't help but grin as a|they a|see tears well up in
          ${them.isYou() ?
                    `your eyes` :
                    `a|their submissive bitch's b|eyes`}`,
                ` After letting out a shocked cry, tears start to well up in b|reps b|eyes,
          letting a|rep know that a|their abuse is having the exact effect a|rep a|is looking for.`,
                ` a|Rep a|growl down that a|they a|is going to put b|rep in b|their place, before starting to
          aggressively slap b|their b|ass, smirking down at b|their submissive form as b|they
          squeals and cries out beneath a|their relentless blows.`,
            ];
        }
        else if (theirpace == setup.sexpace.mindbroken) {
            t = [
                setup.SexUtil.mindbrokenReactionNoun(them, sex, [
                    `the spanking`,
                    `the abuse inflicted on b|their b|ass`,
                    `the rough treatment`,
                    `a|reps spanks`,
                ])
            ];
        }
        else {
            let w;
            if (theirpace == setup.sexpace.sub) {
                w = [
                    `submissive squeal`,
                    `pained squeal`,
                    `shocked cry`,
                    `startled wail`,
                    `moan`,
                ];
            }
            else {
                w = [
                    `protesting shout`,
                    `pained exclamation`,
                    `groan`,
                    `angry squeal`,
                ];
            }
            w = setup.rng.choice(w);
            t = [
                ` ${setup.Article(w, true)} escapes from b|reps b|mouth at the moment of contact,
          ${me.isYou() ?
                    `which is precisely the reaction you were looking for.` :
                    `and from the wicked grin that settles on a|reps face, this was just the reaction a|rep a|is looking for.`}`,
                ` The ${w} which immediately escapes from b|reps b|mouth is exactly what a|rep a|is looking for, and
          a|they can't help but grin as a|they a|see the shocked look in
          b|reps eyes`,
                ` b|Rep immediately b|let out ${setup.Article(w)}, revealing to a|rep that a|their abuse is having the exact effect a|they a|is looking for.`,
                ` b|Rep b|let out ${setup.Article(w)} as a|rep a|start roughly slapping b|their b|ass, and a|rep a|find a|themself grinning in glee as a|they a|watch b|them squirm beneath a|their stinging blows.`,
            ];
        }
        story += setup.rng.choice(t) + ' ';
        return story;
    }
}
