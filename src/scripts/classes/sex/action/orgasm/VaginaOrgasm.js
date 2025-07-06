// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
GenericOrgasms
*/
import { VaginaOrgasmBase } from "./VaginaOrgasmBase";
export class VaginaOrgasm extends VaginaOrgasmBase {
    /**
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    describeOrgasm(sex) {
        const me = this.getActorUnit('a');
        const mbody = setup.sexbodypart.vagina;
        let story = '';
        const plug = sex.getBlockingEquipment(me, mbody);
        if (plug && plug.getTags().includes('dildo')) {
            story += ` a|Reps a|vagina clenches down hard, causing a|them to let out a series of high-pitched moans as a|their vaginal muscles grip and squeeze around the
      ${plug.rep()} inserted into a|their a|vagina.`;
            if (plug.getTags().includes('vegetable')) {
                story += setup.rng.choice([
                    ` The coldness of the ${plug.rep()} sends shivers up a|reps spine.`,
                    ` The enchantment keeps the ${plug.rep()} fresh, sending cold shivers up a|reps spine.`
                ]);
            }
        }
        else {
            story += ` a|Reps a|vagina clenches down hard, and the wave of disappointment upon finding itself empty almost overwhelms the pleasure that radiates up through a|their groin.`;
        }
        return story;
    }
    /**
     * Returns the title of this action, e.g., "Blowjob"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawTitle(sex) {
        return `Climax`;
    }
    /**
     * Short description of this action. E.g., "Put your mouth in their dick"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawDescription(sex) {
        return `You've reached your climax, and can't hold back your orgasm any longer. Time to masturbate.`;
    }
    /**
     * Returns a string telling a story about this action to be given to the player
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawStory(sex) {
        const me = this.getActorUnit('a');
        const mbody = setup.sexbodypart.vagina;
        const mpace = sex.getPace(me);
        let story = '';
        if (sex.getPace(me) == setup.sexpace.resist) {
            story += `A desperate, shuddering heat suddenly crashes up from a|reps a|vagina,
      and a|they a|let out a panic squeal as an uninvited blinding wave of pure ecstasy washes suddenly over a|them.`;
        }
        else {
            story += `A desperate, shuddering heat suddenly crashes up from a|reps a|vagina,
      and a|they a|let out a manic squeal as a blinding wave of pure ecstasy washes over a|them.`;
        }
        story += ' ';
        story += this.describeOrgasm(sex);
        story += ' ';
        story += `With a deeply-satisfied sigh, a|reps feminine climax starts to fade, and a|they a|take a few deep gasps of air as a|they a|seek to catch a|their breath.`;
        return setup.SexUtil.convert(story, { a: me }, sex);
    }
}
/*
if(characterPenetrating!=null && penetration!=null) {
  switch(penetration) {
    case FINGER:
      if(characterOrgasming.isPlayer()) {
        if(characterPenetrating.isPlayer()) {
          genericOrgasmSB.append(` You curl your fingers up deep inside your a|vagina, and, while desperately stroking in a 'come-hither' motion, you let out a series of high-pitched moans as your vaginal muscles grip and squeeze around your intruding digits.`);
        } else {
          genericOrgasmSB.append(` b|Reps fingers carry on pumping away at your a|vagina, and you let out a series of high-pitched moans as your vaginal muscles grip and squeeze around the intruding digits.`);
        }
      } else {
        if(characterPenetrating.isPlayer()) {
          genericOrgasmSB.append(` a|Reps vaginal muscles grip and squeeze around your intruding digits, and you continue to stroke and tease a|their clit, drawing out a series of a|moans from between a|their lips.`);
        } else if(characterOrgasming.equals(characterPenetrating)) {
          genericOrgasmSB.append(` a|Reps vaginal muscles grip and squeeze around a|their intruding digits, and, driven on by the intense, pleasurable sensation, a|they continues to stroke and tease a|their clit, all the while letting out a series of a|moans.`);
        } else {
          genericOrgasmSB.append(` a|Reps vaginal muscles grip and squeeze around b|reps intruding digits, and b|they continues to stroke and tease a|their clit, drawing out a series of a|moans from between a|their lips.`);
        }
      }
      break;
    case TENTACLE: //TODO
      break;
    case CLIT:
      if(characterOrgasming.isPlayer()) {
        if(characterPenetrating.isPlayer()) {
          genericOrgasmSB.append(` You carry on clit-fucking yourself through your orgasm, letting out a series of high-pitched moans as your vaginal muscles grip and squeeze around your clit.`);
        } else {
          genericOrgasmSB.append(` b|Rep carries on clit-fucking your a|vagina through your orgasm, and you let out a series of high-pitched moans as your vaginal muscles grip and squeeze around b|their clit.`);
        }
      } else {
        if(characterPenetrating.isPlayer()) {
          genericOrgasmSB.append(` You carry on clit-fucking a|rep through a|their orgasm, causing a|them to let out a series of high-pitched moans as a|their vaginal muscles grip and squeeze around your clit.`);
        } else if(characterOrgasming.equals(characterPenetrating)) {
          genericOrgasmSB.append(` a|Rep carries on clit-fucking a|their own a|vagina through a|their orgasm, causing a|them to let out a series of high-pitched moans as a|their vaginal muscles grip and squeeze around a|their clit.`);
        } else {
          genericOrgasmSB.append(` b|Rep carries on clit-fucking a|reps a|vagina through a|their orgasm, causing a|them to let out a series of high-pitched moans as a|their vaginal muscles grip and squeeze around b|their clit.`);
        }
      }
      break;
    case FOOT: //TODO
      break;
  }
*/ 
