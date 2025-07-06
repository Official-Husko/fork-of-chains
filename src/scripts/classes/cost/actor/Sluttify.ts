// @ts-nocheck

import { SluttifyDomifyCost } from "./Domify"

// sluttify this unit (one step). Opposity of Domify
setup.qcImpl.Sluttify = class Sluttify extends SluttifyDomifyCost {
  /**
   * @param {string} actor_name 
   */
  constructor(actor_name) {
    super()

    this.actor_name = actor_name
  }

  text() {
    return `setup.qc.Sluttify('${this.actor_name}')`
  }

  /**
   * @param {setup.QuestInstance | setup.EventInstance | setup.OpportunityInstance} quest 
   */
  apply(quest) {
    /**
     * @type {setup.Unit}
     */
    const unit = quest.getActorUnit(this.actor_name)

    // blessing of wolf prevents sluttification
    if (unit.isHasTrait(setup.trait.blessing_wolf1)) {
      unit.decreaseTrait(setup.trait.blessing_wolf8.getTraitGroup())
      if (unit.isYourCompany()) {
        setup.notify(`a|Reps Blessing of Wolf prevents a|them from being sluttified`, { a: unit })
      }
      return
    }

    // sluttification effects:
    const slut_candidates = [
      // subbification
      {
        requirements: [setup.qres.NoTrait(setup.trait.per_submissive)],
        effect: setup.qc.Trait(this.actor_name, setup.trait.per_submissive),
        texts: [
          `a|Rep a|have learned that deep down, a|they a|is nothing but a slut to be dominated by others`,
          `a|Rep a|learn about a|their true nature and become more submissive`,
        ],
      },
      // lustification
      {
        requirements: [setup.qres.NoTrait(setup.trait.per_sexaddict)],
        effect: setup.qc.Trait(this.actor_name, setup.trait.per_sexaddict),
        texts: [
          `a|Rep can only think about sex`,
          `a|Rep a|is riddled by dirty thoughts and sex`,
        ],
      },
      // masochistication
      {
        requirements: [setup.qres.NoTraits([setup.trait.per_masochistic, setup.trait.per_lunatic])],
        effect: setup.qc.Trait(this.actor_name, setup.trait.per_masochistic),
        texts: [
          `a|Rep a|begin to crave pain and punishment`,
          `a|Rep a|learn the joy of being punished`,
        ],
      },
      // lunatification
      {
        requirements: [setup.qres.NoTraits([setup.trait.per_masochistic, setup.trait.per_lunatic])],
        effect: setup.qc.Trait(this.actor_name, setup.trait.per_lunatic),
        texts: [
          `a|Rep a|lose part of a|their sanity`,
          `a|Rep can never be the same again, having lost some of a|their sanity`,
        ],
      },
      // curse of lambification
      {
        requirements: [setup.qres.Not(setup.qres.Job(setup.job.slave))],
        effect: setup.qc.Blessing(this.actor_name, 2, setup.trait.curse_lamb8),
        texts: [
          `a|Rep a|is cursed to forever be a submissive`,
          `a|Rep a|is cursed to become a submissive who crave nothing but to be dominated`,
        ],
      },
      // dumbification
      {
        requirements: [setup.qres.NoTrait(setup.trait.per_slow)],
        effect: setup.qc.Trait(this.actor_name, setup.trait.per_slow),
        texts: [
          `a|Rep a|lose the ability to think and concentrate`,
          `a|Rep a|become dumber and dumber`,
        ],
      },
      // meekification
      {
        requirements: [],
        effect: setup.qc.Trauma(this.actor_name, setup.trait.trauma_slaving, /* duration = */ 150),
        texts: [
          `a|Rep a|lose a LOT of a|their confidence`,
          `a|Rep a|have become much, MUCH meeker than before`,
        ],
      },
      // mindbreak
      {
        requirements: [setup.qres.Job(setup.job.slave)],
        effect: setup.qc.Mindbreak(this.actor_name),
        texts: [
          `a|Rep a|have finally lost it completely, a|their mind now permanently broken`,
          `a|Rep a|have become a permanently disfunctional sex toy, incapable of higher thoughts`,
        ],
      },
    ]

    return this._do_apply(quest, unit, slut_candidates)
  }

  explain(quest) {
    return `${this.actor_name} becomes sluttier`
  }
}
