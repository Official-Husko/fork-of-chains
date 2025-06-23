
setup.FAMILY_RELATION_MAP = {
  sibling: {
    gender_male: 'brother',
    gender_female: 'sister',
  },
  twin: {
    gender_male: 'twinbrother',
    gender_female: 'twinsister',
  },
  parent: {
    gender_male: 'father',
    gender_female: 'mother',
  },
  child: {
    gender_male: 'son',
    gender_female: 'daughter',
  },
}

// special. Will be assigned to State.variables.family
setup.Family = class Family extends setup.TwineClass {
  constructor() {
    super()
    // {unit_key: {unit_key: relation}}
    this.family_map = {}
  }

  // deletes a unit completely from the records.
  deleteUnit(unit) {
    let unitkey = unit.key
    if (unitkey in this.family_map) {
      delete this.family_map[unitkey]
    }
    for (let otherkey in this.family_map) {
      if (unitkey in this.family_map[otherkey]) delete this.family_map[otherkey][unitkey]
    }
  }

  _setRelation(unit, target, relation) {
    // unit become target's "relation". E.g., unit become target's father.
    if (!(unit.key in this.family_map)) {
      this.family_map[unit.key] = {}
    }

    this.family_map[unit.key][target.key] = relation
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.Unit} target 
   */
  unsetRelation(unit, target) {
    if (this.family_map[unit.key]) delete this.family_map[unit.key][target.key]
    if (this.family_map[target.key]) delete this.family_map[target.key][unit.key]
  }

  _uniteSurname(unit, target) {
    // unit's surname is changed to target's surname
    unit.setName(unit.first_name, target.surname)
  }

  setSibling(unit, target) {
    // unit and target becomes siblings.
    this.unsetRelation(unit, target)
    this._setRelation(unit, target, 'sibling')
    this._setRelation(target, unit, 'sibling')
    this._uniteSurname(unit, target)
  }

  setParent(unit, target) {
    // unit becomes target's parent
    this.unsetRelation(unit, target)
    this._setRelation(unit, target, 'parent')
    this._setRelation(target, unit, 'child')

    // change child's name
    this._uniteSurname(target, unit)
  }

  setTwin(unit, target) {
    // unit becomes target's twin
    this.unsetRelation(unit, target)
    this._setRelation(unit, target, 'twin')
    this._setRelation(target, unit, 'twin')
    this._uniteSurname(unit, target)
  }

  /**
   * unit is target's xxx (if any)
   * @param {setup.Unit} unit 
   * @param {setup.Unit} target 
   * @returns {setup.FamilyRelation | null}
   */
  getRelation(unit, target) {
    if (!(unit.key in this.family_map)) return null
    if (!(target.key in this.family_map[unit.key])) return null
    let relation = this.family_map[unit.key][target.key]
    let relationobj = setup.FAMILY_RELATION_MAP[relation]

    if (!relationobj) throw new Error(`??? missing relation obj for ${relation}`)
    for (let traitkey in relationobj) {
      if (unit.isHasTrait(setup.trait[traitkey])) return setup.familyrelation[relationobj[traitkey]]
    }
    throw new Error(`Not found relation family for ${unit.key}`)
  }

  // get unit's relation. E.g., get unit's father, if any
  getUnitRelation(unit, relation) {
    if (setup.isString(relation)) relation = setup.familyrelation[relation]
    if (!relation) throw new Error(`Missing relation in getUnitRelation!`)
    for (const unitkey in this.family_map) {
      const target = State.variables.unit[unitkey]
      if (this.getRelation(target, unit) == relation) return target
    }
    return null
  }

  getFamily(unit) {
    // return {unit_key: family_relation}
    if (!(unit.key in this.family_map)) return {}
    let res = {}
    for (let targetkey in this.family_map[unit.key]) {
      res[targetkey] = this.getRelation(unit, State.variables.unit[targetkey])
    }
    return res
  }

  getFamilyList(unit) {
    let family = this.getFamily(unit)
    let res = []
    for (let unitkey in family) {
      res.push({
        unit: State.variables.unit[unitkey],
        relation: family[unitkey],
      })
    }
    return res
  }
}
