// @ts-nocheck
import { menuItemExtras, menuItemTitle } from "../../ui/menu";
/**
 * @param {setup.Trait} trait
 * @param {boolean} hide_actions
 * @returns {JQLite[]}
 */
function traitNameActionMenu(trait, hide_actions) {
    /**
     * @type {JQLite[]}
     */
    const menus = [];
    /**
     * @type {JQLite[]}
     */
    const extras = [];
    menus.push(menuItemTitle({
        text: `${trait.repFull()} ${State.variables.gDebug ? `(key: '${trait.key}')` : ''}`,
    }));
    if (extras.length) {
        menus.push(menuItemExtras({
            children: extras,
        }));
    }
    return menus;
}
/**
 * @param {setup.Trait} trait
 * @returns {setup.DOM.Node}
 */
export function getTraitEtcFragment(trait) {
    const fragments = [];
    fragments.push(html `
      <div>
      ${setup.DOM.Util.twine(trait.getDescription())}
    </div>
    `);
    if (trait.isHasSkillBonuses()) {
        fragments.push(html `
    <div>
    ${setup.SkillHelper.explainSkillMods(trait.getSkillBonuses())}
      </div>
    `);
    }
    const value = trait.getSlaveValue();
    if (value) {
        fragments.push(html `
    <div>
    Worth: ${setup.DOM.Util.money(value)}
      </div>
    `);
    }
    return setup.DOM.create('div', {}, fragments);
}
/**
 * @param {setup.Trait} trait
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.trait = function (trait, hide_actions) {
    const fragments = [];
    fragments.push(html `
    ${setup.DOM.Util.menuItemToolbar(traitNameActionMenu(trait, hide_actions))}
    ${getTraitEtcFragment(trait)}
    `);
    return setup.DOM.create('div', {}, fragments);
};
