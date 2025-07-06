// @ts-nocheck
import { menuItemExtras, menuItemText, menuItemTitle } from "../../ui/menu";
import { domCardRep } from "../util/cardnamerep";
/**
 * @param {setup.ItemPool} pool
 * @returns {setup.DOM.Node}
 */
function itemPoolNameFragment(pool) {
    return html `${domCardRep(pool)}`;
}
/**
 * @param {setup.ItemPool} pool
 * @param {boolean} hide_actions
 * @returns {JQLite[]}
 */
function itemPoolNameActionMenu(pool, hide_actions) {
    /**
     * @type {JQLite[]}
     */
    const menus = [];
    menus.push(menuItemTitle({
        text: itemPoolNameFragment(pool),
    }));
    const average_value = pool.getAverageValue();
    menus.push(menuItemText({
        text: html `Average value: ${setup.DOM.Util.money(average_value)}`
    }));
    const extras = [];
    if (extras.length) {
        menus.push(menuItemExtras({
            children: extras,
        }));
    }
    return menus;
}
/**
 * @param {setup.ItemPool} pool
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.itempool = function (pool, hide_actions) {
    const fragments = [];
    fragments.push(setup.DOM.Util.menuItemToolbar(itemPoolNameActionMenu(pool, hide_actions)));
    for (const [item_key, chance] of pool.getItemChances(/* normalize = */ true)) {
        fragments.push(html `
      <div>
        ${setup.item[item_key].rep()}: ${setup.DOM.Text.percentage(chance)}
      </div>
    `);
    }
    const divclass = `card itemcard`;
    return setup.DOM.create('div', { class: divclass }, fragments);
};
