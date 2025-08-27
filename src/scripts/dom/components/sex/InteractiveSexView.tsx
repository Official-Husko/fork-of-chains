import {
  createEffect,
  createMemo,
  createSignal,
  For,
  onMount,
  Show,
} from "solid-js";
import { DoNothing, EquipStrapon } from "../../../classes/sex/action/_index";
import { PoseChange } from "../../../classes/sex/action/actions/core/PoseChange";
import { PoseChangeOther } from "../../../classes/sex/action/actions/core/PoseChangeOther";
import { PositionChange } from "../../../classes/sex/action/actions/core/PositionChange";
import { PositionChangeOther } from "../../../classes/sex/action/actions/core/PositionChangeOther";
import { UnequipOther } from "../../../classes/sex/action/actions/core/UnequipOther";
import { UnequipSelf } from "../../../classes/sex/action/actions/core/UnequipSelf";
import SexEnd from "../../../classes/sex/cost/SexEnd";
import { SexScene } from "../../../classes/sex/engine/SexScene";
import { sexMenuFragment } from "../../menu/interactivesex";
import { Twee } from "../common";
import { InteractiveSexStatusView } from "./InteractiveSexStatusView";
import "./InteractiveSexView.css";

const [getSexInstance, setSexInstance] = createSignal<SexInstance | null>(null);

export { getSexInstance };

const forceRefresh = () => {
  setSexInstance(Object.create(State.temporary.gSex));
};

async function runSexLoop(sex: SexInstance, scene: SexScene) {
  if (scene.isEnded()) return;

  // Populate text until it's the player's turn, while keep checking for end game.
  while (!scene.isEnded()) {
    const turn_unit = scene.getTurnUnit();
    if (!turn_unit.isYou()) {
      scene.advanceTurn();
    } else {
      break;
    }
  }

  if (scene.isEnded()) {
    // Finish. Show done button.
    //refreshInfoDisplay(sex);
    scene.appendEndText();

    // Finish sex button
    setup.DOM.Nav.topLeftNavigation(<FinishSexButton />);
  } else {
    // now it's your turn.
  }

  refreshInfoDisplay(sex);
  forceRefresh();
  return;
}

/**
 * Whether this action should be hidden from the choices
 */
function shouldHideAction(action: SexAction): boolean {
  if (action instanceof DoNothing) return true;
  if (action instanceof SexEnd) return true;
  if (action instanceof PoseChange) return true;
  if (action instanceof PoseChangeOther) return true;
  if (action instanceof PositionChange) return true;
  if (action instanceof PositionChangeOther) return true;
  if (action instanceof UnequipSelf) return true;
  if (action instanceof UnequipOther) return true;
  if (action instanceof EquipStrapon) return true;
  return false;
}

async function selectAction(scene: SexScene, action: SexAction) {
  scene.advanceTurn(action);
  await runSexLoop(getSexInstance()!, scene);
  forceRefresh();

  //setup.DOM.refresh(`#${interface_div_id}`);
}

function refreshInfoDisplay(sex: SexInstance) {
  forceRefresh();

  if (
    !document
      .getElementById("menudiv")
      ?.querySelector(".InteractiveSexStatusView")
  ) {
    setup.DOM.Helper.replace(
      "#menudiv",
      setup.DOM.renderComponent(InteractiveSexStatusView),
    );
  }
}

const FinishSexButton: Component<{ text?: string }> = (props) => {
  return (
    <button
      onClick={() => {
        setup.SexInstance.cleanup();
        delete State.variables.gInteractiveSexUnitIds;
        setup.DOM.Nav.gotoreturn();
      }}
    >
      {props.text ?? "Finish sex"}
    </button>
  );
};

/**
 * Let the player decide things first before starting the scene.
 */
const InteractiveSexSetup: Component<{
  sex: SexInstance;
  onReady: () => void;
}> = (props) => {
  const getAvailableLocations = createMemo(() => {
    return setup.SexClasses.getAllAllowedLocations(props.sex);
  });

  const getAvailablePlayerPaces = createMemo(() => {
    return setup.SexPace.getPaceChances(State.variables.unit.player)
      .filter((ch) => ch[1])
      .map((ch) => ch[0]);
  });

  onMount(() => {
    setup.DOM.Nav.topLeftNavigation(
      setup.DOM.Nav.link(`Begin [space]`, () => props.onReady()),
    );
  });

  return (
    <div class="InteractiveSexSetup">
      <hr />
      {/* pace picker */}
      <Show when={!props.sex.is_location_fixed}>
        <div>
          Your attitude:
          <For each={getAvailablePlayerPaces()}>
            {(pace) => (
              <label>
                <input
                  type="radio"
                  name="sex-pace"
                  checked={
                    pace === props.sex.getPace(State.variables.unit.player)
                  }
                  onChange={(ev) => {
                    props.sex.setPace(State.variables.unit.player, pace);
                  }}
                />
                <span>{pace.getTitle()}</span>
              </label>
            )}
          </For>
        </div>
        <hr />
      </Show>
      {/* location picker */}
      <Show when={!props.sex.is_location_fixed}>
        <div>
          Location:
          <For each={getAvailableLocations()}>
            {(loc) => (
              <div>
                <label>
                  <input
                    type="radio"
                    name="sex-location"
                    checked={
                      loc.getUniqueKey() ===
                      props.sex.getLocation().getUniqueKey()
                    }
                    onChange={(ev) => {
                      props.sex.setLocation(loc);
                    }}
                  />
                  <Twee>{loc.rep()}</Twee>
                </label>
              </div>
            )}
          </For>
        </div>
      </Show>
      <hr />
      <button
        onClick={() => {
          props.onReady();
        }}
      >
        Begin sex [space]
      </button>{" "}
      {/* return button */}
      <FinishSexButton text="Cancel" />
    </div>
  );
};

const description_div_id = "interactive_sex_description_div";

const InteractiveSexMenuFragment: Component<{
  sex: SexInstance;
  scene: SexScene;
  onReroll: () => void;
}> = (props) => {
  return (
    <>
      {setup.DOM.Util.menuItemToolbar(
        sexMenuFragment(props.sex, props.scene, (action) => {
          if (action === "action_selected") {
            runSexLoop(props.sex, props.scene);
          } else {
            if (action === "reroll") {
              props.onReroll();
            }

            forceRefresh();
          }
        }),
      )}
    </>
  );
};

/**
 * Begin sex!
 */
const InteractiveSexScene: Component<{ sex: SexInstance; scene: SexScene }> = (
  props,
) => {
  const [getCurrentTurn, setCurrentTurn] = createSignal(0);
  const [getRollIndex, setRollIndex] = createSignal(0);

  createEffect(() => {
    const _ = getSexInstance(); // subscribe to signal
    if (getCurrentTurn() < props.scene.turn) {
      setCurrentTurn(props.scene.turn);
    }
  });

  const getVisibleActions = createMemo(() => {
    const _ = getRollIndex(); // subscribe to signal
    const __ = getCurrentTurn(); // subscribe to signal

    const allowed_actions = props.scene.getPossibleActions(
      State.variables.unit.player,
    );

    const can_select = allowed_actions.filter(
      (action) => !shouldHideAction(action),
    );

    const to_pick = Math.min(
      setup.SexConstants.UI_PLAYER_ACTIONS,
      can_select.length,
    );

    let actions = setup.rng.choicesRandom(can_select, to_pick);

    // If the action taken last turn is still available, put it on top
    const latest = props.sex.getLatestAction(State.variables.unit.player);
    if (latest) {
      const latest_copy = can_select.filter(
        (action) => action instanceof latest.constructor,
      );
      if (latest_copy.length) {
        actions = actions.filter((action) => action != latest_copy[0]);
        if (actions.length > to_pick) {
          actions.splice(actions.length - 1, 1);
        }
        actions = [latest_copy[0]].concat(actions);
      }
    }

    return actions;
  });

  return (
    <div>
      {/* abort button */}
      {/*<FinishSexButton />*/}

      {/* Text container: */}

      <div
        //class="interactive-sex-description-card card"
        id={description_div_id}
      ></div>

      {/* Interface */}
      <Show
        when={getSexInstance()?.isEnded() !== true}
        fallback={<FinishSexButton />}
      >
        <div class="InteractiveSex-actions">
          <InteractiveSexMenuFragment
            {...props}
            onReroll={() => setRollIndex(getRollIndex() + 1)}
          />

          {/* Sex actions picker */}
          <div>
            <For each={getVisibleActions()}>
              {(action) => {
                return (
                  <article>
                    <button onClick={() => selectAction(props.scene, action)}>
                      {" "}
                      <i class="sfa sfa-chevron-circle-right" />{" "}
                    </button>

                    <span data-tooltip={action.description(props.sex)}>
                      <Twee>{action.title(props.sex)}</Twee>
                    </span>

                    <aside>
                      <Twee>
                        {setup.TagHelper.getTagsRep(
                          "sexaction",
                          action.getTags(),
                        )}
                      </Twee>
                    </aside>
                  </article>
                );
              }}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
};

export const InteractiveSexView: Component = ({}) => {
  const getSexInstance = () => State.temporary.gSex as SexInstance;

  const [getScene, setScene] = createSignal<SexScene | null>(
    getSexInstance().scene,
  );

  const begin = () => {
    const sex = getSexInstance();
    const scene = new setup.SexScene(sex, `#${description_div_id}`);
    scene.appendInitText();
    setScene(scene);
    runSexLoop(sex, scene);
  };

  onMount(() => {
    const sex = getSexInstance();

    // without this it does not work on first load because the ele has not been created yet.
    setTimeout(() => {
      refreshInfoDisplay(sex);
    }, 1);

    // Check if player is here and want to change things.
    const p = sex.participants.find(
      (p) => p.unit === State.variables.unit.player,
    );
    if (p) {
      // They are here. In this case, return a setup
      //return interactiveSexSetup(sex, !!location);
    } else {
      begin();
    }
  });

  return (
    <Show
      when={getScene()}
      fallback={<InteractiveSexSetup sex={getSexInstance()} onReady={begin} />}
    >
      <InteractiveSexScene sex={getSexInstance()} scene={getScene()!} />
    </Show>
  );
};
