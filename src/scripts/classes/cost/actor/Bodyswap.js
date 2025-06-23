
// swaps the bodies of two units. What could possibly go wrong?
setup.qcImpl.Bodyswap = class Bodyswap extends setup.Cost {
  constructor(actor_name, target_actor_name, skip_title) {
    super()

    this.actor_name = actor_name
    this.target_actor_name = target_actor_name
    this.skip_title = skip_title
  }

  static NAME = 'Swaps the bodies of two units'
  static PASSAGE = 'CostBodyswap'

  text() {
    return `setup.qc.Bodyswap('${this.actor_name}', '${this.target_actor_name}', ${!!this.skip_title})`
  }

  /**
   * Bodyswaps two units
   * @param {setup.Unit} unit 
   * @param {setup.Unit} target 
   * @param {boolean} [is_force_bodyswap]
   * @param {boolean} [is_one_direction]  if true, then unit copies target but not the other way around
   */
  static doBodySwap(unit, target, is_force_bodyswap, is_one_direction) {
    if (!is_force_bodyswap &&
      (unit.isSlaver() || target.isSlaver()) &&
      unit.getGender() != target.getGender()) {
      setup.notify(`Cannot swap a slaver's gender. The bodyswap between a|rep and b|rep did not take place.`, { a: unit, b: target })
      return
    }

    // save their images
    const image_path1 = State.variables.unitimage.getImagePath(unit)
    const image_path2 = State.variables.unitimage.getImagePath(target)

    const custom1 = unit.getCustomImageName()
    const custom2 = target.getCustomImageName()

    const innate1 = unit.getInnateTraits()
    const innate2 = target.getInnateTraits()

    let swaps = [
      [unit, target.getRemovableTraits(), target, image_path2, custom2, innate2],
      [target, unit.getRemovableTraits(), unit, image_path1, custom1, innate1],
    ]

    State.variables.notification.disable()
    for (let i = 0; i < 2; ++i) {
      if (i == 1 && is_one_direction) {
        // one direction only do it one way
        continue
      }

      /**
       * @type {setup.Unit}
       *
       */  // @ts-ignore
      let u = swaps[i][0]

      /**
       * @type {setup.Trait[]}
       *
       */  // @ts-ignore
      let traits = swaps[i][1]

      let toreplace = ['gender', 'physical', 'subrace', 'skin']

      // first remove traits that are unsuitable
      const unit_traits = u.getRemovableTraits()
      for (const trait of unit_traits) {
        // don't remove other traits not in the filter.
        if (!trait.getTags().filter(tag => toreplace.includes(tag)).length) continue

        u.removeTraitExact(trait)
      }

      // next add traits that has the correct traits.
      for (let j = 0; j < traits.length; ++j) {
        let trait = traits[j]
        if (trait.getTags().filter(value => toreplace.includes(value)).length) {
          u.addTrait(trait, /* group = */ null, /* replace = */ true)
        }
      }

      // remove conflicting traits
      if (!u.isHasDick()) {
        u.removeTraitsWithTag('needdick')
      }

      if (!u.isHasVagina()) {
        u.removeTraitsWithTag('needvagina')
      }

      // check equipment
      let equipment = u.getEquipmentSet()
      if (equipment) {
        equipment.recheckEligibility()
      }

      // fix their images, except when opposite genders
      // @ts-ignore
      u.custom_image_name = swaps[i][4]
      // @ts-ignore
      State.variables.unitimage.setImage(u, swaps[i][3])

      // fix innate traits
      /**
       * @type {setup.Trait[]}
       */  // @ts-ignore
      let new_innate = swaps[i][5]
      u.setInnateTraits(new_innate)
    }
    State.variables.notification.enable()
    if (unit.isYourCompany()) {
      setup.notify(`a|reps body transformed...`, { a: unit })
    }

    if (!is_one_direction && target.isYourCompany()) {
      setup.notify(`a|reps body transformed...`, { a: target })
    }
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    let target = quest.getActorUnit(this.target_actor_name)
    setup.qcImpl.Bodyswap.doBodySwap(unit, target)
    let swaps = [
      [unit, target],
      [target, unit],
    ]
    if (!this.skip_title) {
      for (let i = 0; i < 2; ++i) {
        let u = swaps[i][0]
        State.variables.titlelist.addTitle(u, setup.title.bodyswapped)
        u.addHistory(`swapped bodies with ${swaps[i][1].getName()}`)
      }
    }
  }

  explain(quest) {
    return `${this.actor_name} and ${this.target_actor_name} swap bodies`
  }
}
