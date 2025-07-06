"use strict";
// @ts-nocheck
/**
 * @param {setup.Skill} skill
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.skill = function (skill) {
    return html `
    <header>
      ${skill.getImageRep()}
      ${setup.DOM.Util.namebold(skill)}
    </header>
    <div>
      ${setup.DOM.Util.twine(skill.getDescription())}
    </div>
  `;
};
