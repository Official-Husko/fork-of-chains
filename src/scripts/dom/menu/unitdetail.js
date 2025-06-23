import { parseRosterMenuToolbar } from "../roster/roster"
import { getRosterListMenuItems } from "../roster/rosterlist"

/**
 * @param {setup.Unit} unit 
 * @returns {setup.DOM.Node}
 */
function getBackButton(unit) {
  return setup.DOM.Nav.link(
    `(Go back)`,
    () => {
      // @ts-ignore
      if (State.variables.gUnitDetailReturnPassage) {
        // @ts-ignore
        const next_to = State.variables.gUnitDetailReturnPassage
        // @ts-ignore
        delete State.variables.gUnitDetailReturnPassage

        setup.DOM.Nav.goto(next_to)
      } else {
        if (unit.isSlave()) {
          setup.DOM.Nav.goto('Dungeons')
        } else {
          setup.DOM.Nav.goto('Lodgings')
        }
      }
    }
  )
}


/**
 * Unit details page, including interaction list, description
 * 
 * @param {setup.Unit} unit
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.unitdetail = function (unit) {
  const outer = []
  outer.push(html`
    <div>
      ${getBackButton(unit)}
    </div>
  `)

  // actions menu
  outer.push(
    parseRosterMenuToolbar(
      unit,
      getRosterListMenuItems({ unit: unit, hide_details: true }),
    )
  )

  // unit card
  outer.push(html`
    <div class="hide-unit-card-image">
      ${setup.DOM.Card.unit(unit, /* hide actions = */ false)}
    </div>
  `)

  // interaction pool
  outer.push(html`
    <div>
      ${setup.DOM.Menu.interactionpool(setup.interactionpool.unit, unit)}
    </div>
    <hr/>
  `)

  outer.push(html`
    <div>
      ${setup.DOM.Menu.unitdescription(unit)}
    </div>
    <hr/>
  `)

  // equipment set
  if (State.variables.fort.player.isHasBuilding('armory')) {
    let equipment_set = unit.getEquipmentSet()

    /**
     * @type {setup.DOM.Node}
     */
    let actions = null
    if (unit.isCanChangeEquipmentSet()) {
      actions = setup.DOM.Nav.link(
        `(change)`,
        () => {
          // @ts-ignore
          State.variables.gUnit_key = unit.key
          setup.DOM.Nav.goto('UnitEquipmentSet')
        }
      )
    }

    if (equipment_set) {
      outer.push(html`
      <div>
        ${setup.Text.replaceUnitMacros(
        `a|Rep a|is currently wearing`,
        { a: unit }
      )}
        ${equipment_set.rep()}:
        ${actions}
      </div>
    `)
    } else {
      equipment_set = setup.EquipmentSet.getDefaultEquipmentSet(unit)
      if (unit.isSlave()) {
        outer.push(html`
      <div>
        ${setup.Text.replaceUnitMacros(
          `a|Rep a|is currently naked:`,
          { a: unit }
        )}
        ${actions}
      </div>
    `)
      } else {
        outer.push(html`
      <div>
        ${setup.Text.replaceUnitMacros(
          `a|Rep a|is currently wearing a|their own basic clothings:`,
          { a: unit }
        )}
        ${actions}
      </div>
    `)
      }
    }

    outer.push(setup.DOM.Card.equipmentset(equipment_set, /* hide actions = */ false, /* show remove = */ false))
    outer.push(html`<hr/>`)
  }

  outer.push(html`
    <div>
      ${getBackButton(unit)}
    </div>
  `)

  return setup.DOM.create('div', {}, outer)
}
