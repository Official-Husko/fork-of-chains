// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA: COCK_SLAP */
import { PenisMouthDomBase } from "./PenisMouthBase";
setup.SexActionClass.PenisMouthDomCockSlap = class PenisMouthDomCockSlap extends PenisMouthDomBase {
    getTags() { return super.getTags().concat(['dom', 'discomfort',]); }
    desc() { return 'Cock slap'; }
    getActorDescriptions() {
        return [
            {
                energy: setup.Sex.ENERGY_MEDIUM,
                arousal: setup.Sex.AROUSAL_MEDIUMLARGE,
                paces: [setup.sexpace.dom],
                restrictions: [
                    setup.qres.IsCanPhysicallyCum(),
                    setup.qres.SexCanUseBodypart(setup.sexbodypart.arms),
                    setup.qres.SexPaceIn([setup.sexpace.dom, setup.sexpace.normal])
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
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_cockaction'),
        ]);
    }
    /**
     * Returns the title of this action, e.g., "Blowjob"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawTitle(sex) {
        return 'Cock slap';
    }
    /**
     * Short description of this action. E.g., "Put your mouth in their dick"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawDescription(sex) {
        return "Pull your a|dick out of b|their mouth and slap b|their b|face with it.";
    }
    /**
     * Returns a string telling a story about this action to be given to the player
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawStory(sex) {
        const unit = this.getActorUnit('a');
        const pre = setup.SexText.preThought(unit, sex);
        let mid = setup.SexUtil.traitSelectArray(unit, {
            dick_tiny: [
                `The a|dick leaves very little impression on b|rep.`,
                `The hard-on was so humiliatingly tiny that the slap barely had any effect.`,
                `The humiliatingly tiny cock was almost not short to actually graze b|reps b|face.`,
            ],
            dick_small: [
                `a|Rep had to close in the distance in order to slap a|their small dick on b|reps b|face.`,
                `The dick was a bit small though, and the slap did not carry any impact with it.`,
                `The tastefully-sized dick did not leave much impact.`,
            ],
            dick_medium: [
                `The moderately-sized cock produced a good loud whack.`,
                `The average-sized cock splattered some more precum as it whacked b|reps b|face.`,
                `b|Rep slightly grimaced in pain from the whack.`,
            ],
            dick_large: [
                `The large cock produced a good impactful whack.`,
                `The cock is long enough to fully whack b|rep from one cheek to another.`,
                `b|Rep grimaced in pain from the impactful whack.`,
            ],
            dick_huge: [
                `The massive erection splattered precum as it whacked b|reps b|face thorougly from side to side.`,
                `The massive hard-on produced a deliciously loud whacking sound.`,
                `The massive shaft resulted in a powerful slap, leaving the slave grimacing in pain.`,
            ],
            dick_titanic: [
                `The absolutely monstrous dick whacked b|rep so thoroughly, almost knocking the consciousness out of b|rep.`,
                `Being whacked by such a monstrously-sized dick left b|rep reeling in pain.`,
                `At one point, the monstrously-sized dick almost covered b|reps entire b|face.`,
            ],
        });
        if (unit.isHasTrait('dick_large')) {
            mid += ' ' + setup.SexText.abuseImpression(unit, this.getActorUnit('b'), sex);
        }
        return [
            `Pulling a|their hips
      back, a|rep a|adv a|slide a|their a|dick out of b|reps mouth.
      Before b|they can react,
      a|they quickly a|slap a|their hard shaft against b|their cheek,
      splattering saliva and precum
      across b|their b|face. ${mid} Before b|rep can collect b|themself,
      a|rep a|resume thrusting a|their
      a|dick down b|their throat.`,
            `Pulling back, a|rep a|adv a|slide a|their a|dick free from b|reps
      mouth,  and with a|a_moan, a|they a|proceed to slap the
      saliva-coated cock head against b|their b|face. ${mid}
      ${pre}, a|rep a|slide a|their throbbing length back down b|their throat.`,
            `a|Rep a|adv a|slide a|their a|dick out from b|reps mouth, and,
      grinning to a|themself, a|they then a|slap a|their hard shaft
      against b|their b|face. ${mid} With a streak of
      precum and saliva now drooling
      down b|their cheek, b|rep b|open b|their b|eyes wide in
      surprise as a|rep a|force a|their a|dick back down b|their
      throat.`,
            `Quickly pulling a|their hips back, a|rep a|draw a|their
      a|dick out from b|reps mouth, before starting to slap a|their
      slimy length against b|their cheeks. 
      ${mid}
      Before b|rep can react, a|rep suddenly a|push a|their hips
      forwards, ramming a|their a|dick down b|their throat.`
        ];
    }
};
