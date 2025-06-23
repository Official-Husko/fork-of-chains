
// trait_list: list of traits in order, from the "most negative" to the "most positive"
// for example, for muscle would be
// [muscle_extremelythin, muscle_verythin, muscle_thin, null, muscle_strong, muscle_verystrong, muscle_extremelystrong]
// the null means that if the trait were to "increase", it goes back to nothing.

// tags is shorthand to add the same tag to all traits in this group

// is_not_ordered = true means that the trait does not have an order
// e.g., gender is is_not_ordered.
setup.TraitGroup = class TraitGroup extends setup.TwineClass {

  static keygen = 1

  constructor(trait_list, tags, is_not_ordered) {
    super()

    this.key = setup.TraitGroup.keygen++

    let nullcnt = 0
    this.trait_key_list = []
    for (let i = 0; i < trait_list.length; ++i) {
      let trait = trait_list[i]
      if (trait) {
        this.trait_key_list.push(trait.key)
        if (trait.trait_group_key) throw new Error(`Trait ${trait.key} already have a trait group`)
        trait.trait_group_key = this.key
        if (tags) {
          for (let j = 0; j < tags.length; ++j) {
            trait.tags.push(tags[j])
          }
        }
      } else {
        nullcnt += 1
        this.trait_key_list.push(null)
      }
    }
    if (nullcnt > 1) throw new Error(`Too many nulls for ${tags}. Did you forgot to add new to the trait?`)

    if (is_not_ordered) {
      this.is_not_ordered = true
    } else {
      this.is_not_ordered = false
    }

    if (this.key in setup.traitgroup) throw new Error(`${this.key} duplicated on trait group`)
    setup.traitgroup[this.key] = this
  }


  isOrdered() {
    return !this.is_not_ordered
  }


  /**
   * @param {setup.Trait | null} trait 
   * @returns {number}
   */
  _getTraitIndex(trait) {
    if (this.is_not_ordered) throw new Error(`trait group is unordered index`)

    let all_traits = this.getTraits()
    for (let i = 0; i < all_traits.length; ++i) {
      if (all_traits[i] == trait) return i
    }
    if (!trait) return -1
    throw new Error(`Trait not found: ${trait.key}`)
  }


  computeResultingTrait(unit, new_trait) {
    // if a unit is supposed to gain new_trait, what trait
    // the unit actually get?
    // formula: first find the 'null'. If null is found, then that
    // becomes the "0" position. Otherwise, "0" position is at start.
    // if unit_trait is after the 0 position, then try to increase trait up to unit_trait
    // otherwise, try to decrease trait up to unit_trait

    if (this.is_not_ordered) throw new Error(`trait group is unordered`)

    // find the existing trait
    let existing_trait = null
    let existing_trait_position = -1
    let all_traits = this.getTraits()
    for (let i = 0; i < all_traits.length; ++i) if (all_traits[i] && unit.isHasTraitExact(all_traits[i])) {
      existing_trait = all_traits[i]
      existing_trait_position = i
      break
    }

    if (existing_trait == new_trait) return existing_trait

    // find new trait and null position
    let new_trait_position = this._getTraitIndex(new_trait)
    let null_position = this._getTraitIndex(null)

    if (existing_trait === null) {
      existing_trait_position = null_position
    }

    // compute direction
    let change = null
    if (new_trait == null) {
      if (null_position < existing_trait_position) {
        change = -1
      } else {
        change = 1
      }
    } else if (new_trait_position > null_position) {
      change = 1
    } else if (new_trait_position < null_position) {
      change = -1
    } else {
      throw new Error(`Unknown error weird null position`)
    }

    if (change > 0 && existing_trait_position > new_trait_position) return existing_trait
    if (change < 0 && existing_trait_position < new_trait_position) return existing_trait

    // Find next trait in direction.
    let new_position = existing_trait_position + change
    if (new_position == -1) return null
    if (new_position < -1 || new_position >= all_traits.length) throw new Error(`Cant find next trait`)

    return all_traits[new_position]
  }


  getTraits() {
    let result = []
    for (let i = 0; i < this.trait_key_list.length; ++i) {
      let tkey = this.trait_key_list[i]
      if (tkey) {
        result.push(setup.trait[tkey])
      } else {
        result.push(null)
      }
    }
    return result
  }


  getSmallestTrait() {
    let traits = this.getTraits()
    for (let i = 0; i < traits.length; ++i) {
      if (traits[i]) return traits[i]
    }
    throw new Error(`Smallest trait not found`)
  }


  getLargestTrait() {
    let traits = this.getTraits()
    for (let i = traits.length - 1; i >= 0; --i) {
      if (traits[i]) return traits[i]
    }
    throw new Error(`Largest trait not found`)
  }


  /**
   * @param {setup.Trait | null} trait 
   * @param {boolean} [is_opposite]
   * @returns {setup.Trait[]}
   */
  getTraitCover(trait, is_opposite) {
    // given a trait: if positive trait, then this and all the traits after that.
    // otherwise the opposite

    // if is_opposite is given, then direction is reversed.
    if (this.is_not_ordered) return [trait]

    let position = this._getTraitIndex(trait)
    let nullposition = this._getTraitIndex(null)
    let direction = 1
    if (nullposition > position) direction = -1
    if (is_opposite) direction *= -1

    let traits = this.getTraits()
    let result = []
    for (let i = 0; i < traits.length; ++i) {
      if (traits[i]) {
        if (
          (direction == 1 && i >= position) ||
          (direction == -1 && i <= position)) {
          result.push(traits[i])
        }
      }
    }
    return result
  }

}
