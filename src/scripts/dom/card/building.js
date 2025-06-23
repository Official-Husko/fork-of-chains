import { menuItem, menuItemAction, menuItemExtras, menuItemText, menuItemTitle } from "../../ui/menu"
import { domCardRep } from "../util/cardnamerep"
import { buildingTemplateDescriptionFragment, buildingTemplateNameFragment } from "./building_common"

/**
 * @param {setup.BuildingInstance} building
 * @returns {setup.DOM.Node}
 */
function buildingNameFragment(building) {
  const fragments = []
  fragments.push(html`
    ${setup.TagHelper.getTagsRep('buildinginstance', building.getTemplate().getTags())}
  `)
  const level = building.getLevel()
  const max_level = building.getTemplate().getMaxLevel()
  if (max_level > 1) {
    fragments.push(html`
      ${setup.DOM.Util.level(level)} / ${max_level}
    `)
  }
  fragments.push(html`${domCardRep(building)}`)
  return setup.DOM.create('span', {}, fragments)
}

/**
 * @param {setup.BuildingInstance} building 
 * @param {boolean} hide_actions 
 * @returns {JQLite[]}
 */
function buildingInstanceNameActionMenu(building, hide_actions) {
  /**
   * @type {JQLite[]}
   */
  const menus = []

  menus.push(menuItemTitle({
    text: buildingNameFragment(building),
  }))

  if (!hide_actions && building.isHasUpgrade()) {
    if (building.isUpgradable()) {
      menus.push(menuItemAction({
        text: `Upgrade`,
        tooltip: `Upgrade this improvement, potentially getting a new room to place`,
        callback: () => {
          const room = building.getUpgradeRoom()
          if (room) {
            // @ts-ignore
            State.variables.gFortGridBuildRoomKey = room.key
            delete State.variables.gFortGridControl
            setup.DOM.Nav.goto('FortGridBuild')
          } else {
            building.upgrade()
            setup.DOM.Nav.goto()
          }
        },
      }))
      menus.push(menuItemAction({
        text: `Upgrade and auto-place`,
        tooltip: `Upgrade this improvement and automatically place its room (if any) on the fort`,
        callback: () => {
          const room = building.getUpgradeRoom()
          if (!room || State.variables.fortgrid.placeAnywhere(room)) {
            building.upgrade(room)
            setup.DOM.Nav.goto()
          } else {
            if (room) {
              room.delete()
            }
            setup.DOM.Nav.goto()
          }
        },
      }))
    } else {
      menus.push(menuItemText({
        text: `Cannot upgrade`,
      }))
    }
  }

  if (building.isHasUpgrade()) {
    const cost = building.getUpgradeCost()
    if (cost.length) {
      menus.push(menuItemText({
        text: html`${setup.DOM.Card.cost(cost)}`,
      }))
    }
    const sub_room = building.getTemplate().getSubRoomTemplate()
    if (sub_room) {
      menus.push(menuItemText({
        text: html`${sub_room.repFull()}`
      }))
    }
  }

  return menus
}

/**
 * @param {setup.BuildingInstance} building
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
function buildingDescriptionFragment(building, hide_actions) {
  if (!hide_actions && State.variables.menufilter.get('buildinginstance', 'display') == 'short') {
    return setup.DOM.Util.message('(description)', () => {
      return setup.DOM.Util.include(building.getTemplate().getDescriptionPassage())
    })
  } else {
    return html`
          <div>
          ${setup.DOM.Util.include(building.getTemplate().getDescriptionPassage())}
      </div>
        `
  }
}


/**
 * @param {setup.BuildingInstance} building
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.buildinginstance = function (building, hide_actions) {
  const fragments = []

  fragments.push(setup.DOM.Util.menuItemToolbar(buildingInstanceNameActionMenu(building, hide_actions)))

  if (building.isHasUpgrade()) {
    const inner = []
    const restrictions = building.getUpgradePrerequisite()
    if (restrictions.length) {
      inner.push(setup.DOM.Card.restriction(restrictions))
    }
    fragments.push(setup.DOM.create('div', {}, inner))
  }

  fragments.push(buildingDescriptionFragment(building, hide_actions))

  const divclass = `card buildingcard`
  return setup.DOM.create(
    'div',
    { class: divclass },
    fragments,
  )
}


/**
 * @param {setup.BuildingInstance} building
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.buildinginstancecompact = function (building, hide_actions) {
  return setup.DOM.Util.menuItemToolbar(buildingInstanceNameActionMenu(building, hide_actions))
}


/**
 * @param {setup.BuildingTemplate} template
 * @param {boolean} hide_actions 
 * @returns {JQLite[]}
 */
function buildingTemplateNameActionMenu(template, hide_actions) {
  /**
   * @type {JQLite[]}
   */
  const menus = []

  menus.push(menuItemTitle({
    text: buildingTemplateNameFragment(template),
  }))

  if (!hide_actions && !State.variables.fort.player.isHasBuilding(template)) {
    if (template.isBuildable()) {
      menus.push(menuItemAction({
        text: `Build`,
        tooltip: `Build this improvement and place its room on the fort`,
        callback: () => {
          const room = State.variables.fort.player.getBuildRoom(template)
          if (room) {
            // @ts-ignore
            State.variables.gFortGridBuildRoomKey = room.key
            delete State.variables.gFortGridControl
            setup.DOM.Nav.goto('FortGridBuild')
          } else {
            State.variables.fort.player.build(template)
            setup.DOM.Nav.goto()
          }
        }
      }))

      menus.push(menuItemAction({
        text: `Build and auto-place`,
        tooltip: `Build this improvement and automatically place its room somewhere on the fort`,
        callback: () => {
          const room = State.variables.fort.player.getBuildRoom(template)
          if (!room || State.variables.fortgrid.placeAnywhere(room)) {
            State.variables.fort.player.build(template, room)
            setup.DOM.Nav.goto()
          } else {
            if (room) {
              room.delete()
            }
            setup.DOM.Nav.goto()
          }
        },
      }))
    } else {
      menus.push(menuItemText({
        text: `Not buildable`,
      }))
    }

    menus.push(menuItemText({
      text: html`${setup.DOM.Card.cost(template.getCost(0))}`,
    }))
    const main_room = template.getMainRoomTemplate()
    if (main_room) {
      menus.push(menuItemText({
        text: html`${main_room.repFull()}`
      }))
    }
  }

  const extras = []

  if (!hide_actions) {
    if (State.variables.fort.player.isHasBuilding(setup.buildingtemplate.greathall)) {
      extras.push(menuItemAction({
        text: `Hidden`,
        checked: State.variables.fort.player.isTemplateIgnored(template),
        callback: () => {
          if (State.variables.fort.player.isTemplateIgnored(template)) {
            State.variables.fort.player.unignoreTemplate(template)
          } else {
            State.variables.fort.player.ignoreTemplate(template)
          }
          setup.DOM.Nav.goto()
        },
      }))
    }
  }

  if (extras.length) {
    menus.push(menuItemExtras({
      children: extras
    }))
  }

  return menus
}

/**
 * @param {setup.BuildingTemplate} template
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.buildingtemplate = function (template, hide_actions) {
  const fragments = []

  fragments.push(
    setup.DOM.Util.menuItemToolbar(buildingTemplateNameActionMenu(template, hide_actions))
  )

  const restrictions = template.getPrerequisite(0)
  if (restrictions.length) {
    fragments.push(setup.DOM.Card.restriction(restrictions))
  }

  fragments.push(buildingTemplateDescriptionFragment(template))

  let divclass
  if (!hide_actions && !template.isBuildable()) {
    divclass = `card buildingtemplatebadcard`
  } else {
    divclass = `card buildingtemplatecard`
  }

  return setup.DOM.create(
    'div',
    { class: divclass },
    fragments,
  )
}


/**
 * @param {setup.BuildingTemplate} template
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.buildingtemplatecompact = function (template, hide_actions) {
  return setup.DOM.Util.menuItemToolbar(buildingTemplateNameActionMenu(template, hide_actions))
}


