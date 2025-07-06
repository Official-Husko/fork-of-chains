// @ts-nocheck
import { printDebugInfos } from "../../../util/debugprint";
import { advanceWeekAfterResolvingQuests, advanceWeekBeforeResolvingQuests } from "./advanceWeek";
import { showWeekendBanters } from "./banter";
import { showEndweekEvents } from "./events";
import { showEndweekQuests } from "./quests";
import { payWages } from "./wages";
/**
 * Display week-end screen and all the associated computations.
 *
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.weekend = function () {
    // turn off menu
    State.variables.gMenuVisible = false;
    // special cases for tutorial scenario
    if (State.variables.calendar.getWeek() == 1 && !State.variables.gDebug) {
        if (State.variables.company.player.isCanDeployTeam()) {
            setup.notify(`You must assign a team to the "Establish Base" quest`);
            return setup.DOM.Util.include('QuestHub');
        }
    }
    else if (State.variables.calendar.getWeek() == 2 &&
        !State.variables.fort.player.isHasBuilding(setup.buildingtemplate.scouthut)) {
        setup.notify(`You must build the ${setup.buildingtemplate.scouthut.rep()} to proceed`);
        return setup.DOM.Util.include('QuestHub');
    }
    return doWeekend();
};
function autoSave() {
    if (State.variables.settings.shouldAutosave(State.variables.calendar.getWeek())) {
        const name = State.variables.company.player.getName();
        const week = State.variables.calendar.getWeek();
        // do it asynchronously
        setTimeout(() => {
            SugarCube.Save.slots.save(7, `Autosave Wk ${week}: ${name}`);
        }, 0);
    }
}
/**
 * @returns {setup.DOM.Node}
 */
function doWeekend() {
    const fragments = [];
    fragments.push(showWeekendBanters());
    fragments.push(payWages());
    fragments.push(advanceWeekBeforeResolvingQuests());
    // pop notifications, to display later
    const notifications = State.variables.notification.popAll();
    const quest_obj = showEndweekQuests();
    fragments.push(quest_obj.node);
    notifications.push(...quest_obj.notifications);
    const event_obj = showEndweekEvents();
    fragments.push(event_obj.node);
    notifications.push(...event_obj.notifications);
    fragments.push(advanceWeekAfterResolvingQuests());
    // set destination passage after this.
    let next_passage;
    if (State.variables.fort.player.isHasBuilding(setup.buildingtemplate.mailroom) &&
        State.variables.opportunitylist.getOpportunities().length) {
        next_passage = 'OpportunityList';
    }
    else {
        next_passage = 'QuestHub';
    }
    // alter gPassage so that refreshing will lead to the next page instead of repeating the week.
    State.variables.gPassage = next_passage;
    autoSave();
    fragments.push(html `
    <div>
      ${setup.DOM.Nav.move(`Continue`, next_passage)}
    </div>
  `);
    setup.DOM.Nav.topLeftNavigation(setup.DOM.Nav.move(`Continue [space]`, next_passage));
    notifications.push(...State.variables.notification.popAll());
    if (notifications.length) {
        fragments.push(setup.DOM.Card.notifications(notifications));
    }
    return setup.DOM.create('div', {}, fragments);
}
/**
 * AutoSave and point to the quest hub page.
 *
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.gameinit = function () {
    autoSave();
    if (State.variables.gDebug) {
        setup.DOM.Nav.goto('QuestHub');
        return null;
    }
    else {
        setup.DOM.Nav.topLeftNavigation(setup.DOM.Nav.move(`Continue [space]`, 'QuestHub'));
        return html `
      <div>
        ${setup.DOM.Nav.button(`Begin the game`, () => {
        }, 'QuestHub')}
      </div>
    `;
    }
};
/**
 * Output stats to console
 */
setup.DOM.Menu.debugComputeStats = function () {
    autoSave();
    printDebugInfos();
};
