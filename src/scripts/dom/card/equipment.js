import { menuItemDanger, menuItemExtras, menuItemText, menuItemTitle } from "../../ui/menu"
import { domCardRep } from "../util/cardnamerep"

/**
 * @param {setup.Equipment} equipment
 * @returns {setup.DOM.Node}
 */
function equipmentNameFragment(equipment) {
  const equipped = equipment.getEquippedNumber()
  const spare = equipment.getSpareNumber()
  return html`
    ${domCardRep(equipment)}
    <span data-tooltip="You have ${equipped} equipped and ${spare} spare">
      x ${equipped + spare}
    </span>
  `
}

/**
 * @param {setup.Equipment} equipment
 * @param {boolean} hide_actions 
 * @returns {JQLite[]}
 */
function equipmentNameActionMenu(equipment, hide_actions) {
  /**
   * @type {JQLite[]}
   */
  const menus = []

  menus.push(menuItemTitle({
    text: equipmentNameFragment(equipment),
  }))

  menus.push(menuItemText({
    text: equipment.getSlot().rep()
  }))

  const sluttiness = equipment.getSluttiness()
  if (sluttiness) {
    menus.push(menuItemText({
      text: html`Slutty: ${setup.DOM.Text.dangerlite(sluttiness)}`,
    }))
  }

  const value = equipment.getValue()
  menus.push(menuItemText({
    text: setup.DOM.Util.money(value)
  }))

  const sell_value = equipment.getSellValue()
  if (!hide_actions &&
    sell_value &&
    State.variables.fort.player.isHasBuilding(setup.buildingtemplate.bazaar)) {
    menus.push(menuItemDanger({
      text: html`Sell (${setup.DOM.Util.money(sell_value)})`,
      tooltip: `Sell this equipment for a profit`,
      callback: () => {
        State.variables.company.player.addMoney(equipment.getSellValue())
        State.variables.armory.removeEquipment(equipment)
        setup.DOM.Nav.goto()
      }
    }))
  }

  const extras = []
  if (State.variables.gDebug) {
    extras.push(menuItemDanger({
      text: '(Debug) Remove',
      callback: () => {
        State.variables.armory.removeEquipment(equipment)
        setup.DOM.Nav.goto()
      },
    }))
  }

  if (extras.length) {
    menus.push(menuItemExtras({
      children: extras,
    }))
  }

  return menus
}


/**
 * @param {setup.Equipment} equipment
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.equipment = function (equipment, hide_actions) {
  const fragments = []
  fragments.push(
    setup.DOM.Util.menuItemToolbar(
      equipmentNameActionMenu(equipment, hide_actions)))

  const restrictions = equipment.getUnitRestrictions()
  if (restrictions.length) {
    fragments.push(html`
      <div>
        Requires: ${setup.DOM.Card.cost(restrictions)}
      </div>
    `)
  }

  const explanation = setup.SkillHelper.explainSkillMods(equipment.getSkillMods())
  if (explanation) {
    fragments.push(setup.DOM.create('div', {}, explanation))
  }

  {  /* equipment traits */
    const trait_explanation = equipment.repTraits()
    if (trait_explanation) {
      fragments.push(setup.DOM.create('div', {}, html`Grants: ${trait_explanation}`))
    }
  }

  fragments.push(html`
    <div>
      ${equipment.getDescription()}
    </div>
  `)

  return setup.DOM.create(
    'div',
    { class: 'equipmentcard' },
    fragments,
  )

}


/**
 * @param {setup.Equipment} equipment
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.equipmentcompact = function (equipment, hide_actions) {
  return setup.DOM.Util.menuItemToolbar(
    equipmentNameActionMenu(equipment, hide_actions))
}
