import { menuItemAction, menuItemDanger, menuItemExtras, menuItemText } from "../../ui/menu"

/**
 * @param {setup.Unit} unit
 * @returns {JQLite}
 */
function getSkillFocusMenu(unit) {
  return menuItemAction({
    text: `Skill focus`,
    tooltip: `Modify the unit's skill focus, which primarily determines how they will increase their skills`,
    callback: () => {
      // @ts-ignore
      State.variables.gUnit_skill_focus_change_key = unit.key
      setup.DOM.Nav.goto('UnitChangeSkillFocus')
    },
  })
}

/**
 * @param {{
 * unit: setup.Unit,
 * hide_details?: boolean,
 * }} args
 * 
 * @returns {JQLite[]}
 */
function getNonRetiredUnitMenuItems({ unit, hide_details }) {
  const menus = []
  if (State.variables.fort.player.isHasBuilding('lodgings') && !hide_details && unit.isYourCompany()) {
    menus.push(menuItemAction({
      text: `Details`,
      tooltip: `See unit's details as well as long description`,
      callback: () => {
        // @ts-ignore
        State.variables.gUnit_key = unit.key
        // @ts-ignore
        State.variables.gUnitDetailReturnPassage = State.variables.gPassage
        setup.DOM.Nav.goto('UnitDetail')
      },
    }))
  }

  if (unit.isCanHaveSexWithYou()) {
    menus.push(menuItemAction({
      text: `Sex`,
      tooltip: `Propose sex with the unit. Purely flavor and has no gameplay effects. The unit may refuse, however, depending on circumstances...`,
      callback: () => {
        State.variables.gUnit_key = unit.key
        setup.DOM.Nav.goto('SexPropose')
      },
    }))
  }

  if (State.variables.fort.player.isTrainingUnlocked(unit)) {
    if (unit.isAvailable()) {
      if (State.variables.dutylist.isViceLeaderAssigned()) {
        menus.push(menuItemAction({
          text: `Multi-Action`,
          tooltip: `With a vice-leader, you can now schedule multiple actions for the unit over the next few weeks.`,
          callback: () => {
            // @ts-ignore
            State.variables.gUnitMultiTraining_key = unit.key
            delete State.temporary.chosentraits
            setup.DOM.Nav.goto('MultiTraining')
          },
        }))
      }
    }
    if (
      unit.isAvailable() ||
      (unit.isInjured() && unit.isHome() && State.variables.fort.player.isHasBuilding('treatmentroom'))
    ) {
      menus.push(menuItemAction({
        text: `Action`,
        tooltip: `Arrange some activity for the unit for the next few weeks`,
        callback: () => {
          // @ts-ignore
          State.variables.gUnitSelected_key = unit.key
          setup.DOM.Nav.goto('UnitActionChoose')
        },
      }))
    }
  }

  if (unit.isYourCompany() && State.variables.fort.player.isHasBuilding('warroom') && unit.isCanLearnNewPerk()) {
    menus.push(menuItemAction({
      text: `Learn Perk`,
      tooltip: `Teach the unit a new perk. Available twice per unit throughout their career`,
      callback: () => {
        // @ts-ignore
        State.variables.gUnit_key = unit.key
        setup.DOM.Nav.goto('UnitPerkLearn')
      },
    }))
  }

  if (unit.isSlaver()) {
    menus.push(getSkillFocusMenu(unit))
  }

  return menus
}

/**
 * @param {{
 * unit: setup.Unit,
 * }} args
 * 
 * @returns {JQLite[]}
 */
function getRetiredUnitMenuItems({ unit }) {
  const menus = []

  menus.push(menuItemAction({
    text: `Status`,
    tooltip: `Shows the retiree's current occupation.`,
    callback: () => {
      setup.Dialogs.open({
        title: `Status`,
        classnames: "",
        content: setup.DOM.Card.livingdescription(unit),
      }).then(() => {
        setup.DOM.Nav.goto()
      })
    },
  }))

  return menus
}



/**
 * @param {{
 * unit: setup.Unit,
 * hide_details?: boolean,
 * as_extras_only?: boolean,
 * }} args
 * 
 * @returns {JQLite[]}
 */
export function getRosterListMenuItems({ unit, hide_details, as_extras_only }) {
  /**
   * @type {JQLite[]}
   */
  const menus = []

  if (!unit.isRetired()) {
    menus.push(...getNonRetiredUnitMenuItems({ unit: unit, hide_details: hide_details }))
  } else {
    menus.push(...getRetiredUnitMenuItems({ unit: unit }))
  }

  const misc = []

  if (State.variables.fort.player.isHasBuilding(setup.buildingtemplate.traumacenter)) {
    const traumas = State.variables.trauma.getTraitsWithDurations(unit)
    if (traumas.length) {
      /**
       * @type {setup.DOM.Node[]}
       */
      const trauma_fragments = [
        html`<div>${unit.rep()} currently has the following temporary trauma/boons:</div>`
      ].concat(traumas.map(trauma =>
        html`<div>${trauma[0].rep()}: ${trauma[1]} weeks</div>`
      ))
      misc.push(menuItemAction({
        text: `View traumas / boons`,
        callback: () => {
          setup.Dialogs.open({
            title: `Traumas / Boons`,
            content: setup.DOM.create('div', {}, trauma_fragments),
          })
        },
      }))
    }
  }

  if (State.variables.skillboost.isHasAnyBoost(unit)) {
    misc.push(menuItemAction({
      text: `View skill boosts`,
      tooltip: `Skill boosts give the unit a permanent boost to one of their skills. However, a unit cannot have too many boosts, and when they acquire one while already having some existing boosts, the old boosts may decay.`,
      callback: () => {
        const boosts = State.variables.skillboost.getBoosts(unit)
        const explanations = setup.SkillHelper.explainSkills(boosts)
        setup.Dialogs.open({
          title: `Skill boosts`,
          content: html`
            <div>
              The following are the amount of ${unit.rep()}'s skills that has been boosted:
              ${setup.DOM.Util.include('SkillBoostHelpText')}
            </div>
            <div>
              ${explanations}
            </div>
          `
        })
      },
    }))
  }

  if (unit.isSlaver()) {
    if (State.variables.titlelist.getAllTitles(unit).length > setup.TITLE_MAX_ASSIGNED) {
      misc.push(menuItemAction({
        text: `View / change active titles`,
        tooltip: `Swap the active titles on the unit. While a unit can have an unlimited number of positive titles, it can only have a few active at a time.`,
        callback: () => {
          // @ts-ignore
          State.variables.gUnit_key = unit.key
          setup.DOM.Nav.goto('UnitChangeTitles')
        },
      }))
    }
  }

  if (unit.isCanChangeEquipmentSet()) {
    misc.push(menuItemAction({
      text: `Change equipment set`,
      tooltip: `Swap the unit's equipment set`,
      callback: () => {
        // @ts-ignore
        State.variables.gUnit_key = unit.key
        setup.DOM.Nav.goto('UnitEquipmentSet')
      },
    }))
  }

  misc.push(menuItemAction({
    text: `Change nickname`,
    tooltip: `Change how you will address the unit`,
    callback: () => {
      // @ts-ignore
      State.variables.gUnit_key = unit.key
      setup.DOM.Nav.goto('UnitChangeName')
    },
  }))

  misc.push(menuItemAction({
    text: `Change portrait`,
    tooltip: `Swap the unit's portrait with another one or a custom one`,
    callback: () => {
      setup.Dialogs.openUnitImagePicker(unit).then(() => {
        setup.DOM.Nav.goto()
      })
    },
  }))

  if (unit.isRetired()) {
    if (!unit.isEngaged() && State.variables.company.player.isCanAddUnitWithJob(setup.job.slaver)) {
      const cost = setup.RETIRE_RERECRUIT_COST_MONEY

      misc.push(menuItemAction({
        text: html`Re-hire for ${setup.DOM.Util.money(cost)}`,
        tooltip: `Pay the unit to return to your company as a proper slaver`,
        callback: () => {
          State.variables.gUnit_key = unit.key
          setup.DOM.Nav.goto(`RehireRetiredConfirm`)
        },
      }))
    } else if (unit.isEngaged()) {
      misc.push(menuItemText({
        text: `Unit is busy and cannot be re-hired`
      }))
    } else {
      misc.push(menuItemText({
        text: `Your slaver roster is full`
      }))
    }
  }

  if (State.variables.retiredlist.isCanRetire(unit)) {
    misc.push(menuItemDanger({
      text: `Retire unit`,
      tooltip: `Retire the unit. A retired unit will be removed from your company, but will be available in the retirees list. You can re-hire them at a later date should you change your mind, although at a cost.`,
      callback: () => {
        State.variables.gUnit_key = unit.key
        setup.DOM.Nav.goto('UnitRetireConfirm')
      },
    }))
  }

  if (unit.isRetired()) {
    if (!unit.isEngaged()) {
      misc.push(menuItemDanger({
        text: `Remove unit permanently`,
        tooltip: `Permanently sever contacts with the unit. They will be gone forever, and you will never see them ever again.`,
        callback: () => {
          State.variables.gUnit_key = unit.key
          setup.DOM.Nav.goto('RetiredUnitDismissConfirm')
        },
      }))
    } else {
      misc.push(menuItemText({
        text: `Unit is busy and cannot be removed`,
      }))
    }
  } else if (unit.isCanBeDismissed()) {
    misc.push(menuItemDanger({
      text: `Dismiss unit`,
      tooltip: `Permanently dismiss unit from your company. They will be gone forever, and you will never see them ever again.`,
      callback: () => {
        State.variables.gUnit_key = unit.key
        setup.DOM.Nav.goto('UnitDismissConfirm')
      },
    }))
  } else if (unit.isYou()) {
    misc.push(menuItemText({
      text: `This is you`,
    }))
  } else {
    misc.push(menuItemText({
      text: `Unit can't be dismissed right now`,
    }))
  }

  if (State.variables.gDebug) {
    misc.push(menuItemDanger({
      text: `Debug tags`,
      callback: () => {
        setup.Dialogs.open({
          title: `Unit tags`,
          content: html`${unit.getTags().join(', ')}`,
        })
      }
    }))
    misc.push(menuItemDanger({
      text: 'Debug edit',
      callback: () => {
        // @ts-ignore
        State.variables.gUnit_key = unit.key
        setup.DOM.Nav.goto('UnitDebugDo')
      },
    }))
  }

  if (as_extras_only) {
    return menus.concat(misc)
  } else if (misc.length) {
    menus.push(menuItemExtras({
      children: misc,
    }))
  }

  return menus
}


/**
 * @param {setup.Unit[]} units
 * @param {string} menu
 * 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Roster.rosterlist = function (units, menu) {
  return setup.DOM.Roster.show({
    menu: menu,
    units: units,
    actions_callback: /** @param {setup.Unit} unit */ (unit) => {
      return getRosterListMenuItems({ unit: unit })
    }
  })
}
