// @ts-nocheck


setup.ActorHelper = {}

/**
 * @return {Object<string, {type: string, val?: *, key?: string}>}
 */
setup.ActorHelper.parseMap = function (actor_unitgroups) {
  /**
   * @type {Object<string, {type: string, val?: *, key?: string}>}
   */
  let actor_unitgroup_key_map = {}
  for (let criteria_key in actor_unitgroups) {
    if (!actor_unitgroups[criteria_key]) {
      actor_unitgroup_key_map[criteria_key] = null
    } else {
      let unitgroup = actor_unitgroups[criteria_key]
      if (setup.isString(unitgroup)) {
        actor_unitgroup_key_map[criteria_key] = {
          type: 'unitgroup',
          key: unitgroup
        }
      } else if (Array.isArray(unitgroup)) {
        actor_unitgroup_key_map[criteria_key] = {
          type: 'companyunit',
          val: setup.deepCopy(unitgroup)
        }
        const status_restriction_classes = [
          setup.qresImpl.HomeExceptOnLeave,
          setup.qresImpl.NotEngaged,
          setup.qresImpl.Home,
        ]
        let found = false
        for (const status_class of status_restriction_classes) {
          if (unitgroup.filter(a => a instanceof status_class).length) {
            found = true
            break
          }
        }
        if (!found) {
          // assign one

          // check if it allows for retired slavers
          if (setup.Living.isRestrictionsAllowRetired(unitgroup)) {
            // has retired slaver.
            actor_unitgroup_key_map[criteria_key].val.push(setup.qres.NotEngaged())
          } else {
            actor_unitgroup_key_map[criteria_key].val.push(setup.qres.Home())
          }
        }
      } else if (unitgroup instanceof setup.ContactTemplate) {
        actor_unitgroup_key_map[criteria_key] = {
          type: 'contact',
          key: unitgroup.key
        }
      } else {
        actor_unitgroup_key_map[criteria_key] = {
          type: 'unitgroup',
          key: unitgroup.key
        }
      }
    }
  }
  return actor_unitgroup_key_map
}

/**
 * @returns {Object<string, setup.ContactTemplate | setup.UnitGroup | setup.Restriction[]>}
 */
setup.ActorHelper.parseUnitGroups = function (actor_unitgroup_key_map) {
  /**
   * @type {Object<string, setup.ContactTemplate | setup.UnitGroup | setup.Restriction[]}
   */
  const result = {}
  for (const criteria_key in actor_unitgroup_key_map) {
    const unitgroupkey = actor_unitgroup_key_map[criteria_key]
    if (unitgroupkey) {
      if (unitgroupkey.type == 'contact') {
        result[criteria_key] = setup.contacttemplate[unitgroupkey.key]
      } else if (unitgroupkey.type == 'unitgroup') {
        result[criteria_key] = setup.unitgroup[unitgroupkey.key]
      } else if (unitgroupkey.type == 'companyunit') {
        if (!Array.isArray(unitgroupkey.val)) throw new Error(`unrecognized unit group: ${unitgroupkey}`)
        // here, its the [res1, res2] version
        result[criteria_key] = unitgroupkey.val
      } else {
        throw new Error(`Unknown actor type: ${unitgroupkey.type}`)
      }
    } else {
      result[criteria_key] = null
    }
  }
  return result
}

setup.DebugActor = {}

/**
 * @param {Object<string, setup.ContactTemplate | setup.UnitGroup | setup.Restriction[]>} actor_unit_groups
 * @param {boolean} [is_efficient]
 * @returns {Object<string, setup.Unit>}
 */
setup.DebugActor.getActors = function (actor_unit_groups, is_efficient) {
  /**
   * @type {Object<string, setup.Unit>}
   */
  let actors = {}
  const player_units = State.variables.company.player.getUnits({}).filter(
    unit => !unit.isEngaged() && !State.variables.leave.isOnLeave(unit)
  )
  setup.rng.shuffleArray(player_units)
  let player_unit_idx = 0
  for (const actor_key in actor_unit_groups) {
    let unitgroup = actor_unit_groups[actor_key]
    if (Array.isArray(unitgroup)) {
      let unit
      if (is_efficient && player_unit_idx < player_units.length) {
        unit = player_units[player_unit_idx]
        player_unit_idx += 1
      } else {
        let slave = false
        let you = false
        /**
         * @type {setup.Restriction[]}
         */
        const restrictions = unitgroup
        for (const restriction of restrictions) {
          if (restriction instanceof setup.qresImpl.Job && restriction.job_key == setup.job.slave.key) {
            slave = true
          } else if (restriction instanceof setup.qresImpl.You) {
            you = true
          }
        }
        if (you && !is_efficient && !State.variables.unit.player.isEngaged() && !State.variables.leave.isOnLeave(State.variables.unit.player)) {
          unit = State.variables.unit.player
        } else {
          // just create new people for this
          unit = setup.unitpool.subrace_humankingdom_male.generateUnit()
          State.variables.company.player.addUnit(unit, slave ? setup.job.slave : setup.job.slaver)
        }
      }
      actors[actor_key] = unit
    } else {
      if (!(unitgroup instanceof setup.UnitGroup) || unitgroup.reuse_chance) {
        unitgroup = setup.unitgroup.all
      }
      let unit = unitgroup.getUnit()
      actors[actor_key] = unit
      if (actor_key == 'trainee') {
        State.variables.company.player.addUnit(unit, setup.job.slave)
      }
    }
  }
  return actors
}
