/* Bless a unit either with a random blessing or bless/curse it with a specific one */
setup.qcImpl.Blessing = class Blessing extends setup.Cost {
  /**
   * @param {string} actor_name 
   * @param {number} amount
   * @param {setup.Trait} [max_trait]
   * @param {boolean} [is_curse]  whether to curse instead of bless randomly
   */
  constructor(actor_name, amount, max_trait, is_curse) {
    super()

    this.actor_name = actor_name
    if (max_trait) {
      this.max_trait_key = setup.keyOrSelf(max_trait)
      if (!setup.trait[this.max_trait_key].getTags().includes('blessingcursemax')) {
        throw new Error(`${this.max_trait_key} is not a max blessing/curse trait for qc.Blessing!`)
      }
    } else {
      this.max_trait_key = null
    }
    this.amount = amount || 1
    this.is_curse = is_curse

    if (this.is_curse && max_trait) {
      throw new Error(`Cannot have both is_curse and max_trait set`)
    }
  }

  text() {
    return `setup.qc.Blessing('${this.actor_name}', ${this.amount}, ${this.max_trait_key ? `'${this.max_trait_key}'` : `null`}, ${this.is_curse})`
  }

  apply(quest) {
    /**
     * @type {setup.Unit}
     */
    const unit = quest.getActorUnit(this.actor_name)

    // find the max trait
    /**
     * @type {setup.Trait}
     */
    let max_trait
    if (this.max_trait_key) {
      max_trait = setup.trait[this.max_trait_key]
    } else {
      if (this.is_curse) {
        max_trait = setup.rng.choice(setup.TraitHelper.getAllTraitsOfTags(['cursemax']))
      } else {
        max_trait = setup.rng.choice(setup.TraitHelper.getAllTraitsOfTags(['blessingmax']))
      }
    }

    if (max_trait.getTags().includes('curse') && unit.isHasTrait('perk_uncursed')) {
      // traumatize unit instead.
      setup.notify(`a|Rep cannot get cursed, and get traumatized instead`, { a: unit })
      const duration = this.amount * setup.PERK_UNCURSED_TRAUMA_DURATION
      return setup.qc.TraumatizeRandom(this.actor_name, duration).apply(quest)
    }

    // find unit's original trait
    const original = unit.getTraitFromTraitGroup(max_trait.getTraitGroup())

    let amount = this.amount

    if (!max_trait.getTags().includes('curse') && unit.isHasTrait(max_trait)) {
      if (unit.isYourCompany()) {
        setup.notify(
          `a|Rep a|is supposed to obtain ${max_trait.rep()}, but a|they already a|have it`,
          { a: unit },
        )
      }

    } else {
      let extra = 0
      State.variables.notification.disable()
      for (let i = 0; i < amount; ++i) {
        if (unit.isHasTrait(max_trait)) {
          extra += 1
        } else {
          setup.qc.Trait(this.actor_name, max_trait).apply(quest)
        }
      }
      State.variables.notification.enable()

      if (extra != amount) {
        const final_trait = unit.getTraitFromTraitGroup(max_trait.getTraitGroup())
        if (unit.isYourCompany()) {
          if (final_trait) {
            if (original) {
              setup.notify(`a|Rep a|lose ${original.rep()} and a|gain ${final_trait.rep()}`, { a: unit })
            } else {
              setup.notify(`a|Rep a|gain ${final_trait.rep()}`, { a: unit })
            }
          } else if (original) {
            setup.notify(`a|Rep a|lose ${original.rep()}`, { a: unit })
          }
        }
      }

      if (extra && max_trait.getTags().includes('curse')) {
        if (unit.isYourCompany()) {
          setup.notify(`a|Rep a|is supposed to gain more stacks of ${max_trait.rep()}, but a|they already a|have it at maximum, and the curse overflows`, { a: unit })
        }

        if (max_trait.getTags().includes('blessingprotection')) {
          // injure units
          const injuries = setup.CURSE_INJURY_WEEKS * extra
          setup.qc.Injury(this.actor_name, injuries).apply(quest)
        } else if (max_trait.getTags().includes('blessingsanity')) {
          // traumatize units
          const traumas = setup.CURSE_TRAUMA_WEEKS * extra
          setup.qc.TraumatizeRandom(this.actor_name, traumas).apply(quest)
        } else if (max_trait.getTags().includes('blessingpurity')) {
          // corrupt units
          const corruptions = extra
          setup.qc.Corrupt(this.actor_name, null, corruptions).apply(quest)
        } else {
          if (unit.isYourCompany()) {
            const money = 2500 * extra
            setup.qc.Money(-money).apply(quest)
          }
        }
      }
    }
  }

  explain(quest) {
    if (this.max_trait_key) {
      const trait = setup.trait[this.max_trait_key]
      return `${this.actor_name} gains up to ${this.amount} stacks of ${trait.rep()}`
    } else {
      if (this.is_curse) {
        return `${this.actor_name} gains up to ${this.amount} stacks of a random curse.`
      } else {
        return `${this.actor_name} gains up to ${this.amount} stacks of a random blessing.`
      }
    }
  }
}
