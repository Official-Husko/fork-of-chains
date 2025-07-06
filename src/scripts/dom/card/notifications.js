"use strict";
// @ts-nocheck
/**
 * @param {string[]} [notifications]  // if left empty, will pop from $notifications
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.notifications = function (notifications) {
    const fragments = [];
    let parsed_notifications;
    if (notifications) {
        parsed_notifications = notifications;
    }
    else {
        parsed_notifications = State.variables.notification.popAll();
    }
    for (const notification of parsed_notifications) {
        fragments.push(setup.DOM.create('div', {}, setup.DOM.Util.twine(notification)));
    }
    if (fragments.length) {
        return setup.DOM.create('div', { class: 'notification-container' }, setup.DOM.create('div', { class: 'notificationcard' }, fragments));
    }
    else {
        return null;
    }
};
