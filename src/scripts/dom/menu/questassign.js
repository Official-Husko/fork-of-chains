"use strict";
// @ts-nocheck
/**
 * @param {setup.QuestInstance} quest
 * @param {string} compare_score_function_name
 * @param {setup.UnitCriteria} criteria
 * @returns
 */
function compareScoreSort(quest, compare_score_function_name, criteria) {
    return (a, b) => {
        // @ts-ignore
        const scorea = criteria[compare_score_function_name](a, quest.getTemplate().getDifficulty());
        const scoreb = criteria[compare_score_function_name](b, quest.getTemplate().getDifficulty());
        if (scorea < scoreb)
            return 1;
        if (scorea > scoreb)
            return -1;
        return 0;
    };
}
/**
 * @param {setup.QuestInstance} quest
 * @param {string} actor_name
 * @param {setup.UnitCriteria} criteria
 * @param {setup.Unit | null} actor_unit
 * @returns {setup.DOM.Node}
 */
function getSelectUnitFragment(quest, actor_name, criteria, actor_unit) {
    const fragments = [];
    fragments.push(html `
    <div>
      <b>Select unit for</b>
      ${setup.DOM.Util.namebold(criteria)}:
      ${setup.DOM.Util.include('QuestAssignHelp')}
    </div>
  `);
    const units = criteria.getEligibleUnits(quest).filter(unit => unit != actor_unit);
    const sort_score = State.variables.menufilter.get('unitquest', 'sortscore');
    if (sort_score == 'crit') {
        units.sort(compareScoreSort(quest, 'computeScoreCrit', criteria));
    }
    else if (sort_score == 'success') {
        units.sort(compareScoreSort(quest, 'computeScoreSuccess', criteria));
    }
    else if (sort_score == 'failure') {
        units.sort(compareScoreSort(quest, 'computeScoreFailure', criteria));
    }
    else {
        units.sort(compareScoreSort(quest, 'computeScore', criteria));
    }
    fragments.push(setup.DOM.Util.filterAll({
        menu: 'unitquest',
        filter_objects: units,
        display_callback: /** @param {setup.Unit} unit */ (unit) => {
            const inner = [];
            inner.push(html `
        ${setup.DOM.Nav.button(`Select`, () => {
                setup.QuestAssignHelper.assignUnit(actor_name, unit, criteria);
                // @ts-ignore
                delete State.variables.gAdhocQuestCriteriaOpenActor;
                setup.DOM.Nav.goto();
            })}
        ${
            // @ts-ignore
            unit.key in State.variables.gAdhocUnitUsed ?
                html `${setup.repImgIcon(setup.Unit.DANGER_IMAGE_URL, `Unit already goin on this quest`)}`
                :
                    html `${unit.repBusyState(true)}`}
        ${setup.DOM.Util.level(unit.getLevel())}
        ${unit.repFull()}
        ${criteria.repActor(unit, quest.getTemplate().getDifficulty())}
      `);
            return setup.DOM.create('div', {}, inner);
        }
    }));
    return setup.DOM.create('div', {}, fragments);
}
/**
 * @param {setup.QuestInstance} quest
 * @param {string} actor_name
 * @param {setup.UnitCriteria} criteria
 * @param {setup.Unit | null} actor_unit
 * @returns {setup.DOM.Node}
 */
function getOpenCriteriaFragment(quest, actor_name, criteria, actor_unit) {
    return html `<span class='toprightspan'>
    <div class='button-full-container'>
      ${setup.DOM.Nav.button(actor_unit ? `Change` : `Select unit`, () => {
        // @ts-ignore
        State.variables.gAdhocQuestCriteriaOpenActor = actor_name;
        setup.DOM.Nav.goto();
    })}
    </div>
  </span>`;
}
function clearVariables() {
    // @ts-ignore
    delete State.variables.gAdhocUnitUsed;
    // @ts-ignore
    delete State.variables.gAdhocQuestActorMap;
    // @ts-ignore
    delete State.variables.gAdhocQuest_key;
    // @ts-ignore
    delete State.variables.gAdhocQuestCriteriaOpenActor;
}
/**
 *
 * @param {setup.QuestInstance} quest
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.questassign = function (quest) {
    /* bypass foctimed */
    State.temporary.foctimed_is_tooltip = true;
    const fragments = [];
    fragments.push(html `
    <div>
      ${setup.DOM.Nav.link('Cancel', () => {
        clearVariables();
    }, 'QuestHub')}
    </div>
  `);
    fragments.push(setup.DOM.Card.quest(quest, /* hide actions = */ true));
    const criterias = quest.getTemplate().getUnitCriterias();
    /* Find out which one to open by default */
    // @ts-ignore
    if (!State.variables.gAdhocQuestCriteriaOpenActor) {
        for (const actor_name in criterias) {
            // @ts-ignore
            if (!State.variables.gAdhocQuestActorMap[actor_name]) {
                // @ts-ignore
                State.variables.gAdhocQuestCriteriaOpenActor = actor_name;
                break;
            }
        }
    }
    // @ts-ignore
    const open_actor = State.variables.gAdhocQuestCriteriaOpenActor;
    /* Show one by one */
    for (const actor_name in criterias) {
        const criteria = criterias[actor_name].criteria;
        // @ts-ignore
        const actor_unit_key = State.variables.gAdhocQuestActorMap[actor_name];
        const actor_unit = State.variables.unit[actor_unit_key];
        const inner = [];
        /* Show name and unit */
        inner.push(html `
      ${setup.DOM.Util.namebold(criteria)}
    `);
        if (actor_unit) {
            inner.push(html `
        : ${actor_unit.rep()} ${criteria.repActor(actor_unit, quest.getTemplate().getDifficulty())}
      `);
        }
        else if (open_actor == actor_name) {
            inner.push(html `
        | ${setup.DOM.Card.criteria(criteria)}
      `);
        }
        if (open_actor == actor_name) {
            /* Show list of units to assign to this criteria */
            inner.push(getSelectUnitFragment(quest, actor_name, criteria, actor_unit));
        }
        else {
            inner.push(getOpenCriteriaFragment(quest, actor_name, criteria, actor_unit));
        }
        fragments.push(setup.DOM.create('div', { class: 'questassignrolecard card' }, inner));
    }
    const all_actors_filled = setup.QuestAssignHelper.isAllActorsFilled();
    if (all_actors_filled) {
        fragments.push(html `
      <div>
        ${setup.QuestAssignHelper.computeSuccessObjRep()}
        ${setup.DOM.Util.include('QuestAssignHelp')}
      </div>
    `);
    }
    {
        const inner = [];
        if (all_actors_filled) {
            inner.push(setup.DOM.Nav.button(`Confirm`, () => {
                setup.QuestAssignHelper.finalize(quest);
                clearVariables();
            }, `QuestHub`));
            setup.DOM.Nav.topLeftNavigation(setup.DOM.Nav.link(`Confirm [space]`, () => {
                setup.QuestAssignHelper.finalize(quest);
                clearVariables();
            }, `QuestHub`));
        }
        inner.push(setup.DOM.Nav.link(`(cancel)`, () => {
            clearVariables();
        }, `QuestHub`));
        fragments.push(setup.DOM.create('div', {}, inner));
    }
    State.temporary.foctimed_is_tooltip = false;
    return setup.DOM.create('div', {}, fragments);
};
