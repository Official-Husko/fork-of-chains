// @ts-nocheck
import { domCardNameBold } from "../util/cardnamerep";
/**
 * @param {setup.Title} title
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.title = function (title) {
    const fragments = [];
    {
        const inner_fragments = [];
        inner_fragments.push(html `
      ${domCardNameBold(title)}
    `);
        if (title.isNegative()) {
            inner_fragments.push(html `
        <span data-tooltip="A negative title confers penalty instead of a benefit. Negative titles don't fully stack -- only the highest penalty to each skill applies.">
          ${setup.DOM.Text.dangerlite('[Negative Title]')}
        </span>
      `);
        }
        const value = title.getSlaveValue();
        if (value) {
            inner_fragments.push(html `
        <span class='toprightspan'>
          Value: ${setup.DOM.Util.money(value)}
        </span>
      `);
        }
        fragments.push(setup.DOM.create('div', {}, inner_fragments));
    }
    const explanation = setup.SkillHelper.explainSkills(title.getSkillAdds());
    if (explanation) {
        fragments.push(setup.DOM.create('div', {}, explanation));
    }
    fragments.push(html `
    <div>
      ${setup.DOM.Util.twine(title.getDescription())}
    </div>
  `);
    return setup.DOM.create('div', { class: `titlecard${title.isNegative() ? '-negative' : ''}` }, fragments);
};
