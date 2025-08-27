import type { BuildingInstance } from "../../classes/BuildingInstance";
import type { BuildingTemplate } from "../../classes/BuildingTemplate";
import {
  menuItemAction,
  menuItemExtras,
  menuItemText,
  menuItemTitle,
} from "../../ui/menuitem";
import { domCardRep } from "../util/cardnamerep";

export function buildingTemplateNameFragment(
  template: BuildingTemplate,
): DOM.Node {
  return html`
    ${setup.TagHelper.getTagsRep("buildingtemplate", template.getTags())}
    ${domCardRep(template)}
  `;
}

export function buildingTemplateDescriptionFragment(
  template: BuildingTemplate,
): DOM.Node {
  return setup.DOM.Util.twee(template.getDescription());
}

function buildingNameFragment(building: BuildingInstance): DOM.Node {
  const fragments: DOM.Attachable[] = [];
  fragments.push(html`
    ${setup.TagHelper.getTagsRep(
      "buildinginstance",
      building.getTemplate().getTags(),
    )}
  `);
  const level = building.getLevel();
  const max_level = building.getTemplate().getMaxLevel();
  if (max_level > 1) {
    fragments.push(html` ${setup.DOM.Util.level(level)} / ${max_level} `);
  }
  fragments.push(html`${domCardRep(building)}`);
  return setup.DOM.create("span", {}, fragments);
}

function buildingInstanceNameActionMenu(
  building: BuildingInstance,
  show_actions?: boolean,
): JQuery[] {
  const menus: JQuery[] = [];

  menus.push(
    menuItemTitle({
      text: buildingNameFragment(building),
    }),
  );

  if (show_actions && building.isHasUpgrade()) {
    if (building.isUpgradable()) {
      menus.push(
        menuItemAction({
          text: `Upgrade`,
          tooltip: `Upgrade this improvement, potentially getting a new room to place`,
          callback: () => {
            const room = building.getUpgradeRoom();
            if (room) {
              State.variables.gFortGridBuildRoomKey = room.key;
              delete setup.gFortGridControl;
              setup.DOM.Nav.goto("FortGridBuild");
            } else {
              building.upgrade();
              setup.DOM.Nav.goto();
            }
          },
        }),
      );
      menus.push(
        menuItemAction({
          text: `Upgrade and auto-place`,
          tooltip: `Upgrade this improvement and automatically place its room (if any) on the fort`,
          callback: () => {
            const room = building.getUpgradeRoom();
            if (!room || State.variables.fortgrid.placeAnywhere(room)) {
              building.upgrade(room);
              setup.DOM.Nav.goto();
            } else {
              if (room) {
                room.delete();
              }
              setup.DOM.Nav.goto();
            }
          },
        }),
      );
    } else {
      menus.push(
        menuItemText({
          text: `Cannot upgrade`,
        }),
      );
    }
  }

  if (building.isHasUpgrade()) {
    const cost = building.getUpgradeCost();
    if (cost.length) {
      menus.push(
        menuItemText({
          text: html`${setup.DOM.Card.cost(cost)}`,
        }),
      );
    }
    const sub_room = building.getTemplate().getSubRoomTemplate();
    if (sub_room) {
      menus.push(
        menuItemText({
          text: html`${sub_room.repFull()}`,
        }),
      );
    }
  }

  return menus;
}

function buildingDescriptionFragment(
  building: BuildingInstance,
  show_actions?: boolean,
): DOM.Node {
  if (
    show_actions &&
    State.variables.menufilter.get("buildinginstance", "display") == "short"
  ) {
    return setup.DOM.Util.message("(description)", () => {
      return setup.DOM.Util.twee(building.getTemplate().getDescription());
    });
  } else {
    return setup.DOM.Util.twee(building.getTemplate().getDescription());
  }
}

function buildingTemplateNameActionMenu(
  template: BuildingTemplate,
  show_actions?: boolean,
): JQuery[] {
  const menus: JQuery[] = [];

  menus.push(
    menuItemTitle({
      text: buildingTemplateNameFragment(template),
    }),
  );

  if (show_actions && !State.variables.fort.player.isHasBuilding(template)) {
    if (template.isBuildable()) {
      menus.push(
        menuItemAction({
          text: `Build`,
          tooltip: `Build this improvement and place its room on the fort`,
          callback: () => {
            const room = State.variables.fort.player.getBuildRoom(template);
            if (room) {
              State.variables.gFortGridBuildRoomKey = room.key;
              delete setup.gFortGridControl;
              setup.DOM.Nav.goto("FortGridBuild");
            } else {
              State.variables.fort.player.build(template);
              setup.DOM.Nav.goto();
            }
          },
        }),
      );

      menus.push(
        menuItemAction({
          text: `Build and auto-place`,
          tooltip: `Build this improvement and automatically place its room somewhere on the fort`,
          callback: () => {
            const room = State.variables.fort.player.getBuildRoom(template);
            if (!room || State.variables.fortgrid.placeAnywhere(room)) {
              State.variables.fort.player.build(template, room);
              setup.DOM.Nav.goto();
            } else {
              if (room) {
                room.delete();
              }
              setup.DOM.Nav.goto();
            }
          },
        }),
      );
    } else {
      menus.push(
        menuItemText({
          text: `Not buildable`,
        }),
      );
    }

    menus.push(
      menuItemText({
        text: html`${setup.DOM.Card.cost(template.getCost(0))}`,
      }),
    );
    const main_room = template.getMainRoomTemplate();
    if (main_room) {
      menus.push(
        menuItemText({
          text: html`${main_room.repFull()}`,
        }),
      );
    }
  }

  const extras = [];

  if (show_actions) {
    if (
      State.variables.fort.player.isHasBuilding(
        setup.buildingtemplate.greathall,
      )
    ) {
      extras.push(
        menuItemAction({
          text: `Hidden`,
          checked: State.variables.fort.player.isTemplateIgnored(template),
          callback: () => {
            if (State.variables.fort.player.isTemplateIgnored(template)) {
              State.variables.fort.player.unignoreTemplate(template);
            } else {
              State.variables.fort.player.ignoreTemplate(template);
            }
            setup.DOM.Nav.goto();
          },
        }),
      );
    }
  }

  if (extras.length) {
    menus.push(
      menuItemExtras({
        children: extras,
      }),
    );
  }

  return menus;
}

export default {
  buildingtemplate(
    template_or_key: BuildingTemplate | BuildingTemplate["key"],
    show_actions?: boolean,
  ): DOM.Node {
    const template = resolveObject(template_or_key, setup.buildingtemplate);

    const fragments: DOM.Attachable[] = [];

    fragments.push(
      setup.DOM.Util.menuItemToolbar(
        buildingTemplateNameActionMenu(template, show_actions),
      ),
    );

    const restrictions = template.getPrerequisite(0);
    if (restrictions.length) {
      fragments.push(setup.DOM.Card.restriction(restrictions));
    }

    fragments.push(buildingTemplateDescriptionFragment(template));

    let divclass;
    if (show_actions && !template.isBuildable()) {
      divclass = `card buildingtemplatebadcard`;
    } else {
      divclass = `card buildingtemplatecard`;
    }

    return setup.DOM.create("div", { class: divclass }, fragments);
  },

  buildingtemplatecompact(template: BuildingTemplate, show_actions?: boolean) {
    return setup.DOM.Util.menuItemToolbar(
      buildingTemplateNameActionMenu(template, show_actions),
    );
  },

  buildinginstance(
    building_or_key: BuildingInstance | BuildingInstance["key"],
    show_actions?: boolean,
  ) {
    const building = resolveObject(
      building_or_key,
      State.variables.buildinginstance,
    );

    const fragments: DOM.Attachable[] = [];

    fragments.push(
      setup.DOM.Util.menuItemToolbar(
        buildingInstanceNameActionMenu(building, show_actions),
      ),
    );

    if (building.isHasUpgrade()) {
      const inner = [];
      const restrictions = building.getUpgradePrerequisite();
      if (restrictions.length) {
        inner.push(setup.DOM.Card.restriction(restrictions));
      }
      fragments.push(setup.DOM.create("div", {}, inner));
    }

    fragments.push(buildingDescriptionFragment(building, show_actions));

    const divclass = `card buildingcard`;
    return setup.DOM.create("div", { class: divclass }, fragments);
  },

  buildinginstancecompact(
    building: BuildingInstance,
    show_actions?: boolean,
  ): DOM.Node {
    return setup.DOM.Util.menuItemToolbar(
      buildingInstanceNameActionMenu(building, show_actions),
    );
  },
};
