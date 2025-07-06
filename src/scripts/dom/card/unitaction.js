// @ts-nocheck
import { menuItemAction, menuItemExtras, menuItemText, menuItemTitle } from "../../ui/menu";
import { domCardNameBold } from "../util/cardnamerep";
/**
 * @param {setup.UnitAction} action
 * @param {setup.Unit} unit
 * @returns {setup.DOM.Node}
 */
function unitActionNameFragment(action, unit) {
    return html `
    ${setup.TagHelper.getTagsRep('unitaction', action.getTags())}
    <span data-tooltip="${setup.escapeHtml(`<<unitactioncardkey '${action.key}' '${unit.key}' 1>>`)}">
      ${domCardNameBold(action)}
    </span>
  `;
}
/**
 * @param {setup.UnitAction} unit_action
 * @param {setup.Unit} unit
 * @param {boolean} hide_actions
 * @returns {JQLite[]}
 */
function unitActionNameActionMenu(unit_action, unit, hide_actions) {
    /**
     * @type {JQLite[]}
     */
    const menus = [];
    /**
     * @type {JQLite[]}
     */
    const extras = [];
    menus.push(menuItemTitle({
        text: unitActionNameFragment(unit_action, unit),
    }));
    if (!hide_actions) {
        if (unit_action.isCanTrain(unit)) {
            menus.push(menuItemAction({
                text: `Select`,
                callback: () => {
                    unit_action.generateQuest(unit);
                    setup.DOM.Nav.goto('QuestHub');
                },
            }));
        }
        else {
            menus.push(menuItemText({
                text: `Not eligible`,
            }));
        }
    }
    if (extras.length) {
        menus.push(menuItemExtras({
            children: extras,
        }));
    }
    return menus;
}
/**
 * @param {setup.UnitAction} action
 * @param {setup.Unit} unit
 * @returns {setup.DOM.Node}
 */
function unitActionDescriptionFragment(action, unit) {
    State.variables.g = { trainee: unit };
    // @ts-ignore
    State.variables.gQuest = action;
    return setup.DOM.Util.include(action.getDescriptionPassage());
}
/**
 * @param {setup.UnitAction} action
 * @param {setup.Unit} [unit]
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.unitaction = function (action, unit, hide_actions) {
    const fragments = [];
    fragments.push(setup.DOM.Util.menuItemToolbar(unitActionNameActionMenu(action, unit, hide_actions)));
    const restrictions = action.getPrerequisites();
    if (restrictions.length) {
        fragments.push(setup.DOM.Card.restriction(restrictions));
    }
    const unit_restrictions = action.getUnitRequirements();
    if (unit_restrictions.length) {
        fragments.push(setup.DOM.Card.restriction(unit_restrictions, unit));
    }
    if (State.variables.menufilter.get('unitaction', 'display') == 'short') {
        fragments.push(setup.DOM.create('div', {}, setup.DOM.Util.message('(description)', () => {
            return unitActionDescriptionFragment(action, unit);
        })));
    }
    else if (!State.variables.menufilter.get('unitaction', 'display')) {
        fragments.push(unitActionDescriptionFragment(action, unit));
    }
    const is_can_train = unit && !hide_actions && action.isCanTrain(unit);
    let divclass;
    if (unit && !is_can_train) {
        divclass = 'unitactionbadcard card';
    }
    else {
        divclass = 'unitactioncard card';
    }
    return setup.DOM.create('div', { class: divclass }, fragments);
};
/**
 * @param {setup.UnitAction} action
 * @param {setup.Unit} [unit]
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.unitactioncompact = function (action, unit, hide_actions) {
    return setup.DOM.Util.menuItemToolbar(unitActionNameActionMenu(action, unit, hide_actions));
};
