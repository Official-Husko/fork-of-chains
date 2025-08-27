import type {
  RoomInstance,
  RoomInstanceKey,
} from "../../classes/room/RoomInstance";
import type {
  RoomTemplate,
  RoomTemplateKey,
} from "../../classes/room/RoomTemplate";
import { menuItemAction, menuItemText, menuItemTitle } from "../../ui/menuitem";
import { show_reason } from "../menu/fortgrid";
import { domCardRep } from "../util/cardnamerep";
import {
  buildingTemplateDescriptionFragment,
  buildingTemplateNameFragment,
} from "./building";

function roomNameFragment(room: RoomInstance, combined?: boolean): DOM.Node {
  const fragments: DOM.Attachable[] = [];
  const room_template = room.getTemplate();
  if (room_template) {
    fragments.push(
      html`${combined
        ? room_template.repCombinedTags()
        : room_template.repTags()}`,
    );
  }
  fragments.push(html`${domCardRep(room)}`);
  if (room_template) {
    fragments.push(
      html` (${room_template.getWidth()}×${room_template.getHeight()})`,
    );
  }
  return setup.DOM.create("span", {}, fragments);
}

export function roomTemplateNameFragment(
  room_template: RoomTemplate,
): DOM.Node {
  const fragments: DOM.Attachable[] = [];
  fragments.push(html`${room_template.repTags()}`);
  fragments.push(html`${domCardRep(room_template)}`);
  fragments.push(
    html`(${room_template.getWidth()}x${room_template.getHeight()})`,
  );
  return setup.DOM.create("span", {}, fragments);
}

function roomTemplateActionFragmentCommon(
  room_template: RoomTemplate,
  show_actions?: boolean,
  combined?: boolean,
): JQuery[] {
  const menus = [];
  const placed = State.variables.roomlist.getRoomCount(room_template);
  if (placed.placed + placed.unplaced) {
    let text;
    if (placed.placed && !placed.unplaced) {
      text = `${placed.placed > 1 ? `${placed.placed} placed` : `Placed`}`;
    } else if (!placed.placed) {
      text = html`${placed.unplaced} ${setup.DOM.Text.dangerlite("not placed")}`;
    } else {
      text = `${placed.placed}/${placed.placed + placed.unplaced} placed`;
    }
    menus.push(
      menuItemText({
        text: text,
      }),
    );
  }

  const building = room_template.getBuildingTemplate();
  if (building && !combined) {
    menus.push(
      menuItemText({
        text: buildingTemplateNameFragment(building),
      }),
    );
  }
  return menus;
}

export function getUnplacedRoom(template: RoomTemplate): RoomInstance | null {
  const unplaced = State.variables.roomlist
    .getUnplacedRooms()
    .filter((test_room) => test_room.getTemplate() == template);
  if (!unplaced.length) return null;
  return unplaced[0];
}

export function getPlacedRoom(template: RoomTemplate): RoomInstance | null {
  const placed = State.variables.roomlist
    .getRoomInstances({ template: template })
    .filter((test_room) => test_room.isPlaced());
  if (!placed.length) return null;
  return placed[0];
}

function roomInstanceNameActionMenu(
  room: RoomInstance,
  show_actions?: boolean,
): JQuery[] {
  const menus: JQuery[] = [];

  const room_template = room.getTemplate();
  const building = room_template.getBuildingTemplate();
  const combined = !!building && building.key === room_template.key;

  menus.push(
    menuItemTitle({
      text: roomNameFragment(room, combined),
    }),
  );

  if (
    show_actions &&
    State.variables.roomlist.getRoomCount(room.getTemplate()).unplaced
  ) {
    menus.push(
      menuItemAction({
        text: `Place`,
        tooltip: `Place this room somewhere on your fort`,
        callback: () => {
          // find an unplaced room
          const unplaced = getUnplacedRoom(room.getTemplate())!;
          unplaced.resetRotation();

          State.variables.gFortGridPlaceRoomKey = unplaced.key;
          setup.gFortGridControl!.mode = "place";
          setup.gFortGridControl!.setRoom(
            unplaced,
            /* save location = */ false,
          );
          setup.DOM.Nav.goto("FortGridPlace");
        },
      }),
    );

    menus.push(
      menuItemAction({
        text: `Auto-place`,
        tooltip: `Automatically place this room somewhere on your fort`,
        callback: () => {
          const unplaced = getUnplacedRoom(room.getTemplate())!;
          if (State.variables.fortgrid.placeAnywhere(unplaced)) {
            setup.DOM.Nav.goto();
          } else {
            setup.DOM.Nav.goto();
          }
        },
      }),
    );
  }

  if (
    show_actions &&
    !room.getTemplate().isFixed() &&
    State.variables.roomlist.getRoomCount(room.getTemplate()).placed &&
    setup.gFortGridControl &&
    setup.gFortGridControl.mode != "view"
  ) {
    menus.push(
      menuItemAction({
        text: `Remove`,
        tooltip: `Remove this room from your fort. You may need to place it back later`,
        callback: () => {
          // find a placed room
          const placed = getPlacedRoom(room.getTemplate())!;

          const reason = State.variables.fortgrid.checkRoomCanRelocateTo(
            placed,
            /* new location = */ null,
            /* skip pathing = */ false,
          );

          if (!reason) {
            // delete the room and continue
            const tiles = State.variables.fortgrid.relocateRoom(
              placed,
              null,
              /* return obsolete = */ true,
            )!;
            setup.gFortGridControl!.refreshTiles(tiles);
            placed.resetRotation();
            setup.DOM.Nav.goto();
          } else {
            show_reason(placed, reason, "remove");
          }
        },
      }),
    );
  }

  menus.push(
    ...roomTemplateActionFragmentCommon(
      room.getTemplate(),
      show_actions,
      combined,
    ),
  );

  return menus;
}

function roomTemplateNameActionMenu(
  template: RoomTemplate,
  show_actions?: boolean,
): JQuery[] {
  const menus: JQuery[] = [];

  menus.push(
    menuItemTitle({
      text: roomTemplateNameFragment(template),
    }),
  );

  menus.push(...roomTemplateActionFragmentCommon(template, show_actions));

  return menus;
}

function artContributorWanted(template: RoomTemplate): DOM.Node {
  return html` <div class="graytext">
    ${setup.DOM.Text.successlite("Contributors wanted!")} This room currently
    does not have any images. See
    <a target="_blank" href="${setup.REPO_URL}/-/issues/290">here</a>
    for more information. Images for this room would go into the
    "img/room/${template.key}/" folder.
  </div>`;
}

function getArtCreditFragment(room: RoomInstance): DOM.Node | null {
  const room_image = room.getImageObject();
  if (room_image) {
    return null; //setup.DOM.Util.Image.credits(room_image.info, "room");
  } else {
    return html`<br />${artContributorWanted(room.getTemplate())}`;
  }
}

function getRoomAndTemplateCommonFragment(
  template: RoomTemplate,
  show_actions?: boolean,
): DOM.Node {
  const fragments: DOM.Attachable[] = [];
  const description = template.getDescription();
  if (description) {
    fragments.push(setup.DOM.Util.twee(description));
  } else {
    const building = template.getBuildingTemplate();
    if (building) {
      fragments.push(buildingTemplateDescriptionFragment(building));
    }
  }

  // explain adjacency bonuses
  if (
    State.variables.gDebug ||
    State.variables.fort.player.isHasBuilding(
      setup.buildingtemplate.landscapingoffice,
    )
  ) {
    const adjacency = template.getSkillBonus();

    const bonskill: Record<
      string,
      {
        type: string;
        bonus: number;
        skill: Skill;
        templates: RoomTemplate[];
      }
    > = {};

    for (const adj of adjacency) {
      if (adj.type == "always") {
        fragments.push(html`
          <div>
            Grant ${adj.bonus.toFixed(2)} ${setup.skill[adj.skill_key].rep()}.
          </div>
        `);
      } else {
        const room_template_key = adj.room_template_key as RoomTemplateKey;
        const template = setup.roomtemplate[room_template_key];
        if (!template)
          throw new Error(`Missing room with template ${room_template_key}!`);
        const building = template.getBuildingTemplate();
        if (building) {
          if (
            !State.variables.gDebug &&
            !State.variables.fort.player.isHasBuilding(building) &&
            building.isHidden()
          ) {
            // hide adjacency information
            continue;
          }
        }
        const key = JSON.stringify([
          setup.skill[adj.skill_key].key,
          adj.type,
          adj.bonus,
        ]);
        if (!(key in bonskill)) {
          bonskill[key] = {
            type: adj.type,
            bonus: adj.bonus,
            skill: setup.skill[adj.skill_key],
            templates: [],
          };
        }
        bonskill[key].templates.push(template);
      }
    }

    const map_keys = Object.keys(bonskill);
    map_keys.sort();
    for (const map_key of map_keys) {
      const skill_obj = bonskill[map_key];
      const room_reps = skill_obj.templates
        .map((template) => template.rep())
        .join(", ");
      if (skill_obj.type == "adjacent") {
        fragments.push(html`
          <div>
            Grant ${skill_obj.bonus.toFixed(2)} ${skill_obj.skill.rep()} for
            every ${setup.DOM.Text.dangerlite("directly adjacent")}:
            ${room_reps}.
          </div>
        `);
      } else if (skill_obj.type == "near") {
        fragments.push(html`
          <div>
            Grant ${skill_obj.bonus.toFixed(2)} ${skill_obj.skill.rep()} for
            every
            <span
              data-tooltip="Entrances within ${setup.FORTGRID_NEAR_DISTANCE} tiles of each other"
              >nearby</span
            >: ${room_reps}.
          </div>
        `);
      } else {
        throw new Error(`Unrecognized adjacency type: ${skill_obj.type}`);
      }
    }
  }

  return setup.DOM.create("div", {}, fragments);
}

function fullAdjacencyExplanation(room: RoomInstance): DOM.Node {
  if (!room.getLocation()) {
    return html`Room is not currently placed in your fort.`;
  }

  const fragments: DOM.Attachable[] = [];
  const raw_res = State.variables.fortgrid.getAffectingRooms(
    room,
    room.getLocation(),
  );
  const affectors = raw_res.skill_to_room;
  const skill_bonuses = raw_res.skill_bonuses;
  for (let i = 0; i < affectors.length; ++i) {
    const rooms = affectors[i];
    if (rooms.length) {
      fragments.push(html`
        <div>
          ${skill_bonuses[i].toFixed(1)} ${setup.skill[i].rep()} from
          ${rooms.map((room) => room.rep()).join(", ")}
        </div>
      `);
    }
  }
  return setup.DOM.create("div", {}, fragments);
}

export default {
  roominstance(
    room_or_key: RoomInstance | RoomInstanceKey,
    show_actions?: boolean,
  ): DOM.Node {
    const room = resolveObject(room_or_key, State.variables.roominstance);

    const fragments: DOM.Attachable[] = [];
    fragments.push(
      setup.DOM.Util.menuItemToolbar(
        roomInstanceNameActionMenu(room, show_actions),
      ),
    );

    if (
      State.variables.fort.player.isHasBuilding(
        setup.buildingtemplate.landscapingoffice,
      )
    ) {
      const explanation = setup.SkillHelper.explainSkills(
        room.getSkillBonuses(),
        /* hide skills = */ false,
        /* to fixed = */ true,
      );
      if (explanation) {
        fragments.push(
          html`<div>
            Current effects: ${explanation}
            ${setup.DOM.Util.message(
              `(full details)`,
              () =>
                html`<div class="helpcard">
                  ${fullAdjacencyExplanation(room)}
                </div>`,
            )}
          </div>`,
        );
      }
    }

    fragments.push(
      getRoomAndTemplateCommonFragment(room.getTemplate(), show_actions),
    );

    fragments.push(getArtCreditFragment(room));

    const divclass = `card roominstancecard`;
    return setup.DOM.create("div", { class: divclass }, fragments);
  },

  roominstancecompact(room: RoomInstance, show_actions?: boolean): DOM.Node {
    return setup.DOM.Util.menuItemToolbar(
      roomInstanceNameActionMenu(room, show_actions),
    );
  },

  roomtemplate(
    template_or_key: RoomTemplate | RoomTemplateKey,
    show_actions?: boolean,
  ): DOM.Node {
    const template = resolveObject(template_or_key, setup.roomtemplate);

    const fragments: DOM.Attachable[] = [];
    fragments.push(
      setup.DOM.Util.menuItemToolbar(
        roomTemplateNameActionMenu(template, show_actions),
      ),
    );

    if (State.variables.gDebug && !template.getImageList().length) {
      fragments.push(artContributorWanted(template));
    }

    fragments.push(getRoomAndTemplateCommonFragment(template, show_actions));

    const divclass = `card roomtemplatecard`;
    return setup.DOM.create("div", { class: divclass }, fragments);
  },

  roomtemplatecompact(
    template: RoomTemplate,
    show_actions?: boolean,
  ): DOM.Node {
    return setup.DOM.Util.menuItemToolbar(
      roomTemplateNameActionMenu(template, show_actions),
    );
  },
};
