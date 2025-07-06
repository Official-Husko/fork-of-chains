"use strict";
// @ts-nocheck
/**
 * Prints a banter, just the text, no other information.
 * Use Card.banter if you want everything, including the friendship diff.
 * @param {setup.BanterInstance} banter
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.bantertext = function (banter) {
    return html `${banter.getTexts()}`;
};
/**
 * Prints an author raw
 * @param {setup.BanterInstance} banter
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.banter = function (banter) {
    const initiator = banter.getInitiator();
    const target = banter.getTarget();
    const friendship_amount = banter.getFriendshipAmt();
    const fragments = [];
    fragments.push(html `
    ${setup.DOM.Card.bantertext(banter)}
  `);
    let inner_fragment;
    if (State.variables.fort.player.isHasBuilding('moraleoffice')) {
        inner_fragment = setup.DOM.Util.friendship(friendship_amount, /* prefix = */ '+');
    }
    else {
        if (friendship_amount >= 0) {
            inner_fragment = setup.DOM.create('span', { class: 'friendshipspanplus' }, '+ friendship');
        }
        else {
            inner_fragment = setup.DOM.create('span', { class: 'friendshipspanmin' }, '+ rivalry');
        }
    }
    const tooltip = `<<bantercarddetails '${initiator.key}' '${target.key}' ${friendship_amount}>>`;
    fragments.push(html `
    <small data-tooltip="${tooltip}">
      ${inner_fragment}
    </small>
  `);
    return setup.DOM.create('span', {}, fragments);
};
