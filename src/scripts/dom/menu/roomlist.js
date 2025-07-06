"use strict";
// @ts-nocheck
/*
Originally from:
http://twinery.org/forum/discussion/comment/17617/
*/
/**
 * Display list of rooms, and optionally place the unplaced ones in the fort.
 *
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.roomlist = function () {
    const all_rooms = State.variables.roomlist.getRoomInstances();
    const repr = [];
    const found = {};
    // get room representatives
    for (const room of all_rooms) {
        const key = room.getTemplate().key;
        if (!found[key]) {
            found[key] = true;
            repr.push(room);
        }
    }
    return setup.DOM.Util.filterAll({
        menu: 'room',
        filter_objects: repr,
        display_callback: room => {
            if (State.variables.menufilter.get('room', 'display') == 'compact') {
                return setup.DOM.Card.roominstancecompact(room, /* hide actions = */ false);
            }
            else {
                return setup.DOM.Card.roominstance(room, /* hide actions = */ false);
            }
        }
    });
};
