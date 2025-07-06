// @ts-nocheck
import { menuItemAction, menuItemExtras, menuItemText, menuItemTitle } from "../../ui/menu";
import { domCardRep } from "../util/cardnamerep";
/**
 * @param {setup.Contact} contact
 */
function contactNameFragment(contact) {
    return html `
    ${domCardRep(contact)}
    ${contact.isActive() ? '' : html `
      ${setup.DOM.Text.dangerlite('[Inactive]')}
    `}
  `;
}
/**
 * @param {setup.Contact} contact
 * @param {boolean} hide_actions
 * @returns {JQLite[]}
 */
function contactNameActionMenu(contact, hide_actions) {
    /**
     * @type {JQLite[]}
     */
    const menus = [];
    menus.push(menuItemTitle({
        text: contactNameFragment(contact),
    }));
    if (contact.isCanExpire()) {
        menus.push(menuItemText({
            text: `Expires in ${contact.getExpiresIn()} weeks`
        }));
    }
    const extras = [];
    if (!hide_actions) {
        extras.push(menuItemAction({
            text: `Active`,
            tooltip: "If unchecked, this contact will stop giving you their weekly benefit",
            checked: contact.isActive(),
            callback: () => {
                contact.toggleIsActive();
                setup.DOM.Nav.goto();
            },
        }));
    }
    if (extras.length) {
        menus.push(menuItemExtras({
            children: extras,
        }));
    }
    return menus;
}
/**
 * @param {setup.Contact} contact
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.contact = function (contact, hide_actions) {
    const fragments = [];
    fragments.push(setup.DOM.Util.menuItemToolbar(contactNameActionMenu(contact, hide_actions)));
    if (contact.getApplyObjs().length) {
        fragments.push(setup.DOM.create('div', {}, html `
      Every week: ${setup.DOM.Card.cost(contact.getApplyObjs())}
    `));
    }
    return setup.DOM.create('div', { class: 'contactcard' }, fragments);
};
/**
 * @param {setup.Contact} contact
 * @param {boolean} [hide_actions]
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.contactcompact = function (contact, hide_actions) {
    return setup.DOM.Util.menuItemToolbar(contactNameActionMenu(contact, hide_actions));
};
