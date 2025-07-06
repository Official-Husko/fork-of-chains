// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
FingerBreasts.FORCE_FEEL_BREASTS
*/

import { ArmsBreastsFreeBaseSub } from "./ArmsBreastsFreeBase"

setup.SexActionClass.ArmsBreastsFreeSubGrope = class ArmsBreastsFreeSubGrope extends ArmsBreastsFreeBaseSub {
  getTags() { return super.getTags().concat(['normal']) }
  desc() { return 'Have breasts groped' }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_MEDIUM,
        arousal: setup.Sex.AROUSAL_SMALL,
        discomfort: setup.Sex.DISCOMFORT_TINY,
        paces: [setup.sexpace.dom, setup.sexpace.normal, setup.sexpace.sub],
        restrictions: [
          setup.qres.SexCanUseBodypart(setup.sexbodypart.arms),
        ],
      },
      {
        energy: setup.Sex.ENERGY_SMALL,
        arousal: setup.Sex.AROUSAL_SMALL,
        paces: setup.SexPace.getAllPaces(),
      },
    ]
  }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_grope'),
    ])
  }

  rawTitle(sex) {
    return `Have a|breasts groped`
  }

  rawDescription(sex) {
    return `Get b|rep to give your a|breasts a good squeeze.`
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

    const hasbreasts = me.isHasBreasts()
    const hasclothes = sex.getCoveringEquipment(me, this.getPenetrationTarget())
    const simple = this.getPenetrationTarget().repSimple(me)

    let clothesrep
    if (hasclothes) {
      clothesrep = sex.getCoveringEquipment(me, this.getPenetrationTarget()).rep()
    } else {
      clothesrep = setup.rng.choice([
        `exposed ${simple}`,
        `bare ${simple}`,
        `naked ${simple}`,
      ])
    }

    let nipplerep
    const nippleclothes = me.getEquipmentAt(setup.equipmentslot.nipple)
    if (nippleclothes) {
      nipplerep = nippleclothes.rep()
    } else {
      nipplerep = 'a|nipples'
    }

    let story = ''

    let t
    if (mypace == setup.sexpace.dom) {
      t = [
        `Taking b|reps b|hands in a|theirs, a|rep a|yank them up to a|their chest,
        letting out a|a_moan as a|they roughly a|press them into a|their a|breasts ${hasclothes ?
          `forcing a|their ${clothesrep} down against a|their a|nipples in the process` : ''}.`,

        `a|Rep a|take hold of b|reps b|hands, before roughly yanking them up to press into
        a|their ${hasclothes ? clothesrep : nipplerep},
        and holding them there for a moment as a|rep a|order b|them to grope and squeeze a|reps a|breasts.`,

        `Taking hold of b|reps b|hands, a|rep violently a|pull them up to a|their
        ${clothesrep}, forcing b|their fingers to press into a|their ${simple}.`,
      ]
    } else {
      t = [
        `Taking b|reps b|hands in a|theirs, a|rep a|guide them up to a|their chest,
        letting out a|a_moan as a|they a|eagerly a|press them into a|their a|breasts ${hasclothes ?
          `forcing a|their ${clothesrep} down against a|their a|nipples in the process` : ''}.`,

        `a|Rep a|take hold of b|reps b|hands, before a|eagerly guiding them up to press into
        a|their ${hasclothes ? clothesrep : nipplerep},
        and holding them there for a moment as a|rep a|hope that b|they will grope and squeeze a|reps a|breasts.`,

        `Taking hold of b|reps b|hands, a|rep a|eagerly a|guide b|their fingers up to a|their
        ${clothesrep}, before enthusiastically pressing them into a|their ${simple}.`,
      ]
    }

    story += setup.rng.choice(t) + ' '

    let adj = ''
    if (hasbreasts) {
      adj = setup.rng.choice([
        'tender',
        'soft',
        '',
      ])
    } else if (me.isHasTrait('muscle_strong')) {
      adj = setup.rng.choice([
        'hard',
        'stiff',
        '',
      ])
    }
    const bp = `${hasclothes ? `the ${clothesrep} covering` : `the ${adj} flesh of`} a|their a|breasts`

    if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
      t = [
        ` b|Rep b|let out a moan in response to a|reps eagerness, before
          b|eagerly pressing b|their b|hands into ${bp}.`,

        ` With a soft moan, b|rep eagerly responds to a|reps move by b|eagerly sinking b|their fingers
          into ${bp}.`,

        ` b|Eagerly moaning, b|rep b|start playing with a|reps a|breasts, drawing pleasurable a|moans from
          between a|their lips as b|they b|eagerly b|press b|their fingers into a|their a|breasts.`,
      ]
    } else if (theirpace == setup.sexpace.dom) {
      t = [
        ` b|Rep b|let out b|a_moan in response to a|reps eagerness, roughly pressing b|their b|hands
        into ${bp} as b|they growls out that b|they a|is still the one in charge.`,

        ` With b|a_moan, b|rep eagerly responds to a|reps move by roughly sinking b|their fingers
        into ${bp}.`,

        ` Moaning, b|rep b|start playing with a|reps a|breasts, drawing pleasurable a|moans
        from between a|their lips as b|they roughly b|press b|their fingers into a|their a|breasts.`
      ]
    } else if (theirpace == setup.sexpace.resist) {
      t = [
        setup.SexUtil.repResist(
          them,
          me,
          sex,
          [
            `struggle against b|their touch`,
            `disobey the order`,
          ],
          [
            `b|they b|force b|reps b|hands into a|their a|breasts`,
            `b|they b|continue forcing b|reps b|hands into a|their a|breasts`,
            `b|rep b|carry on forcing b|their b|hands into a|their a|breasts`,
          ])
      ]

    } else if (theirpace == setup.sexpace.forced) {
      const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex)
      t = [
        ` b|Rep b|let out b|a_moan involuntarily in response to a|reps movements,
        before b|they ${h} press b|their b|hands into ${bp}.`,

        ` With b|a_moan, b|rep ${h} respond to a|reps move by sinking b|their fingers into ${bp}.`,

        ` Despite only half-heartedly doing it, b|rep still draw pleasurable a|moans from between
        a|reps lips as b|they hesitantly b|press b|their fingers into a|their a|breasts.`
      ]
    } else {
      t = [
        setup.SexUtil.mindbrokenReactionDespite(them, sex, [
          `Despite a|reps eagerness`,
          `Despite having b|their b|hands on the ${bp}`,
          `Despite the ${adj} feeling of a|reps ${simple}`,
        ])
      ]
    }

    story += setup.rng.choice(t) + ' '

    return story
  }
}
