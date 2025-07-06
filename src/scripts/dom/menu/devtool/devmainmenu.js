"use strict";
// @ts-nocheck
/**
 * Generate menu on the left.
 *
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.devmainmenu = function () {
    const fragments = [];
    fragments.push(html `
    <div>
      ${setup.DOM.Nav.link("Settings", () => {
        setup.Dialogs.open({
            title: "Settings",
            passage: "SettingsBase",
        });
    })}
    </div>
  `);
    return setup.DOM.create('span', {}, fragments);
};
