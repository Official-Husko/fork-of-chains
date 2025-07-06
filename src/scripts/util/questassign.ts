// @ts-nocheck

import { menuItem, menuItemText, menuItemAction, menuItemDanger, menuItemExtras } from "../ui/menu"


setup.QuestAssignHelper = {}
setup.QUEST_AUTO_ASSIGN_MAX_PERMUTATIONS = 24
/**
 * 
 * @param {string} actor_name 
 * @param {setup.Unit} unit 
 * @param {setup.UnitCriteria} criteria
 */
setup.QuestAssignHelper.assignUnit = function (actor_name, unit, criteria) {
  // @ts-ignore
  const unitused = State.variables.gAdhocUnitUsed

  // @ts-ignore
  const actormap = State.variables.gAdhocQuestActorMap

  // If this unit is already there, do nothing
  if (actormap[actor_name] == unit.key) return

  // Get old unit, if any
  let old_unit = null
  if (actormap[actor_name]) {
    old_unit = State.variables.unit[actormap[actor_name]]

    // Remove old unit from its position
    delete unitused[old_unit.key]
    delete actormap[actor_name]
  }

  // Get old position, if any
  const old_actor_name = unitused[unit.key]

  if (old_actor_name) {
    // remove new unit from this position
    delete unitused[unit.key]
    delete actormap[old_actor_name]
  }

  // put unit in position
  unitused[unit.key] = actor_name
  actormap[actor_name] = unit.key

  // swap with old unit, if appropriate
  if (old_unit && old_actor_name && criteria.isCanAssign(old_unit)) {
    unitused[old_unit.key] = old_actor_name
    actormap[old_actor_name] = old_unit.key
  }
}

/**
 * @returns {boolean}
 */
setup.QuestAssignHelper.isAllActorsFilled = function () {
  // @ts-ignore
  const quest = State.variables.questinstance[State.variables.gAdhocQuest_key]

  // @ts-ignore
  const actormap = State.variables.gAdhocQuestActorMap

  for (const actor_name in quest.getTemplate().getUnitCriterias()) {
    if (!(actor_name in actormap)) {
      return false
    }
  }
  return true
}


setup.QuestAssignHelper.computeSuccessObjRep = function () {
  // @ts-ignore
  const quest = State.variables.questinstance[State.variables.gAdhocQuest_key]

  // @ts-ignore
  const actormap = State.variables.gAdhocQuestActorMap

  const actor_unit_map = {}
  for (const key in actormap) {
    actor_unit_map[key] = State.variables.unit[actormap[key]]
  }

  const success_obj = setup.QuestDifficulty.computeSuccessObj(
    quest.getTemplate().getDifficulty(),
    quest.getTemplate().getUnitCriterias(),
    actor_unit_map,
  )
  return setup.QuestDifficulty.explainChance(success_obj)
}


/**
 * @param {setup.QuestInstance} quest 
 * @param {*} actor_unitkey_map 
 */
export function doFinalize(quest, actor_unitkey_map) {
  const actor_unit_map = {}
  for (const key in actor_unitkey_map) {
    actor_unit_map[key] = State.variables.unit[actor_unitkey_map[key]]
  }

  // Create ad hoc team
  const team = new setup.Team()
  State.variables.company.player.addTeam(team)
  for (const unit of Object.values(actor_unit_map)) team.addUnit(unit)

  quest.assignTeam(team, actor_unit_map)
}


setup.QuestAssignHelper.finalize = function (quest) {
  // @ts-ignore
  const actormap = State.variables.gAdhocQuestActorMap

  // remove the old team, if any
  if (quest.getTeam()) {
    quest.cancelAssignTeam()
  }

  doFinalize(quest, actormap)
}


/**
 * 
 * @param {setup.QuestInstance} quest 
 */
setup.QuestAssignHelper.initialize = function (quest) {
  // @ts-ignore
  State.variables.gAdhocQuest_key = quest.key

  const actor_map = {}
  const unit_used = {}

  const unit_assignment = quest.getUnitCriteriasList()
  for (const [actor_name, _, unit] of unit_assignment) {
    if (unit) {
      // @ts-ignore
      actor_map[actor_name] = unit.key
      // @ts-ignore
      unit_used[unit.key] = actor_name
    }
  }

  // @ts-ignore
  State.variables.gAdhocQuestActorMap = actor_map
  // @ts-ignore
  State.variables.gAdhocUnitUsed = unit_used
}


setup.QuestAssignHelper.computeGreedyAutoAssignment = function(criterias, units, actor_name_permutation, criteria_actor_score_map){
  const actor_unitkey_map = {}
  const used_unitkeys = {}

    let total_score = 0;

    for (const actor_name of actor_name_permutation) {
    /**
     * @type {setup.UnitCriteria}
     */
    const criteria = criterias[actor_name].criteria
    let best_unit = null
    let best_score = null
    for (const unit of units) {
      if (unit.key in used_unitkeys || !criteria.isCanAssign(unit)) continue
      const score = criteria_actor_score_map[criteria.key][unit.key]
      if (!best_unit || score > best_score) {
        best_unit = unit
        best_score = score
      }
    }

    // no assignment case:
    if (!best_unit) return {"actor_unitkey_map": null, "total_score": -Infinity};

    used_unitkeys[best_unit.key] = true
    actor_unitkey_map[actor_name] = best_unit.key
    total_score += best_score
  }

  // all found:
  return {"actor_unitkey_map": actor_unitkey_map, "total_score": total_score};
}

/**
 * Returns null if no assignment is found.
 * @param {setup.QuestInstance} quest 
 * @param {setup.Unit[]} [forced_units]   // if supplied, will limit units to this set. IGNORES INJURIES
 */
setup.QuestAssignHelper.computeAutoAssignment = function (quest, forced_units) {
  let units = []
  if (forced_units) {
    units = forced_units
  } else {
    units = State.variables.company.player.getUnits({ available: true }).filter(
      unit => unit.isCanGoOnQuestsAuto()
    )
  }

  let score_func = 'computeScore'

  const score_type = State.variables.menufilter.get('questassign', 'score')
  if (score_type == 'crit') {
    score_func = 'computeScoreCrit'
  } else if (score_type == 'success') {
    score_func = 'computeScoreSuccess'
  } else if (score_type == 'failure') {
    score_func = 'computeScoreFailure'
  }

  const criterias = quest.getTemplate().getUnitCriterias()
  const difficulty = quest.getTemplate().getDifficulty()

  const criteria_actor_score_map = {}
  for (const actor_name in criterias) {
    /**
     * @type {setup.UnitCriteria}
     */
    const criteria = criterias[actor_name].criteria
    for (const unit of units) {
      if (!criteria.isCanAssign(unit)) continue;
      if(criteria_actor_score_map[criteria.key] === undefined) criteria_actor_score_map[criteria.key] = {};
      criteria_actor_score_map[criteria.key][unit.key] = criteria[score_func](unit, difficulty)
    }
  }
    let best_result = {"actor_unitkey_map": null, "total_score": -Infinity};
    for (const permutation of setup.PermuteHelper.permute(Object.keys(criterias), setup.QUEST_AUTO_ASSIGN_MAX_PERMUTATIONS)){
    const result = setup.QuestAssignHelper.computeGreedyAutoAssignment(criterias, units, permutation, criteria_actor_score_map)
    if(result.total_score > best_result.total_score){
      best_result = result;
    }
  }
  return best_result.actor_unitkey_map;
}


/**
 * @param {setup.QuestInstance} quest 
 * @param {Object} assignment 
 */
function partyCallback(quest, assignment) {
  return () => {
    doFinalize(quest, assignment)
    setup.runSugarCubeCommand('<<focgoto>>')
  }
}


/**
 * @param {setup.QuestInstance} quest 
 * @param {string} [cssclass]
 */
function partyChildrenCallback(quest, cssclass) {
  return () => {
    const children = []
    for (const party of State.variables.partylist.getParties()) {
      const units = party.getUnits().filter(unit => unit.isAvailable())
      const assignment = setup.QuestAssignHelper.computeAutoAssignment(quest, units)

      if (assignment) {
        const assignment_units = {}
        for (const key in assignment) {
          assignment_units[key] = State.variables.unit[assignment[key]]
        }
        const success_obj = setup.QuestDifficulty.computeSuccessObj(
          quest.getTemplate().getDifficulty(),
          quest.getTemplate().getUnitCriterias(),
          assignment_units,
        )
        const success_expl = setup.QuestDifficulty.explainChance(success_obj)
        children.push(menuItem({
          text: `${party.getName()} ${success_expl}`,
          callback: partyCallback(quest, assignment),
          cssclass: cssclass,
        }))
      }
    }
    if (!children.length) {
      children.push(menuItem({
        text: `<span class='lightgraytext'>No eligible party</span>`,
        cssclass: cssclass,
      }))
    }
    return children
  }
}


setup.QuestAssignHelper.computeAutoAssignmentScoreRepIfAny = function (quest) {
  const assignment = setup.QuestAssignHelper.computeAutoAssignment(quest)
  if (!assignment) return ''
  const assignment_units = {}
  for (const key in assignment) {
    assignment_units[key] = State.variables.unit[assignment[key]]
  }
  const success_obj = setup.QuestDifficulty.computeSuccessObj(
    quest.getTemplate().getDifficulty(),
    quest.getTemplate().getUnitCriterias(),
    assignment_units,
  )
  return setup.QuestDifficulty.explainChance(success_obj)
}


/**
 * Try to auto assign units to this quest, if possible.
 * @param {setup.QuestInstance} quest 
 */
setup.QuestAssignHelper.tryAutoAssign = function (quest) {
  if (State.variables.company.player.isCanDeployTeam() &&
    quest.isCostsSatisfied()) {
    const assignment = setup.QuestAssignHelper.computeAutoAssignment(quest)
    if (assignment) {
      doFinalize(quest, assignment)
      return true
    }
  }
  return false
}


/**
 * Construct the assignment menu.
 * @param {setup.QuestInstance} quest 
 */
setup.QuestAssignHelper.getAssignMenu = function (quest) {
  const toolbar_items = []

  if (quest.getTeam()) {
    const chance = setup.QuestDifficulty.explainChance(quest.getScoreObj())
    // Edit and Clear buttons
    toolbar_items.push(
      menuItemAction({
        text: `Edit Team ${chance}`,
        tooltip: `Pick different units to go on this quest`,
        callback: () => {
          setup.QuestAssignHelper.initialize(quest)
          setup.runSugarCubeCommand('<<focgoto "QuestAdhocAssign">>')
        },
      }),
    )

    toolbar_items.push(
      menuItemAction({
        text: 'Cancel',
        tooltip: `Cancel the unit assignments on this quest`,
        callback: () => {
          quest.cancelAssignTeam()
          setup.runSugarCubeCommand('<<refreshquests>>')
        },
      }),
    )
  } else {
    // Assign team button
    const can_deploy = quest.isCostsSatisfied()
    if (can_deploy) {
      toolbar_items.push(
        menuItemAction({
          text: 'Assign Units',
          tooltip: `Complete this quest by assigning units to go on it`,
          callback: () => {
            setup.QuestAssignHelper.initialize(quest)
            setup.runSugarCubeCommand('<<focgoto "QuestAdhocAssign">>')
          },
        }),
      )
    } else {
      toolbar_items.push(
        menuItemText({
          text: 'Costs not satisfied',
        })
      )
    }

    if (State.variables.fort.player.isHasBuilding(setup.buildingtemplate.missioncontrol)) {

      if (can_deploy) {
        toolbar_items.push(
          menuItemAction({
            text: `Auto-Assign <span id="autoassignchance${quest.key}"></span>`,
            tooltip: `Let the game automatically pick units to go on this quest. Does not always pick the optimal set of units, but the game tries its best to do so. You can change how the game picks the units via the gear menu on the right.`,
            callback: () => {
              if (setup.QuestAssignHelper.tryAutoAssign(quest)) {
                setup.runSugarCubeCommand('<<focgoto>>')
              } else {
                setup.runSugarCubeCommand('<<focgoto "QuestAdhocNoAssignment">>')
              }
            },
          }),
        )

        setTimeout(() => {
          const score = setup.QuestAssignHelper.computeAutoAssignmentScoreRepIfAny(quest)

          let wikitext = score
          if (!wikitext) {
            wikitext = `<span class='lightgraytext'>(No assignment found)</span>`
          }
          $(`#autoassignchance${quest.key}`).empty()
          $(`#autoassignchance${quest.key}`).html(wikitext)
        }, 1)

        if (State.variables.partylist.getParties().length) {
          toolbar_items.push(
            menuItemAction({
              text: `Party <i class="sfa sfa-down-dir"></i>`,
              tooltip: `Send units from one particular party to go on this quest`,
              children: partyChildrenCallback(quest),
              clickonly: true,
            }),
          )
        }
      }

      toolbar_items.push(
        State.variables.menufilter.getMenuFilterToolbarSingleMenu(
          setup.MenuFilter.getMenus('questassign'),
          'questassign',
          'score',
        )
      )

      const extramenu = []

      // ignore quests
      if (State.variables.fort.player.isHasBuilding(setup.buildingtemplate.greathall)) {
        let ignore_checked = false
        if (State.variables.company.player.isIgnored(quest.getTemplate())) {
          ignore_checked = true
        }

        extramenu.push(menuItemAction({
          text: `Ignore`,
          tooltip: `If checked, this quest will not be displayed in your quest list. You can show ignored quests by using the "Ignored" filter menu.`,
          checked: ignore_checked,
          callback: () => {
            if (State.variables.company.player.isIgnored(quest.getTemplate())) {
              State.variables.company.player.unignoreQuestTemplate(quest.getTemplate())
            } else {
              State.variables.company.player.ignoreQuestTemplate(quest.getTemplate())
            }
            setup.runSugarCubeCommand('<<refreshquests>>')
          },
        }))
      }

      // remove quests
      if (!quest.getTeam() && quest.isDismissable()) {
        extramenu.push(menuItemDanger({
          text: `Remove quest`,
          tooltip: `<<dangertext 'WARNING'>>: This will remove this quest forever!`,
          callback: () => {
            quest.expire()
            setup.runSugarCubeCommand('<<refreshquests>>')
          },
        }))
      }

      if (extramenu.length) {
        toolbar_items.push(menuItemExtras({
          children: extramenu,
        }))
      }
    }
  }

  return toolbar_items
}
