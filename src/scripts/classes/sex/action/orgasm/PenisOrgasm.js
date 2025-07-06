// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
GenericOrgasms.getGenericPenisOrgasmDescription
DoggyStyle.DOGGY_DOMINANT_ORGASM
*/
import { PenisOrgasmBase } from "./PenisOrgasmBase";
import { orgasmPositionPreparation, getCumQuantityDescription } from "./util";
export class PenisOrgasm extends PenisOrgasmBase {
    /**
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    postOrgasm(sex) {
        return ``;
    }
    /**
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    describeOrgasm(sex) {
        // by default, masturbate.
        const me = this.getActorUnit('a');
        let story = '';
        if (me.isHasTrait('dick_demon')) {
            story += `a|They a|reach down and a|slide a|their a|hand up and down over a|their sensitive little barbs.`;
        }
        else if (me.isHasTrait('dick_werewolf')) {
            story += `a|They a|reach down and a|start to furiously masturbate; a|their a|hand sliding down the length of a|their a|dick to grip and rub at a|their swollen knot.`;
        }
        else if (me.isHasTrait('dick_dragonkin')) {
            story += `a|They a|reach down and a|slide a|their a|hand up and down over the bumpy ribs that line a|their a|dick.`;
        }
        else {
            story += `a|They a|reach down and a|start to furiously masturbate; a|their a|hand running up the length of a|their a|dick to rub and tease a|their cock head.`;
        }
        return story;
    }
    /**
     * Returns the title of this action, e.g., "Blowjob"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawTitle(sex) {
        return `Masturbate`;
    }
    /**
     * Short description of this action. E.g., "Put your mouth in their dick"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawDescription(sex) {
        return `You've reached your climax, and can't hold back your orgasm any longer. Time to masturbate the cum out.`;
    }
    /**
     * Returns a string telling a story about this action to be given to the player
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawStory(sex) {
        const me = this.getActorUnit('a');
        const mbody = setup.sexbodypart.penis;
        const mpace = sex.getPace(me);
        let story = '';
        story += orgasmPositionPreparation(me, mbody, sex);
        story += ' ';
        const modifiers = [];
        // if not cum inside
        if (me.isHasTrait('dick_werewolf')) {
            story += setup.rng.choice([
                `The thick knot at the base of a|reps a|dick swells up, and a|they a|feel a|their a|balls tightening as a|they a|start to cum.`,
                `a|Reps a|balls tightens, and with their thick knot forming a|they can feel the cum starting to gush out.`
            ]);
        }
        else {
            story += setup.rng.choice([
                ` a|Reps a|dick twitches, and a|they a|feel a|their a|balls tightening as a|they a|start to cum.`,
            ]);
        }
        story += ' ';
        story += this.describeOrgasm(sex);
        /*
                    case THIGHS:
                        genericOrgasmSB.append(` a|Rep a|continue thrusting a|their a|dick between b|reps thighs, letting out a|a_moan as a|they a|feel it start to twitch.`);
                        
                        for(PenetrationModifier mod : PenetrationModifier.values()) {
                            switch(mod) {
                                case BARBED:
                                    if(characterOrgasming.hasPenisModifier(mod)) {
                                        modifiers.add(` a|their movements cause the barbs lining the sides of a|their a|dick to rake against b|reps b|legs, causing b|them to let out b|a_moan.`);
                                    }
                                    break;
                                case BLUNT:
                                    break;
                                case FLARED:
                                    if(characterOrgasming.hasPenisModifier(mod)) {
                                        modifiers.add(` a|their flared head swells up, causing b|reps b|legs to be parted ever wider, which in turn causes b|them to let out b|a_moan.`);
                                    }
                                    break;
                                case KNOTTED:
                                    if(characterOrgasming.hasPenisModifier(mod)) {
                                        modifiers.add(` a|their fat knot swells up, and with each thrust, bumps wildly against b|reps b|legs, which in turn causes b|them to let out b|a_moan.`);
                                    }
                                    break;
                                case PREHENSILE:
                                    if(characterOrgasming.hasPenisModifier(mod)) {
                                        modifiers.add(` Harnessing the ability of a|their prehensile cock, a|rep bends it around b|reps b|legs on each thrust, which in turn causes b|them to let out b|a_moan.`);
                                    }
                                    break;
                                case RIBBED:
                                    if(characterOrgasming.hasPenisModifier(mod)) {
                                        modifiers.add(` a|their ribbed shaft repeatedly bumps against b|reps b|legs on every thrust, which in turn causes b|them to let out b|a_moan.`);
                                    }
                                    break;
                                case SHEATHED:
                                    break;
                                case TAPERED:
                                    break;
                                case TENTACLED:
                                    if(characterOrgasming.hasPenisModifier(mod)) {
                                        modifiers.add(` The little tentacles lining a|their shaft wriggle against and massage b|reps b|legs on every thrust, which in turn causes b|them to let out b|a_moan.`);
                                    }
                                    break;
                                case VEINY:
                                    break;
                            }
                        }
                        break;
                }
                
            } else {
                switch((SexAreaPenetration)contactingArea) {
                    case CLIT:
                        break;
                    case FINGER:
                        genericOrgasmSB.append(` a|Rep a|continue thrusting a|their a|dick into b|reps b|hand, letting out a|a_moan as a|they a|feel it start to twitch.`);
                        
                        for(PenetrationModifier mod : PenetrationModifier.values()) {
                            switch(mod) {
                                case BARBED:
                                    if(characterOrgasming.hasPenisModifier(mod)) {
                                        modifiers.add(` a|their movements cause the barbs lining the sides of a|their a|dick to rake against b|reps fingers, causing b|them to let out b|a_moan.`);
                                    }
                                    break;
                                case BLUNT:
                                    break;
                                case FLARED:
                                    if(characterOrgasming.hasPenisModifier(mod)) {
                                        modifiers.add(` a|their flared head swells up, causing b|reps fingers to be parted ever wider, which in turn causes b|them to let out b|a_moan.`);
                                    }
                                    break;
                                case KNOTTED:
                                    if(characterOrgasming.hasPenisModifier(mod)) {
                                        modifiers.add(` a|their fat knot swells up, and with each thrust, bumps wildly against b|reps fingers, which in turn causes b|them to let out b|a_moan.`);
                                    }
                                    break;
                                case PREHENSILE:
                                    if(characterOrgasming.hasPenisModifier(mod)) {
                                        modifiers.add(` Harnessing the ability of a|their prehensile cock, a|rep bends it around b|reps fingers on each thrust, which in turn causes b|them to let out b|a_moan.`);
                                    }
                                    break;
                                case RIBBED:
                                    if(characterOrgasming.hasPenisModifier(mod)) {
                                        modifiers.add(` a|their ribbed shaft repeatedly bumps against b|reps fingers on every thrust, which in turn causes b|them to let out b|a_moan.`);
                                    }
                                    break;
                                case SHEATHED:
                                    break;
                                case TAPERED:
                                    break;
                                case TENTACLED:
                                    if(characterOrgasming.hasPenisModifier(mod)) {
                                        modifiers.add(` The little tentacles lining a|their shaft wriggle against and massage b|reps fingers on every thrust, which in turn causes b|them to let out b|a_moan.`);
                                    }
                                    break;
                                case VEINY:
                                    break;
                            }
                        }
                        break;
                    case PENIS:
                        break;
                    case TAIL:
                        break;
                    case TENTACLE:
                        break;
                    case FOOT://TODO modifiers
                        if(Sex.isDoubleFootJob(characterTargeted)) {
                            genericOrgasmSB.append(` a|Rep a|continue thrusting a|their a|dick between b|reps b|feet, letting out a|a_moan as a|they a|feel it start to twitch.`);
                        } else {
                            genericOrgasmSB.append(` a|Rep a|continue rubbing a|their a|dick against b|reps b|foot, letting out a|a_moan as a|they a|feel it start to twitch.`);
                        }
                        break;
                    case TONGUE:
                        break;
                }
            }
        }
        */
        let t = [
            `As a|their a|balls tense up,`,
            `a|Their a|balls tensing up,`,
            `Feeling a|their a|balls tense up and no longer able to hold back,`,
            `Losing control, a|they a|feel a|their a|balls emptying,`,
        ];
        story += ' ' + setup.rng.choice(t) + ' ';
        story += getCumQuantityDescription(me, sex);
        if (me.isHasBalls()) {
            const pants = sex.getCoveringEquipment(me, mbody);
            if (pants) {
                // cum to pants case
                story += ` into a|their ${pants.rep()}.`;
            }
            else {
                story += this.cumTargetDescription(sex);
            }
        }
        if (me.isHasTrait('dick_werewolf') && sex.getBodypartPenetrationTarget(me, mbody)) {
            story += setup.rng.choice([
                ` Even after a|reps a|balls have pumped their entire load into b|rep, a|their knot remains swollen, locking ${me.isYou() ? 'the two of you together' : 'a|them and a|their partner together'}.
				It takes a few minutes for it to start to deflate, and with a wet pop, a|they a|is finally able to pull a|their a|dick free. `,
                ` Even after a|reps a|balls have been fully emptied into b|rep, a|their knot locks a|them together in place with b|rep.
				It takes several minutes until the knot begins to deflate, and finally a|rep a|is able to pull a|their a|dick free from b|rep with a loud pop. `,
            ]);
        }
        story += ' ' + this.postOrgasm(sex) + ' ';
        return setup.SexUtil.convert(story, { a: me }, sex);
    }
    /**
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    cumTargetDescription(sex) {
        let story = '';
        const unit = this.getActorUnit('a');
        // By default, cum into the location.
        const location = sex.getLocation();
        const floor = location.repSurface(sex);
        return setup.SexUtil.convert([
            ` out all over the ${floor}.`,
            ` messily over the ${floor}.`,
            ` into the ${floor}.`,
        ], { a: unit }, sex);
    }
}
