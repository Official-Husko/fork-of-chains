import type { ActivityTemplate } from "../../../../classes/activity/ActivityTemplate";
import {
  debug_do_one_finalize,
  debug_do_one_title,
  debug_frontpage_title,
} from "./_common";

export default {
  activity(): DOM.Node {
    const fragments: DOM.Attachable[] = [];
    fragments.push(debug_frontpage_title("activity", "ActivityDebugAll"));

    fragments.push(
      setup.DOM.Util.filterAll({
        menu: "activitytemplate",
        filter_objects: Object.values(setup.activitytemplate),
        display_callback: (template) =>
          html` <div>
            ${setup.DOM.Util.namebold(template)}
            ${setup.DOM.Util.message(
              "(can this be generated right now?)",
              () => {
                State.variables.activitylist.deleteAllActivities();
                for (const unit of State.variables.company.player.getUnits(
                  {},
                )) {
                  if (template.isCanGenerateFor(unit)) {
                    return setup.DOM.Text.success("YES");
                  }
                }
                return setup.DOM.Text.danger("NO");
              },
            )}
            ${setup.DOM.Nav.link(`(try to generate this)`, () => {
              State.variables.activitylist.deleteAllActivities();
              for (const unit of State.variables.company.player.getUnits({})) {
                if (template.isCanGenerateFor(unit)) {
                  const instance = template.makeInstance(unit);
                  if (instance) {
                    State.variables.gPassage = "FortGrid";
                    return setup.DOM.Nav.goto("FortGrid");
                  }
                }
              }
              alert("Unable to find suitable units for the activity.");
            })}
            ${setup.DOM.Nav.link(
              `(force generate this)`,
              () => {
                template.debugMakeInstance(/* efficient mode = */ false);
              },
              "FortGrid",
            )}
            ${setup.DOM.Nav.link(`(test this)`, () => {
              State.variables.qDebugActivityTemplate_key = template.key;
              setup.runSugarCubeCommand(`<<goto ActivityDebugDo>>`);
            })}
          </div>`,
      }),
    );

    return setup.DOM.create("div", {}, fragments);
  },

  activity_debug_one(
    template: ActivityTemplate,
    is_debug_all: boolean,
  ): DOM.Node {
    const activity = template.debugMakeInstance(is_debug_all);

    const fragments: DOM.Attachable[] = [];
    fragments.push(debug_do_one_title(activity, is_debug_all));

    for (const speech of Object.values(setup.speech)) {
      for (const [actor, unit] of activity.getActorsList()) {
        unit.speech_key = speech.key;
      }
      fragments.push(html`
        <div>
          <div>${setup.DOM.Util.namebold(activity)} [${speech.rep()}]:</div>
          ${setup.DOM.Card.activity(activity)}
        </div>
      `);
    }

    fragments.push(debug_do_one_finalize(activity, is_debug_all));

    return setup.DOM.create("div", {}, fragments);
  },

  activity_debug_all(): DOM.Node {
    const fragments: DOM.Attachable[] = [];
    for (const template of Object.values(setup.activitytemplate)) {
      try {
        fragments.push(
          setup.DOM.Menu.Settings.Debug.activity_debug_one(
            template,
            /* is debug all = */ true,
          ),
        );
      } catch (ex) {
        fragments.push(setup.DOM.Util.exception(ex));
      }
      fragments.push(setup.DOM.Card.notifications());
    }
    return setup.DOM.create("div", {}, fragments);
  },
};
