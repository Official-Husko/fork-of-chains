// @ts-nocheck

setup.RestrictionLib = {}


/**
 * Whether this set of restrictions would allow defiant units to participate in that.
 * @param {setup.Restriction[]} restrictions 
 * @returns {boolean}
 */
setup.RestrictionLib.isRestrictionsAllowDefiant = function (restrictions) {
  for (const restriction of restrictions) {
    if (restriction instanceof setup.qresImpl.AllowDefiant) {
      return true
    }
  }
  return false
}


/**
 * @param {setup.Unit} unit 
 * @param {Array<setup.Restriction>} restrictions 
 */
setup.RestrictionLib.isUnitSatisfyIncludeDefiancy = function (unit, restrictions) {
  // restriction is list of restrictions: [res1, res2, res3, ...]

  // special case: defiant units are forbidden to participate in most restrictions
  if (!setup.RestrictionLib.isRestrictionsAllowDefiant(restrictions) && unit.isDefiant()) {
    return false
  }

  return setup.RestrictionLib.isUnitSatisfy(unit, restrictions)
}


/**
 * @param {setup.Unit} unit 
 * @param {Array<setup.Restriction>} restrictions 
 */
setup.RestrictionLib.isUnitSatisfy = function (unit, restrictions) {
  // restriction is list of restrictions: [res1, res2, res3, ...]

  for (let i = 0; i < restrictions.length; ++i) {
    let restriction = restrictions[i]
    if (!(restriction.isOk(unit))) return false
  }
  return true
}


setup.RestrictionLib.isPrerequisitesSatisfied = function (obj, prerequisites) {
  // prerequisites is list of costs: [cost1, cost2, cost3, ...]
  if (!Array.isArray(prerequisites)) throw new Error(`2nd element of is prereq must be array`)
  for (let i = 0; i < prerequisites.length; ++i) {
    let prerequisite = prerequisites[i]
    if (!(prerequisite.isOk(obj))) return false
  }
  return true
}

/**
 * Applies all effects in obj_list, with obj as a parameter.
 * 
 * @param {array} obj_list 
 * @param {object=} obj 
 */
setup.RestrictionLib.applyAll = function (obj_list, obj) {
  for (let i = 0; i < obj_list.length; ++i) obj_list[i].apply(obj)
}

/**
 * @param {Object<string, setup.ContactTemplate | setup.UnitGroup | setup.Restriction[]>} actor_unit_group_map
 * @returns {boolean}
 */
setup.RestrictionLib.isActorUnitGroupViable = function (actor_unit_group_map) {
  for (const actor_unit_group of Object.values(actor_unit_group_map)) {
    if (Array.isArray(actor_unit_group)) {
      // check if some unit satisfies this.
      let satisfied = false

      for (const unit of setup.QuestPool.getYourUnitBaseCandidates(actor_unit_group)) {
        if (setup.RestrictionLib.isUnitSatisfyIncludeDefiancy(unit, actor_unit_group)) {
          satisfied = true
          break
        }
      }
      if (!satisfied) return false
    } else if (actor_unit_group instanceof setup.ContactTemplate) {
      const contacts = State.variables.contactlist.getContacts(actor_unit_group).filter(
        contact => contact.getUnit() && !contact.getUnit().isEngaged())
      if (!contacts.length) return false
    }
  }
  return true
}
