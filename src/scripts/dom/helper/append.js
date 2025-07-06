"use strict";
// @ts-nocheck
/**
 * Append the content of selector with node
 * @param {string} selector
 * @param {setup.DOM.Node} node
 * @param {boolean} [animate]
 */
setup.DOM.Helper.append = function (selector, node, animate) {
    if (node) {
        if (animate) {
            $(setup.DOM.toDOM(node)).hide().appendTo(selector).fadeIn(500);
        }
        else {
            $(selector).append(setup.DOM.toDOM(node));
        }
    }
};
