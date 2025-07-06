"use strict";
// @ts-nocheck
/**
 * @param {setup.EquipmentSet} equipment_set
 * @returns {setup.DOM.Node}
 */
function equipmentSetTopRightInfo(equipment_set) {
    const fragments = [];
    fragments.push(html `
    <div>
      Value: ${setup.DOM.Util.money(equipment_set.getValue())}
    </div>
  `);
    const sluttiness = equipment_set.getSluttiness();
    if (sluttiness) {
        fragments.push(html `
      <div>
        Sluttiness: ${setup.DOM.Text.dangerlite(sluttiness)}
      </div>
    `);
    }
    return setup.DOM.create('span', { class: 'toprightspan' }, fragments);
}
/**
 * @param {setup.Equipment} equipment
 * @param {setup.EquipmentSet} equipment_set
 * @returns
 */
function removeEquipmentCallback(equipment, equipment_set) {
    return () => {
        State.variables.armory.unassignEquipment(equipment, equipment_set);
        setup.DOM.Nav.goto();
    };
}
/**
 * @param {setup.EquipmentSet} equipment_set
 * @param {boolean} [hide_actions]
 * @param {boolean} [show_remove_button]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.equipmentset = function (equipment_set, hide_actions, show_remove_button) {
    const fragments = [];
    // value and sluttiness
    fragments.push(equipmentSetTopRightInfo(equipment_set));
    // name and menu toolbar
    if (!hide_actions && !equipment_set.is_default) {
        fragments.push(setup.DOM.Util.menuItemToolbar(equipment_set.getMenu()));
    }
    // slutty indicator
    if (equipment_set.getSluttiness() >= setup.EQUIPMENT_SLAVER_SLUTTY_LIMIT_NORMAL) {
        fragments.push(html `
      <div>
        This equipment is ${setup.DOM.Text.dangerlite('slutty')}
        ${setup.DOM.Util.help(() => {
            return html `
          Slavers cannot wear equipments whose sluttiness is
          ${setup.EQUIPMENT_SLAVER_SLUTTY_LIMIT_NORMAL} or higher.
          ${setup.trait.per_lustful.rep()}${setup.trait.per_sexaddict.rep()}
          increase this limit while ${setup.trait.per_chaste.rep()} decreases it.
        `;
        })}
      </div>
    `);
    }
    // unit restrictions
    {
        const restrictions = equipment_set.getUnitRestrictions();
        if (restrictions.length) {
            fragments.push(setup.DOM.Card.restriction(restrictions, /* obj = */ null, /* is show all = */ true));
        }
    }
    // skill modifiers
    {
        const explanation = setup.SkillHelper.explainSkillMods(equipment_set.getSkillMods());
        if (explanation) {
            fragments.push(html `
        <div>
          ${explanation}
        </div>
      `);
        }
    }
    // bonus traits
    {
        const traits = equipment_set.getTraits();
        if (traits.length) {
            fragments.push(html `
        <div>
          ${traits.map(trait => trait.rep()).join('')}
        </div>
      `);
        }
    }
    // equipment grid
    {
        const inner = [];
        for (const [slot, equipment] of equipment_set.getEquipmentsList()) {
            const very_inner = [];
            if (equipment) {
                very_inner.push(html `${equipment.rep()}`);
            }
            else {
                very_inner.push(html `
          <span class='empty-slot'>${slot.rep()}</span>
          <span class='graytext'>none</span>
        `);
            }
            if (show_remove_button && equipment) {
                very_inner.push(html `
          ${setup.DOM.Util.message(`(remove)`, removeEquipmentCallback(equipment, equipment_set))}
          `);
            }
            inner.push(setup.DOM.create('div', {}, very_inner));
        }
        fragments.push(setup.DOM.create('div', { class: 'equipmentgrid' }, inner));
    }
    return setup.DOM.create('div', { class: 'equipmentsetcard card' }, fragments);
};
/**
 * @param {setup.EquipmentSet} equipment_set
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.equipmentsetcompact = function (equipment_set, hide_actions) {
    // async here?
    if (hide_actions) {
        return html `
      <div>
        ${equipment_set.rep()}
      </div>
    `;
    }
    else {
        return html `
      <div>
        ${setup.DOM.Util.menuItemToolbar(equipment_set.getMenu())}
      </div>
    `;
    }
};
