// @ts-nocheck
import { menuItemAction, menuItemText } from "../../ui/menu";
/**
 * @param {setup.Unit} unit
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.changeskillfocus = function (unit) {
    const fragments = [];
    fragments.push(html `
    <div>
      Change ${unit.rep()}'s skill focuses.
      ${setup.DOM.Util.help(html `
        <p>
        Skill focus is the priority skill that the unit will try to focus on.
        These skills will always increase whenever the unit gains a level.
        Set the skill focus according to which skills the unit is talented at!
        More details below.
        </p>
        <div>
        If a skill is one of the skill focuses, then it is guaranteed to gain at least one point per
        level up.
        However, they can sometimes gain more than one point:
        Each skill focus grants a ${(setup.SKILL_FOCUS_MULTI_INCREASE_CHANCE * 100).toFixed(0)}% chance
        the skill will get another extra point at level up.
        You can select the same skills multiple times as a skill focus, which will increase the chance further.
        For example,
        ${setup.skill.brawn.rep()}${setup.skill.brawn.rep()}${setup.skill.arcane.rep()}
        means the unit will always gain
        ${setup.skill.brawn.rep()}${setup.skill.arcane.rep()}
        on level up.
        It has roughly
        ${setup.DOM.Util.help(html `
          Each skill focus chance is calculated independently. So
          ${setup.skill.brawn.rep()}${setup.skill.brawn.rep()}${setup.skill.arcane.rep()}
          means that there are two chances, each with
          ${(setup.SKILL_FOCUS_MULTI_INCREASE_CHANCE * 100).toFixed(0)}% probability,
          that the unit will get an extra
          ${setup.skill.brawn.rep()}
          point.
          This means there is a small chance the unit will get
          ${setup.skill.brawn.rep()}${setup.skill.brawn.rep()}${setup.skill.brawn.rep()}
          during one level up.
        `)}
        ${(2 * setup.SKILL_FOCUS_MULTI_INCREASE_CHANCE * 100).toFixed(0)}%
        chance to get
        an extra ${setup.skill.brawn.rep()} point, and
        ${(setup.SKILL_FOCUS_MULTI_INCREASE_CHANCE * 100).toFixed(0)}% chance to get
        an extra ${setup.skill.arcane.rep()} point.
        The order of the skill focuses does not matter.
        </div>
        <p>
        A unit always gain six skill points on level up -- the remaining points
        after those taken by the skill focuses are allocated to the remaining skills,
        skewed towards the skills they are particularly good at.
        </p>
        </div>
      `)}
    </div>
  `);
    fragments.push(setup.DOM.Card.unit(unit, /* hide actions = */ true));
    const focuses = unit.getSkillFocuses(/* no sort = */ true);
    let z = [];
    for (let i = 0; i < focuses.length; ++i) {
        z.push(i);
    }
    z.forEach(i => {
        const focus = focuses[i];
        const inner = [];
        inner.push(html `
      <div>
      Change focus #${i + 1} from
      ${setup.SkillHelper.explainSkillWithAdditive(unit, focus)}
      to:
      </div>
    `);
        /**
         * @type {JQLite[]}
         */
        const veryin = [];
        setup.skill.forEach(skill => {
            const text = html `${setup.SkillHelper.explainSkillWithAdditive(unit, skill)}`;
            if (skill == focus) {
                veryin.push(menuItemText({
                    text: text,
                }));
            }
            else {
                veryin.push(menuItemAction({
                    text: text,
                    callback: () => {
                        unit.setSkillFocus(i, skill);
                        setup.DOM.Nav.goto();
                    }
                }));
            }
        });
        inner.push(setup.DOM.Util.menuItemToolbar(veryin));
        inner.push(html `<hr/>`);
        fragments.push(setup.DOM.create('div', {}, inner));
    });
    fragments.push(html `
    <div>
      ${setup.DOM.Nav.button('Confirm', () => {
        setup.DOM.Nav.gotoreturn();
    })}
    </div>
  `);
    setup.DOM.Nav.topLeftNavigation(setup.DOM.Nav.return(`Confirm`));
    return setup.DOM.create('div', {}, fragments);
};
