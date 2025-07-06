// @ts-nocheck
import { domCardName } from "../util/cardnamerep";
/**
 * @param {ContentTemplate} template
 * @returns {setup.DOM.Node}
 */
function getContentTemplateTitleFragment(template) {
    const author = template.getAuthor();
    return html `
    ${setup.TagHelper.getTagsRep('quest', template.getTags())}
    ${template.getDifficulty().rep()}
    ${domCardName(template)}
    ${author.name ? `by ${author.name}` : ``}
  `;
}
/**
 *
 * @param {setup.QuestTemplate} template
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.questtemplate = function (template) {
    return html `
    <div>
      ${setup.DOM.Nav.button(`Edit`, () => {
        State.temporary.questchosen = template;
        return setup.DOM.Util.include('QuestGenSetupExistingDo');
    })}
      ${setup.DOM.Nav.link(`(test)`, () => {
        // @ts-ignore
        State.variables.qDebugQuestTemplate_key = template.key;
        return setup.DOM.Nav.goto('QuestDebugDo');
    })}
      ${getContentTemplateTitleFragment(template)}
    </div>
  `;
};
/**
 *
 * @param {setup.OpportunityTemplate} template
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.opportunitytemplate = function (template) {
    return html `
    <div>
      ${setup.DOM.Nav.button(`Open`, () => {
        State.temporary.opportunitychosen = template;
        return setup.DOM.Util.include('OpportunityGenSetupExistingDo');
    })}
      ${setup.DOM.Nav.link(`(test)`, () => {
        // @ts-ignore
        State.variables.qDebugOpportunityTemplate_key = template.key;
        return setup.DOM.Nav.goto('OpportunityDebugDo');
    })}
      ${getContentTemplateTitleFragment(template)}
    </div>
  `;
};
/**
 *
 * @param {setup.Event} template
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.event = function (template) {
    return html `
    <div>
      ${setup.DOM.Nav.button(`Open`, () => {
        State.temporary.eventchosen = template;
        return setup.DOM.Util.include('EventGenSetupExistingDo');
    })}
      ${setup.DOM.Nav.link(`(test)`, () => {
        // @ts-ignore
        State.variables.qDebugEventTemplate_key = template.key;
        return setup.DOM.Nav.goto('EventDebugDo');
    })}
      ${getContentTemplateTitleFragment(template)}
    </div>
  `;
};
/**
 *
 * @param {setup.Interaction} template
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.interaction = function (template) {
    return html `
    <div>
      ${setup.DOM.Nav.button(`Open`, () => {
        State.temporary.ibase = template;
        setup.DOM.Util.include('InteractionGenSetup');
        setup.runSugarCubeCommand(`<<goto InteractionGen>>`);
    })}
      ${setup.DOM.Nav.link(`(test)`, () => {
        // @ts-ignore
        State.variables.qDebugInteractionTemplate_key = template.key;
        return setup.DOM.Nav.goto('InteractionDebugDo');
    })}
      ${getContentTemplateTitleFragment(template)}
    </div>
  `;
};
/**
 *
 * @param {setup.ActivityTemplate} template
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.activitytemplate = function (template) {
    return html `
    <div>
      ${setup.DOM.Nav.button(`Open`, () => {
        State.temporary.activitychosen = template;
        return setup.DOM.Util.include('ActivityGenSetupExistingDo');
    })}
      ${setup.DOM.Nav.link(`(test)`, () => {
        // @ts-ignore
        State.variables.qDebugActivityTemplate_key = template.key;
        return setup.DOM.Nav.goto('ActivityDebugDo');
    })}
      ${getContentTemplateTitleFragment(template)}
    </div>
  `;
};
