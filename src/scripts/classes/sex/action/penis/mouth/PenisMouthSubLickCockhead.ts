// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA: LICK_HEAD */

import { PenisMouthSubBase } from "./PenisMouthBase"

setup.SexActionClass.PenisMouthSubLickCockhead = class PenisMouthSubLickCockhead extends PenisMouthSubBase {
  getTags() { return super.getTags().concat(['sub', ]) }
  desc() { return 'Lick cockhead' }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_cockaction'),
    ])
  }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_SMALLMEDIUM,
        arousal: setup.Sex.AROUSAL_SMALL,
        paces: [setup.sexpace.dom, setup.sexpace.normal, setup.sexpace.sub], 
      },
      {
        energy: setup.Sex.ENERGY_TINY,
        arousal: setup.Sex.AROUSAL_SMALLMEDIUM,
        paces: setup.SexPace.getAllPaces(),
      },
    ]
  }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    return 'Lick cockhead'
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return "Lick and kiss the head of b|reps b|dick.";
  }

  /**
   * Returns a string telling a story about this action to be given to the player
   * @param {setup.SexInstance} sex
   * @returns {string | string[]}
   */
  rawStory(sex) {
    const me = this.getActorUnit('a')
    const mypace = sex.getPace(me)
    const them = this.getActorUnit('b')
    const theirpace = sex.getPace(them)

    let story = ''

    const before = [
      "With a|a_moan, a|rep a|pull a|their head back, wrapping a|their lips around the cock head of b|reps b|dick, before starting to a|eagerly lick and kiss it.",
      "a|Rep a|pull a|their head back, letting out a|a_moan as a|they concentrate sucking and kissing the cock head of b|reps b|dick.",
      `Pulling a|their head back a little, a|rep a|let most of b|reps b|dick slide out of a|their mouth, and,
       focusing on using a|their tongue, a|they a|eagerly a|lick and a|kiss the cock head that's left poking past a|their lips.`,
    ]

    story += setup.rng.choice(before)

    const post = setup.SexText.postThought(them, sex)
    const after = setup.SexUtil.traitSelectArray(them, {
      dick_titanic: [
        `b|Their cockhead is much bigger than a|their tongue, and a|rep a|have to approach licking the enormous thing from multiple angles,`,
        `b|Their massive cockhead barely fits into a|reps mouth, stretching it to the limits as a|rep kiss and lick,`,
        `The cockhead is massive, and a|rep a|have to open a|their mouth as large as possible to fit it in,`,
      ],
      dick_huge: [
        `b|Their huge cock bobs up and down as a|rep works a|their tongue on the tip of the enormous shaft,`,
        `a|Rep a|have to open a|their mouth almost all the way to accomodate even just the tip of the enormous shaft,`,
        `The huge cockhead proves difficult to fit inside a|their mouth, and a|rep a|have to open a|their mouth wide to accomodate the huge thing,`
      ],
      default: [
        `b|Their b|dick sways up and down with every delicious lick,`,
        `b|Their b|dick bobs up and down with every careful lick,`,
        `b|Their b|dick wiggles with every lick of the cockhead,`,
      ],
    })

    story += ` ${after} ${post}.`
    return story
	};
}
