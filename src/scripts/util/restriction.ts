import type { ContactTemplate } from "../classes/contact/ContactTemplate";
import type { Unit } from "../classes/unit/Unit";
import type { UnitGroup } from "../classes/unit/UnitGroup";

export namespace RestrictionLib {
  /**
   * Whether this set of restrictions would allow defiant units to participate in that.
   */
  export function isRestrictionsAllowDefiant(
    restrictions: readonly Restriction[],
  ): boolean {
    for (const restriction of restrictions) {
      if (restriction instanceof setup.qresImpl.AllowDefiant) {
        return true;
      }
    }
    return false;
  }

  export function isUnitSatisfyIncludeDefiancy(
    unit: Unit,
    restrictions: readonly Restriction[],
  ) {
    // restriction is list of restrictions: [res1, res2, res3, ...]

    // special case: defiant units are forbidden to participate in most restrictions
    if (
      !setup.RestrictionLib.isRestrictionsAllowDefiant(restrictions) &&
      unit.isDefiant()
    ) {
      return false;
    }

    return setup.RestrictionLib.isUnitSatisfy(unit, restrictions);
  }

  export function isUnitSatisfy(
    unit: Unit,
    restrictions: readonly Restriction[],
  ) {
    // restriction is list of restrictions: [res1, res2, res3, ...]

    for (let i = 0; i < restrictions.length; ++i) {
      let restriction = restrictions[i];
      if (!restriction.isOk(unit)) return false;
    }
    return true;
  }

  export function isPrerequisitesSatisfied(
    obj: CostContext,
    costs: readonly Cost[],
  ): boolean;
  export function isPrerequisitesSatisfied<T>(
    obj: T,
    costs: readonly Restriction<T>[],
  ): boolean;

  export function isPrerequisitesSatisfied(
    obj: any,
    prerequisites: readonly Restriction[] | readonly Cost[],
  ): boolean {
    // prerequisites is list of costs: [cost1, cost2, cost3, ...]
    if (!Array.isArray(prerequisites))
      throw new Error(`2nd element of is prereq must be array`);
    for (let i = 0; i < prerequisites.length; ++i) {
      let prerequisite = prerequisites[i];
      if (!prerequisite.isOk(obj)) return false;
    }
    return true;
  }

  /**
   * Applies all cost effects in obj_list, with obj as the context parameter.
   */
  export function applyAll<T extends CostContext>(
    obj_list: readonly Cost[],
    obj: T,
  ) {
    for (let i = 0; i < obj_list.length; ++i) {
      obj_list[i].apply(obj);
    }
  }

  export function isActorUnitGroupViable(
    actor_unit_group_map: Record<
      string,
      ContactTemplate | UnitGroup | readonly Restriction[]
    >,
  ): boolean {
    for (const actor_unit_group of Object.values(actor_unit_group_map)) {
      if (Array.isArray(actor_unit_group)) {
        // check if some unit satisfies this.
        let satisfied = false;

        for (const unit of setup.QuestPool.getYourUnitBaseCandidates(
          actor_unit_group,
        )) {
          if (
            setup.RestrictionLib.isUnitSatisfyIncludeDefiancy(
              unit,
              actor_unit_group,
            )
          ) {
            satisfied = true;
            break;
          }
        }
        if (!satisfied) return false;
      } else if (actor_unit_group instanceof setup.ContactTemplate) {
        const contacts = State.variables.contactlist
          .getContacts(actor_unit_group)
          .filter((contact) => contact.getUnit()?.isEngaged() === true);
        if (!contacts.length) return false;
      }
    }
    return true;
  }
}
