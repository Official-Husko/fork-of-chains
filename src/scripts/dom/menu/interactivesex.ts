import { SexAction } from "../../classes/sex/action/SexAction";
import { DoNothing } from "../../classes/sex/action/actions/core/DoNothing";
import { EquipStrapon } from "../../classes/sex/action/actions/core/EquipStrapon";
import { PoseChange } from "../../classes/sex/action/actions/core/PoseChange";
import { PoseChangeOther } from "../../classes/sex/action/actions/core/PoseChangeOther";
import { PositionChange } from "../../classes/sex/action/actions/core/PositionChange";
import { PositionChangeOther } from "../../classes/sex/action/actions/core/PositionChangeOther";
import { SexEnd } from "../../classes/sex/action/actions/core/SexEnd";
import { UnequipOther } from "../../classes/sex/action/actions/core/UnequipOther";
import { UnequipSelf } from "../../classes/sex/action/actions/core/UnequipSelf";
import { SexInstance } from "../../classes/sex/engine/SexInstance";
import type { SexScene } from "../../classes/sex/engine/SexScene";
import type { SexLocation } from "../../classes/sex/location/SexLocation";
import type { sexposition } from "../../classes/sex/position/_index";
import { menuItem, menuItemText } from "../../ui/menuitem";
import { InteractiveSexParticipantCards } from "../components/sex/InteractiveSexStatusView";

/**
 * Begin interactive sex with these units
 * @param location - will be randomized if not given.
 */
export const DOM_Menu_interactivesex = function (
  units: Unit[],
  location?: SexLocation,
) {
  // Get init values
  const participants = SexInstance.initParticipants(units);

  // Get sex object temporarily
  const sex = new SexInstance(
    location || setup.sexlocation.dungeonsfloor,
    participants,
  );

  if (!location) {
    // randomize starting location
    const new_location = setup.rng.choice(
      setup.SexClasses.getAllAllowedLocations(sex),
    );
    sex.setLocation(new_location);
  }

  State.temporary.gSex = sex;
};

export function interactiveSexTooltip(
  ...args: Array<keyof typeof sexposition>
) {
  return setup.DOM.renderComponent(InteractiveSexParticipantCards, {
    sex: State.temporary.gSex,
    positions: args.map((key) => setup.sexposition[key]),
  });
}

function selectAction(
  scene: SexScene,
  action: SexAction,
  callback: (action?: string) => void,
) {
  scene.advanceTurn(action);
  callback("action_selected");
}

function getActionsMenuItem(
  sex: SexInstance,
  scene: SexScene,
  callback: (action?: string) => void,
  actions: SexAction[],
  menu_name: string,
) {
  const children = () => {
    const res = [];
    for (const action of actions) {
      res.push(
        menuItem({
          text: `${action.title(sex)}`,
          callback: () => {
            selectAction(scene, action, callback);
          },
        }),
      );
    }
    return res;
  };
  if (State.variables.settings.mobilemode) {
    return children();
  } else {
    return menuItem({
      text: `${menu_name}`,
      children: children,
    });
  }
}

function sexMenuFragmentUnit(
  allowed_actions: SexAction[],
  unit: Unit,
  sex: SexInstance,
  scene: SexScene,
  callback: () => void,
) {
  const menu_items: (JQuery | JQuery[])[] = [];

  let text = "";
  if (unit == State.variables.unit.player) {
    text = "You";
    menu_items.push(
      getActionsMenuItem(
        sex,
        scene,
        callback,
        allowed_actions.filter((a) => a instanceof PoseChange),
        "Pose",
      ),
    );

    menu_items.push(
      getActionsMenuItem(
        sex,
        scene,
        callback,
        allowed_actions.filter((a) => a instanceof PositionChange),
        "Position",
      ),
    );

    // self actions
    menu_items.push(
      getActionsMenuItem(
        sex,
        scene,
        callback,
        allowed_actions.filter(
          (a) => a instanceof UnequipSelf || a instanceof EquipStrapon,
        ),
        "Equipment",
      ),
    );
  } else {
    text = unit.getName();
    // other participant actions
    menu_items.push(
      getActionsMenuItem(
        sex,
        scene,
        callback,
        allowed_actions.filter(
          (a) => a instanceof PoseChangeOther && a.getActorUnit("b") == unit,
        ),
        "Pose",
      ),
    );

    menu_items.push(
      getActionsMenuItem(
        sex,
        scene,
        callback,
        allowed_actions.filter(
          (a) =>
            a instanceof PositionChangeOther && a.getActorUnit("b") == unit,
        ),
        "Position",
      ),
    );

    menu_items.push(
      getActionsMenuItem(
        sex,
        scene,
        callback,
        allowed_actions.filter(
          (a) => a instanceof UnequipOther && a.getActorUnit("b") == unit,
        ),
        "Equipment",
      ),
    );
  }

  let actual_menu_items: any[] = [];
  if (State.variables.settings.mobilemode) {
    // aggregate the childrens
    for (const menu of menu_items) actual_menu_items.push(...menu);
  } else {
    actual_menu_items = menu_items;
  }

  if (!actual_menu_items.length) {
    actual_menu_items.push(
      menuItemText({
        text: "No possible action",
      }),
    );
  }

  return menuItem({
    text: `${text} <i class='sfa sfa-caret-down'></i>`,
    clickonly: true,
    children: actual_menu_items,
  });
}

export function sexMenuFragment(
  sex: SexInstance,
  scene: SexScene,
  callback: (action?: string) => void,
) {
  const menu_items = [];

  const allowed_actions = scene.getPossibleActions(State.variables.unit.player);
  for (const unit of sex.getUnits()) {
    menu_items.push(
      sexMenuFragmentUnit(allowed_actions, unit, sex, scene, callback),
    );
  }

  menu_items.push(
    menuItem({
      text: `<span data-tooltip="Reroll actions" data-tooltip-noclick><i class='sfa sfa-sync-alt'></i></span>`,
      is_no_close: true,
      callback() {
        callback("reroll");
      },
    }),
  );

  const do_nothing = allowed_actions.filter(
    (action) => action instanceof DoNothing,
  );
  if (do_nothing.length) {
    menu_items.push(
      menuItem({
        text: `<span data-tooltip="Do nothing"><i class='sfa sfa-pause'></i></span>`,
        is_no_close: true,
        callback() {
          selectAction(scene, do_nothing[0], callback);
        },
      }),
    );
  }

  function doRandomCallback() {
    scene.advanceTurn();
    callback();
  }

  menu_items.push(
    menuItem({
      text: `<span data-tooltip="Random"><i class='sfa sfa-play'></i></span>`,
      is_no_close: true,
      callback: doRandomCallback,
    }),
  );

  // attach random to top bar.
  setup.DOM.Nav.topLeftNavigation(
    setup.DOM.Nav.link(`Random [space]`, doRandomCallback),
  );

  menu_items.push(
    menuItem({
      text: `<span data-tooltip="Random x100"><i class='sfa sfa-forward'></i></span>`,
      is_no_close: true,
      callback() {
        scene.advanceTurns(100);
        callback();
      },
    }),
  );

  const end_sex = allowed_actions.filter((action) => action instanceof SexEnd);
  if (end_sex.length) {
    menu_items.push(
      menuItem({
        text: `<span data-tooltip="End sex"><i class='sfa sfa-stop'></i></span>`,
        is_no_close: true,
        callback() {
          selectAction(scene, end_sex[0], callback);
        },
      }),
    );
  }

  menu_items.push(
    menuItem({
      text: `<i class='sfa sfa-cog'></i><i class='sfa sfa-caret-down'></i>`,
      is_no_close: true,
      children: [
        menuItem({
          text: `Mobile mode`,
          checked: !!State.variables.settings.mobilemode,
          callback: () => {
            State.variables.settings.mobilemode =
              !State.variables.settings.mobilemode;
            callback();
          },
        }),
      ],
    }),
  );

  return menu_items;
}
