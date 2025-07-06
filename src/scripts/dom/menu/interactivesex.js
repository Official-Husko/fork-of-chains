// @ts-nocheck
import { menuItem, menuItemText } from "../../ui/menu";
/**
 * Begin interactive sex with these units
 * @param {setup.Unit[]} units
 * @param {setup.SexLocation} [location]  // will randomize if not given.
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.interactivesex = function (units, location) {
    // Get init values
    const participants = setup.SexInstance.initParticipants(units);
    // Get sex object temporarily
    const sex = new setup.SexInstance(location || setup.sexlocation.dungeonsfloor, participants);
    if (!location) {
        // randomize starting location
        const new_location = setup.rng.choice(setup.SexLocation.getAllAllowedLocations(sex));
        sex.setLocation(new_location);
    }
    // Check if player is here and want to change things.
    if (units.includes(State.variables.unit.player)) {
        // They are here. In this case, return a setup
        return interactiveSexSetup(sex, !!location);
    }
    else {
        return interactiveSexDo(sex);
    }
};
/**
 * @returns {setup.DOM.Node}
 */
function interactiveSexDoneButton() {
    return html `
    ${setup.DOM.Nav.link('(Finish sex)', () => {
        setup.SexInstance.cleanup();
        // @ts-ignore
        delete State.variables.gInteractiveSexUnitIds;
        setup.DOM.Nav.gotoreturn();
    })}
  `;
}
/**
 * Lists all the participants and their current states.
 * @param {setup.SexInstance} sex
 * @param {setup.SexPosition[]} positions
 * @returns {setup.DOM.Node}
 */
function participantsDisplayInternal(sex, positions) {
    const fragments = [];
    for (const position of positions) {
        const unit = sex.getUnitAtPosition(position);
        if (unit) {
            fragments.push(html `
         <div>${sex.repUnit(unit)} (${sex.getPace(unit).rep()})</div>
         <div>
          ${setup.SexUtil.repArousal(sex.getArousal(unit))}
          ${setup.SexUtil.repDiscomfort(sex.getDiscomfort(unit))}
          ${setup.SexUtil.repEnergy(sex.getEnergy(unit))}
        </div>
      `);
        }
    }
    return setup.DOM.create('div', {}, fragments);
}
/**
 * Lists all the participants and their current states.
 * @param {setup.SexInstance} sex
 * @returns {setup.DOM.Node}
 */
function participantsDisplay(sex) {
    return participantsDisplayInternal(sex, setup.SexPosition.getAllPositions());
}
/**
 * Draw the current formation of the participants
 * @param {setup.SexInstance} sex
 * @returns {setup.DOM.Node}
 */
function participantsDraw(sex) {
    const fragments = [];
    for (const position of [setup.sexposition.front, setup.sexposition.center, setup.sexposition.back]) {
        const unit = sex.getUnitAtPosition(position);
        let image = null;
        let tooltip_positions = [position];
        if (unit) {
            if (unit.isYou()) {
                image = sex.getPose(unit).repBigPlayer(position, sex);
            }
            else {
                image = sex.getPose(unit).repBig(position, sex);
            }
        }
        if (position == setup.sexposition.center) {
            const top = setup.sexposition.top;
            const topunit = sex.getUnitAtPosition(top);
            if (topunit) {
                // topunit dominates the image
                if (topunit.isYou()) {
                    image = sex.getPose(topunit).repBigPlayer(position, sex);
                }
                else {
                    image = sex.getPose(topunit).repBig(position, sex);
                }
                // @ts-ignore
                tooltip_positions = [top].concat(tooltip_positions);
            }
        }
        if (image) {
            const tooltip = `<<set _dom = setup.DOM.interactiveSexTooltip(${tooltip_positions.map(a => `"${a.key}"`).join(', ')})>><<attach _dom>>`;
            fragments.push(html `
        <span data-tooltip='${tooltip}'>
          ${image}
        </span>
      `);
        }
        else {
            fragments.push(html `${setup.SexPose.repBigNone()}`);
        }
    }
    return setup.DOM.create('div', {}, fragments);
}
setup.DOM.interactiveSexTooltip = function (...args) {
    return participantsDisplayInternal(State.temporary.gSex, args.map(key => setup.sexposition[key]));
};
function infoDisplay(sex) {
    setup.DOM.Helper.replace('#menudiv', setup.DOM.create('div', {}, [
        participantsDisplay(sex),
        participantsDraw(sex),
        html `
          <div>
            Location: ${sex.getLocation().rep()}
          </div>
        `,
    ]));
}
/**
 * Whether this action should be hidden from the choices
 * @param {setup.SexAction} action
 */
function isHideAction(action) {
    if (action instanceof setup.SexActionClass.DoNothing)
        return true;
    if (action instanceof setup.SexActionClass.SexEnd)
        return true;
    if (action instanceof setup.SexAction.PoseChange)
        return true;
    if (action instanceof setup.SexAction.PoseChangeOther)
        return true;
    if (action instanceof setup.SexAction.PositionChange)
        return true;
    if (action instanceof setup.SexAction.PositionChangeOther)
        return true;
    if (action instanceof setup.SexAction.UnequipSelf)
        return true;
    if (action instanceof setup.SexAction.UnequipOther)
        return true;
    if (action instanceof setup.SexActionClass.EquipStrapon)
        return true;
}
/**
 * See if player want to change things first before moving on.
 * @param {setup.SexInstance} sex
 * @param {boolean} is_location_fixed
 * @returns {setup.DOM.Node}
 */
function interactiveSexSetup(sex, is_location_fixed) {
    const div_id = 'interactive_sex_setup_div';
    return setup.DOM.createRefreshable("div", { id: div_id }, () => {
        const fragments = [];
        /* return button */
        fragments.push(html `
      <div>
        ${interactiveSexDoneButton()}
      </div>
    `);
        /* participants */
        // without this it does not work on first load because the ele has not been created yet.
        setTimeout(() => { infoDisplay(sex); }, 1);
        if (!is_location_fixed) {
            /* location */
            let chosen_location = null;
            function locationCallback(location) {
                return () => {
                    chosen_location = location;
                    Dialog.close();
                };
            }
            const allowed = setup.SexLocation.getAllAllowedLocations(sex);
            fragments.push(html `
        <div>
          Location: ${sex.getLocation().rep()}
          ${setup.DOM.Nav.link('(change)', () => {
                const inner_fragments = [];
                for (const location of allowed) {
                    inner_fragments.push(html `
                <div>
                  ${setup.DOM.Nav.button('Select', locationCallback(location))}
                  ${location.rep()}
                </div>
              `);
                }
                setup.Dialogs.open({
                    title: "Pick location",
                    classnames: "",
                    content: html `${setup.DOM.create('div', {}, inner_fragments)}`,
                }).then(() => {
                    if (chosen_location) {
                        sex.setLocation(chosen_location);
                        setup.DOM.refresh(`#${div_id}`);
                    }
                });
            })}
        </div>
      `);
        }
        /* your pace */
        let chosen_pace = null;
        function paceCallback(pace) {
            return () => {
                chosen_pace = pace;
                Dialog.close();
            };
        }
        const allowed_pace = setup.SexPace.getPaceChances(State.variables.unit.player).filter(ch => ch[1]).map(ch => ch[0]);
        fragments.push(html `
      <div>
        Your mood: ${sex.getPace(State.variables.unit.player).rep()}
        ${setup.DOM.Nav.link('(change)', () => {
            const inner_fragments = [];
            for (const pace of allowed_pace) {
                inner_fragments.push(html `
              <div>
                ${setup.DOM.Nav.button('Select', paceCallback(pace))}
                ${pace.rep()}
              </div>
            `);
            }
            setup.Dialogs.open({
                title: "Pick mood",
                classnames: "",
                content: html `${setup.DOM.create('div', {}, inner_fragments)}`,
            }).then(() => {
                if (chosen_pace) {
                    sex.setPace(State.variables.unit.player, chosen_pace);
                    setup.DOM.refresh(`#${div_id}`);
                }
            });
        })}
      </div>
    `);
        // Start button
        function startCallback() {
            setup.DOM.Helper.replace(`#${div_id}`, interactiveSexDo(sex));
        }
        fragments.push(html `
      <div>
        ${setup.DOM.Nav.button('Begin', startCallback)}
      </div>
    `);
        setup.DOM.Nav.topLeftNavigation(setup.DOM.Nav.link(`Begin [space]`, startCallback));
        return setup.DOM.create('div', { id: 'interactive-sex-setup-container' }, fragments);
    });
}
/**
 * @param {setup.SexScene} scene
 * @param {setup.SexAction} action
 * @param {string} interface_div_id
 */
function selectAction(scene, action, interface_div_id) {
    scene.advanceTurn(action);
    setup.DOM.refresh(`#${interface_div_id}`);
}
/**
 * @param {setup.SexInstance} sex
 * @param {setup.SexScene} scene
 * @param {string} interface_div_id
 */
function getPlayerActionsFragment(sex, scene, interface_div_id) {
    function actionCallback(action) {
        return () => {
            selectAction(scene, action, interface_div_id);
        };
    }
    const allowed_actions = scene.getPossibleActions(State.variables.unit.player);
    const can_select = allowed_actions.filter(action => !isHideAction(action));
    const to_pick = Math.min(setup.Sex.UI_PLAYER_ACTIONS, can_select.length);
    let actions = setup.rng.choicesRandom(can_select, to_pick);
    // If the action taken last turn is still available, put it on top
    const latest = sex.getLatestAction(State.variables.unit.player);
    if (latest) {
        const latest_copy = can_select.filter(action => action instanceof latest.constructor);
        if (latest_copy.length) {
            actions = actions.filter(action => action != latest_copy[0]);
            if (actions.length > to_pick) {
                actions.splice(actions.length - 1, 1);
            }
            actions = [latest_copy[0]].concat(actions);
        }
    }
    const fragments = [];
    for (const action of actions) {
        fragments.push(html `
      <div>
        ${setup.DOM.Nav.button('Select', actionCallback(action))}
        ${setup.TagHelper.getTagsRep('sexaction', action.getTags())}
        ${action.rep(sex)}
      </div>
    `);
    }
    return setup.DOM.create('div', {}, fragments);
}
/**
 * @param {setup.SexInstance} sex
 * @param {setup.SexScene} scene
 * @param {string} interface_div_id
 * @param {setup.SexAction[]} actions
 * @param {string} menu_name
 */
function getActionsMenuItem(sex, scene, interface_div_id, actions, menu_name) {
    const children = () => {
        const res = [];
        for (const action of actions) {
            res.push(menuItem({
                text: `${action.title(sex)}`,
                callback: () => {
                    selectAction(scene, action, interface_div_id);
                },
            }));
        }
        return res;
    };
    if (State.variables.settings.mobilemode) {
        return children();
    }
    else {
        return menuItem({
            text: `${menu_name}`,
            children: children,
        });
    }
}
/**
 * @param {setup.SexAction[]} allowed_actions
 * @param {setup.Unit} unit
 * @param {setup.SexInstance} sex
 * @param {setup.SexScene} scene
 * @param {string} interface_div_id
 */
function sexMenuFragmentUnit(allowed_actions, unit, sex, scene, interface_div_id) {
    const menu_items = [];
    let text = '';
    if (unit == State.variables.unit.player) {
        text = 'You';
        menu_items.push(getActionsMenuItem(sex, scene, interface_div_id, allowed_actions.filter(a => a instanceof setup.SexAction.PoseChange), 'Pose'));
        menu_items.push(getActionsMenuItem(sex, scene, interface_div_id, allowed_actions.filter(a => a instanceof setup.SexAction.PositionChange), 'Position'));
        // self actions
        menu_items.push(getActionsMenuItem(sex, scene, interface_div_id, allowed_actions.filter(a => (a instanceof setup.SexAction.UnequipSelf ||
            a instanceof setup.SexActionClass.EquipStrapon)), 'Equipment'));
    }
    else {
        text = unit.getName();
        // other participant actions
        menu_items.push(getActionsMenuItem(sex, scene, interface_div_id, allowed_actions.filter(a => a instanceof setup.SexAction.PoseChangeOther && a.getActorUnit('b') == unit), 'Pose'));
        menu_items.push(getActionsMenuItem(sex, scene, interface_div_id, allowed_actions.filter(a => a instanceof setup.SexAction.PositionChangeOther && a.getActorUnit('b') == unit), 'Position'));
        menu_items.push(getActionsMenuItem(sex, scene, interface_div_id, allowed_actions.filter(a => a instanceof setup.SexAction.UnequipOther && a.getActorUnit('b') == unit), 'Equipment'));
    }
    let actual_menu_items = [];
    if (State.variables.settings.mobilemode) {
        // aggregate the childrens
        for (const menu of menu_items)
            actual_menu_items.push(...menu);
    }
    else {
        actual_menu_items = menu_items;
    }
    if (!actual_menu_items.length) {
        actual_menu_items.push(menuItemText({
            text: 'No possible action',
        }));
    }
    return menuItem({
        text: `${text} <i class='sfa sfa-down-dir'></i>`,
        clickonly: true,
        // @ts-ignore
        children: actual_menu_items,
    });
}
/**
 * @param {setup.SexInstance} sex
 * @param {setup.SexScene} scene
 * @param {string} interface_div_id
 */
function sexMenuFragment(sex, scene, interface_div_id) {
    const menu_items = [];
    const allowed_actions = scene.getPossibleActions(State.variables.unit.player);
    for (const unit of sex.getUnits()) {
        menu_items.push(sexMenuFragmentUnit(allowed_actions, unit, sex, scene, interface_div_id));
    }
    const do_nothing = allowed_actions.filter(action => action instanceof setup.SexActionClass.DoNothing);
    if (do_nothing.length) {
        menu_items.push(menuItem({
            text: `<span data-tooltip="Do nothing"><i class='sfa sfa-pause'></i></span>`,
            callback() {
                selectAction(scene, do_nothing[0], interface_div_id);
            }
        }));
    }
    function doRandomCallback() {
        scene.advanceTurn();
        setup.DOM.refresh(`#${interface_div_id}`);
    }
    menu_items.push(menuItem({
        text: `<span data-tooltip="Random"><i class='sfa sfa-play'></i></span>`,
        callback: doRandomCallback,
    }));
    // attach random to top bar.
    setup.DOM.Nav.topLeftNavigation(setup.DOM.Nav.link(`Random [space]`, doRandomCallback));
    menu_items.push(menuItem({
        text: `<span data-tooltip="Random x100"><i class='sfa sfa-fast-fw'></i></span>`,
        callback() {
            scene.advanceTurns(100);
            setup.DOM.refresh(`#${interface_div_id}`);
        },
    }));
    menu_items.push(menuItem({
        text: `<span data-tooltip="Reroll"><i class='sfa sfa-ccw'></i></span>`,
        callback() {
            setup.DOM.refresh(`#${interface_div_id}`);
        },
    }));
    const end_sex = allowed_actions.filter(action => action instanceof setup.SexActionClass.SexEnd);
    if (end_sex.length) {
        menu_items.push(menuItem({
            text: `<span data-tooltip="End sex"><i class='sfa sfa-off'></i></span>`,
            callback() {
                selectAction(scene, end_sex[0], interface_div_id);
            }
        }));
    }
    menu_items.push(menuItem({
        text: `<i class='sfa sfa-cog'></i><i class='sfa sfa-down-dir'></i>`,
        children: [
            menuItem({
                text: `Mobile mode`,
                checked: !!State.variables.settings.mobilemode,
                callback: () => {
                    State.variables.settings.mobilemode = !State.variables.settings.mobilemode;
                    setup.DOM.refresh(`#${interface_div_id}`);
                },
            })
        ],
    }));
    return setup.DOM.Util.menuItemToolbar(menu_items);
}
/**
 * Begin sex!
 * @param {setup.SexInstance} sex
 * @returns {setup.DOM.Node}
 */
function interactiveSexDo(sex) {
    const description_div_id = 'interactive_sex_description_div';
    const scene = new setup.SexScene(sex, `#${description_div_id}`);
    setTimeout(() => { scene.appendInitText(); }, 1);
    const fragments = [];
    /* abort button */
    fragments.push(interactiveSexDoneButton());
    /* Text container: */
    fragments.push(html `
    <div class="interactive-sex-description-card card" id="${description_div_id}">
    </div>
  `);
    /* Interface */
    const interface_div_id = 'interactive_sex_interface_div';
    fragments.push(setup.DOM.createRefreshable("div", {
        class: 'interactive-sex-action-card card',
        id: interface_div_id
    }, () => {
        while (true) {
            // First, populate text until it's the player's turn, while keep checking for end game.
            if (scene.isEnded()) {
                // Finish. Show done button.
                infoDisplay(sex);
                scene.appendEndText();
                // Finish sex button
                setup.DOM.Nav.topLeftNavigation(interactiveSexDoneButton());
                return interactiveSexDoneButton();
            }
            const turn_unit = scene.getTurnUnit();
            if (!turn_unit.isYou()) {
                scene.advanceTurn();
            }
            else {
                break;
            }
        }
        // now it's your turn.
        const ref_fragments = [];
        ref_fragments.push(sexMenuFragment(sex, scene, interface_div_id));
        ref_fragments.push(getPlayerActionsFragment(sex, scene, interface_div_id));
        // Show other infos below
        /* participants */
        infoDisplay(sex);
        return setup.DOM.create('div', {}, ref_fragments);
    }));
    return setup.DOM.create('div', {}, fragments);
}
