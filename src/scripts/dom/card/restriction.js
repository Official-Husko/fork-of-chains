"use strict";
// @ts-nocheck
/**
 * Explain a restriction array, with optional unit/quest to supply to it
 * <<requirementcard>>
 *
 * @param {Array<setup.Restriction>} restrictions
 * @param {any} [obj]
 * @param {boolean} [is_show_all]  Whether to show all restrictions, instead of hiding satisfied ones
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.restriction = function (restrictions, obj, is_show_all) {
    const fragments = [];
    if (obj instanceof setup.Unit &&
        obj.isDefiant() &&
        !setup.RestrictionLib.isRestrictionsAllowDefiant(restrictions)) {
        fragments.push(html `
    <span class='restrictioncard'>
      ${obj.rep()} is ${setup.DOM.Text.dangerlite('defiant')}
    </span>
    `);
    }
    for (const restriction of restrictions) {
        if (is_show_all || !restriction.isOk(obj)) {
            fragments.push(html `
        <span class='restrictioncard'>
          ${restriction.explain(obj)}
        </span>
      `);
        }
    }
    if (!is_show_all && restrictions.length) {
        fragments.push(setup.DOM.Util.message('(all requirements)', () => {
            return setup.DOM.Card.cost(restrictions, obj);
        }));
    }
    return setup.DOM.create('div', {}, fragments);
};
