import { TwineClass } from "../../classes/_TwineClass";
import type { TileLocation } from "../../classes/room/FortGrid";
import {
  RoomInstance,
  type RoomInstanceKey,
  type Rotation,
} from "../../classes/room/RoomInstance";
import type { Tile } from "../../classes/room/Tile";
import {
  menuItemAction,
  menuItemDanger,
  menuItemExtras,
  menuItemText,
  menuItemTitle,
} from "../../ui/menuitem";
import { getUnplacedRoom } from "../card/room";

const FORTGRID_GRID_DIV_ID = "fortgrid-grid-div";
const FORTGRID_TOOLBAR_DIV_ID = "fortgrid-toolbar-div";
const FORTGRID_TITLEBAR_DIV_ID = "fortgrid-titlebar-div";

function return_callback() {
  setup.DevToolHelper.saveScrollPos();
  if (State.variables.fortgrid.isRoomPlacementsValid()) {
    const cost = setup.gFortGridControl!.getRenovateCost();
    if (cost) {
      setup.qc.Money(-cost).apply();
    }
    setup.DOM.Nav.goto("FortGrid");
  } else {
    setup.Dialogs.open({
      title: `Invalid room placements`,
      content: html`<p>You must place all mandatory rooms inside the fort.</p>`,
    });
    setup.gFortGridControl!.refreshToolbar();
  }
}

export type FortGridMode =
  | "view"
  | "edit"
  | "place"
  | "delete"
  | "build"
  | "confirmbuild";

export class FortGridController extends TwineClass {
  mode: FortGridMode;
  room_key: RoomInstanceKey | undefined;

  current_mouse_enter_tile: Tile | null = null;

  move_origin_location: TileLocation | null = null;
  move_origin_rotation: Rotation | null = null;

  tile_to_elem: (DOM.Node | null)[][] = [];

  elems_with_class: Array<{ elem: DOM.Node; elemclass: string }> = [];

  is_show_bonus: boolean;
  is_show_renovation: boolean;

  /** stores all data about rooms, mapped from its key. For resetting */
  reset_data: Record<RoomInstanceKey, RoomInstance> = {};

  constructor(mode: FortGridMode, room_key?: RoomInstanceKey) {
    super();
    Mousetrap.unbind("[");
    Mousetrap.unbind("]");

    this.mode = mode;
    this.room_key = room_key;

    this.is_show_bonus = State.variables.fort.player.isHasBuilding(
      setup.buildingtemplate.landscapingoffice,
    );
    this.is_show_renovation = State.variables.fort.player.isHasBuilding(
      setup.buildingtemplate.renovationoffice,
    );

    if (["place", "edit"].includes(this.mode)) {
      const rooms = State.variables.roomlist.getRoomInstances();
      for (const room of rooms) {
        this.reset_data[room.key] = Object.assign({}, room);
      }
    }
  }

  resetCache() {
    this.tile_to_elem = [];
    this.elems_with_class = [];
  }

  addClass(location: TileLocation, classname: string) {
    const tile = State.variables.fortgrid.getTile(location);
    const room = tile.getRoomInstance();

    if (room) {
      location = room.getLocation();
    }

    const elem = this.getElem(location);
    if (!$(elem).hasClass(classname)) {
      $(elem).addClass(classname);
      this.elems_with_class.push({
        elem: elem,
        elemclass: classname,
      });
    }
  }

  clearClasses() {
    for (const elemclass of this.elems_with_class) {
      $(elemclass.elem).removeClass(elemclass.elemclass);
    }
    this.elems_with_class = [];
  }

  getChangedRooms(): RoomInstance[] {
    const rooms = State.variables.roomlist.getRoomInstances();
    const changed = [];
    for (const room of rooms) {
      if (!(room.key in this.reset_data)) continue;
      const original_location = this.reset_data[room.key].location;
      const current = room.getLocation();
      if (
        (original_location && !current) ||
        (current && !original_location) ||
        (original_location && original_location.row != current.row) ||
        (original_location && original_location.col != current.col) ||
        (this.reset_data[room.key].clockwise_rotations ?? 0) !=
          room.getClockwiseRotations()
      ) {
        // room was moved or rotated
        changed.push(room);
      }
    }
    return changed;
  }

  getRenovateCost(): number {
    let cost = 0;
    for (const room of this.getChangedRooms()) {
      const original_location = this.reset_data[room.key].location;
      if (original_location) {
        cost +=
          room.getWidth() *
          room.getHeight() *
          setup.FORTGRID_RELOCATE_PRICE_PER_TILE;
      }
    }
    return cost;
  }

  resetAllRooms() {
    const rooms = State.variables.roomlist.getRoomInstances();
    for (const room of rooms) {
      if (room.key in this.reset_data) {
        Object.assign(room, this.reset_data[room.key]);
      }
    }
    State.variables.fortgrid.recomputeTiles();
    State.variables.roomlist.resetCacheAll();
  }

  /**
   * returns the <td>...</td> element
   */
  getElem(location: TileLocation): DOM.Node {
    const translated =
      State.variables.fortgrid.translateLocationToArrayIndex(location);
    const result = this.tile_to_elem[translated.idx1][translated.idx2];
    if (!result) {
      throw new Error(
        `Unknown result for location: ${location.row} ${location.col}`,
      );
    }
    return result;
  }

  drawTiles(): DOM.Node {
    const tiles = State.variables.fortgrid.getTiles();
    State.variables.fortgrid.recomputePaths();

    this.elems_with_class = [];

    this.tile_to_elem = [];
    for (const row of tiles) {
      const map_row: (DOM.Node | null)[] = [];
      for (const col of row) {
        map_row.push(null);
      }
      this.tile_to_elem.push(map_row);
    }

    // The display will be using a table, where the inner element will contain img src
    const display_rows = [];

    // draw top tile just to ensure all cells have the correct width.
    {
      const top_row = [];
      for (let j = 0; j < State.variables.fortgrid.getWidth(); ++j) {
        top_row.push(
          setup.DOM.create(
            "td",
            {
              style: `height: 0px; width: ${setup.Tile.getTileSize()}px;`,
            },
            null,
          ),
        );
      }
      display_rows.push(setup.DOM.create("tr", {}, top_row));
    }

    // If has place to expand upwards, display it as a row
    if (State.variables.fortgrid.isCanExpandIndoor()) {
      display_rows.push(get_expansion_row(/* is indoor = */ true));
    }

    for (let i = 0; i < tiles.length; ++i) {
      const tile_row = tiles[i];
      const col_eles = [];
      for (let j = 0; j < tile_row.length; ++j) {
        const tile = tile_row[j];
        const room = tile.getRoomInstance();
        const display = tile.getTileDisplay();
        const rowspan = room ? room.getHeight() : 1;
        const colspan = room ? room.getWidth() : 1;
        const elem = setup.DOM.create(
          "td",
          {
            rowspan: rowspan,
            colspan: colspan,
            class: "tile-event-listen",
            "data-row": i,
            "data-col": j,
          },
          display,
        );
        if (!display) {
          $(elem).hide();
        }
        this.tile_to_elem[i][j] = elem;

        col_eles.push(elem);
      }
      display_rows.push(setup.DOM.create("tr", {}, col_eles));
    }

    // If has place to expand downwards, display it as a row
    if (State.variables.fortgrid.isCanExpandOutdoor()) {
      display_rows.push(get_expansion_row(/* is indoor = */ false));
    }

    const table = setup.DOM.create(
      "table",
      { class: "fortgrid-table" },
      setup.DOM.create("tbody", {}, display_rows),
    );

    (table as HTMLTableElement).style.setProperty(
      "--fortgrid-scale",
      String(setup.Tile.getZoom()),
    );

    $(table).on("mouseenter", ".tile-event-listen", function () {
      const row = parseInt($(this).attr("data-row")!);
      const col = parseInt($(this).attr("data-col")!);
      on_mouse_enter_callback(State.variables.fortgrid.getTiles()[row][col])();
    });
    $(table).on("click", ".tile-event-listen", function () {
      const row = parseInt($(this).attr("data-row")!);
      const col = parseInt($(this).attr("data-col")!);
      on_click_callback(State.variables.fortgrid.getTiles()[row][col])();
    });

    setup.DevToolHelper.restoreScrollPos();

    return setup.DOM.create(
      "div",
      {
        style: `width: ${setup.Tile.getTileSize() * State.variables.fortgrid.getWidth() + 100}px`,
      },
      table,
    );
  }

  getRoom(): RoomInstance | null {
    if (this.room_key) {
      return State.variables.roominstance[this.room_key];
    } else {
      return null;
    }
  }

  refreshToolbar(): void {
    setup.DOM.refresh(`#${FORTGRID_TOOLBAR_DIV_ID}`);
    setup.DOM.refresh(`#${FORTGRID_TITLEBAR_DIV_ID}`);
  }

  resetRoom(): void {
    const room = this.getRoom()!;
    room.setRotation(this.move_origin_rotation!);
    const reset_tiles = State.variables.fortgrid.relocateRoom(
      room,
      this.move_origin_location,
      /* return obsolete tiles = */ true,
    );
    this.refreshTiles(reset_tiles ?? []);
  }

  refreshGrid(): void {
    setTimeout(() => setup.DOM.refresh(`#${FORTGRID_GRID_DIV_ID}`), 1);
  }

  refreshMeta(): void {
    this.clearClasses();
    this.refreshToolbar();
    if (State.variables.fortgrid.isCanExpandIndoor()) {
      setup.DOM.refresh(`#${get_expansion_row_refreshable_id(true)}`);
    }
    if (State.variables.fortgrid.isCanExpandOutdoor()) {
      setup.DOM.refresh(`#${get_expansion_row_refreshable_id(false)}`);
    }
    setup.runSugarCubeCommand(`<<refreshmenu>>>`);
  }

  refreshAll(): void {
    this.refreshMeta();
    this.refreshGrid();
    setup.runSugarCubeCommand(`<<refreshmenu>>>`);
  }

  setElem(location: TileLocation): void {
    if (State.variables.fortgrid.isOutOfBounds(location)) return;
    const tile = State.variables.fortgrid.getTile(location);
    const elem = this.getElem(location);
    const room = tile.getRoomInstance();
    const display = tile.getTileDisplay();
    if (!display) {
      $(elem).hide();
    } else {
      const rowspan = room ? room.getHeight() : 1;
      const colspan = room ? room.getWidth() : 1;
      $(elem).attr("rowspan", rowspan);
      $(elem).attr("colspan", colspan);
      $(elem).html(display);
      $(elem).show();
    }
  }

  refreshTiles(locations: TileLocation[]) {
    this.refreshMeta();
    setTimeout(() => {
      for (const location of locations) {
        this.setElem(location);
      }
    }, 1);
  }

  setRoom(room: RoomInstance, is_save_location_rotation: boolean) {
    this.room_key = room.key;
    if (is_save_location_rotation) {
      this.move_origin_location = room.getLocation();
      this.move_origin_rotation = room.getClockwiseRotations();
    } else {
      this.move_origin_rotation = this.move_origin_location = null;
    }
  }

  getTitleToolbar(): JQuery[] {
    const menus = [];
    menus.push(
      menuItemTitle({
        text: State.variables.company.player.rep(),
      }),
    );
    const explanation = setup.SkillHelper.explainSkills(
      State.variables.roomlist.getTotalSkillBonuses(),
    );

    const tooltip = `You can get bonuses to the skills of all units
in your company by carefully placing your rooms. The bonus is capped at ${setup.ROOM_MAX_SKILL_BOOST} per skill. This bonus is small enough
that you can play the game without even bothering with this bonus if you prefer.`;

    if (explanation) {
      menus.push(
        menuItemText({
          text: html`${explanation}`,
          tooltip: tooltip,
        }),
      );
    }
    return menus;
  }

  getToolbars(): JQuery[] {
    const cancel_callback = () => {
      setup.DevToolHelper.saveScrollPos();
      if (this.mode == "build") {
        const building_template = this.getRoom()!
          .getTemplate()
          .getBuildingTemplate()!;
        this.getRoom()!.delete();
        if (State.variables.fort.player.isHasBuilding(building_template)) {
          setup.DOM.Nav.goto("Fort");
        } else {
          setup.DOM.Nav.goto("FortBuild");
        }
        return;
      } else if (this.mode == "place" && this.move_origin_location) {
        this.resetRoom();
        this.mode = "edit";
      } else if (this.mode == "place") {
        // was from room list place
        // can move back freely if no buildings was changed
        if (!this.getChangedRooms().length) {
          setup.DOM.Nav.goto("RoomList");
          return;
        } else {
          setup.DOM.Nav.goto("RoomListPlace");
          return;
        }
      } else {
        this.mode = "edit";
      }
      this.refreshAll();
    };

    const confirm_build_callback = () => {
      const room = this.getRoom()!;
      const building_template = room.getTemplate().getBuildingTemplate()!;
      if (State.variables.fort.player.isHasBuilding(building_template)) {
        const instance =
          State.variables.fort.player.getBuilding(building_template)!;
        instance.upgrade(room);
        setup.DevToolHelper.saveScrollPos();
        setup.DOM.Nav.goto("Fort");
      } else {
        State.variables.fort.player.build(building_template, room);
        setup.DevToolHelper.saveScrollPos();
        setup.DOM.Nav.goto("FortBuild");
      }
      return;
    };

    if (["delete"].includes(this.mode)) {
      setup.DOM.Nav.topLeftNavigation(
        setup.DOM.Nav.link(`Finish removals`, cancel_callback),
      );
    } else if (this.mode == "edit") {
      const cost = this.getRenovateCost();
      if (cost > 0 && State.variables.company.player.getMoney() < cost) {
        setup.DOM.Nav.topLeftNavigation(html`
          Not enough money (Need: ${setup.DOM.Util.money(cost)})
        `);
      } else {
        setup.DOM.Nav.topLeftNavigation(
          setup.DOM.Nav.link(
            html`Finish${cost ? html` (${setup.DOM.Util.money(-cost)})` : ``}`,
            return_callback,
          ),
        );
      }
    } else if (this.mode == "confirmbuild") {
      setup.DOM.Nav.topLeftNavigation(
        setup.DOM.Nav.link(html`Confirm`, confirm_build_callback),
      );
    }

    const menus = [];

    if (["place", "build"].includes(this.mode)) {
      menus.push(
        menuItemText({
          text: `Place ${this.getRoom()!.rep()}`,
        }),
      );
    } else if (["delete"].includes(this.mode)) {
      menus.push(
        menuItemText({
          text: `Click a room to remove`,
        }),
      );
    } else if (["edit"].includes(this.mode) && this.is_show_renovation) {
      menus.push(
        menuItemText({
          text: `Click a room to move`,
        }),
      );
    }

    if (["place", "build"].includes(this.mode)) {
      const room = this.getRoom()!;
      menus.push(
        menuItemAction({
          text: `Rotate`,
          tooltip: `Rotate this room clockwise 90 degrees. You can use the "[" and "]" keyboard shortcuts for rotating rooms.`,
          callback: () => {
            room.rotate90clockwise();
            if (this.current_mouse_enter_tile) {
              on_mouse_enter_callback(this.current_mouse_enter_tile)();
            }
            this.refreshToolbar();
          },
        }),
      );

      menus.push(
        menuItemAction({
          text: `Auto-place`,
          tooltip: `Let the game automatically place this room somewhere on the fort.`,
          callback: () => {
            const tiles = State.variables.fortgrid.placeAnywhere(
              room,
              /* return obsolete tiles = */ true,
            );
            if (Array.isArray(tiles)) {
              on_build_success(room, tiles);
            }
          },
        }),
      );

      Mousetrap.unbind("[").bind("[", () => {
        if (["place", "build"].includes(this.mode)) {
          room.rotate90anticlockwise();
          if (this.current_mouse_enter_tile) {
            on_mouse_enter_callback(this.current_mouse_enter_tile)();
          }
          this.refreshToolbar();
        }
      });

      Mousetrap.unbind("]").bind("]", () => {
        if (["place", "build"].includes(this.mode)) {
          room.rotate90clockwise();
          if (this.current_mouse_enter_tile) {
            on_mouse_enter_callback(this.current_mouse_enter_tile)();
          }
          this.refreshToolbar();
        }
      });
    }

    if (this.is_show_renovation) {
      if (["edit", "delete"].includes(this.mode)) {
        const unplaced = State.variables.roomlist.getUnplacedRooms();
        let text;
        if (unplaced.length) {
          text = html`Room list (${setup.DOM.Text.successlite(unplaced.length)})`;
        } else {
          text = html`Room list`;
        }
        menus.push(
          menuItemAction({
            text: text,
            tooltip: `See your room list, and optionally place/remove some of them from your fort`,
            callback: () => {
              setup.DevToolHelper.saveScrollPos();
              setup.DOM.Nav.goto("RoomListPlace");
            },
          }),
        );
      }

      if (["edit"].includes(this.mode)) {
        menus.push(
          menuItemAction({
            text: `Remove rooms`,
            tooltip: `Remove rooms from your fort. You can place them back later`,
            callback: () => {
              this.mode = "delete";
              this.refreshMeta();
            },
          }),
        );
      }
    }

    if (this.mode == "view") {
      const unplaced = State.variables.roomlist.getUnplacedRooms().length;
      menus.push(
        menuItemAction({
          text: `View/upgrade buildings`,
          tooltip: `See all buildings as well as upgrade existing ones`,
          callback: () => {
            setup.DevToolHelper.saveScrollPos();
            setup.DOM.Nav.goto("Fort");
          },
        }),
        menuItemAction({
          text: `Build`,
          tooltip: `Construct new buildings`,
          callback: () => {
            setup.DevToolHelper.saveScrollPos();
            setup.DOM.Nav.goto("FortBuild");
          },
        }),
        menuItemAction({
          text: html`Room
          list${unplaced
            ? html` (${setup.DOM.Text.successlite(`${unplaced}`)})`
            : ""}`,
          tooltip: `List all rooms`,
          callback: () => {
            setup.DevToolHelper.saveScrollPos();
            setup.DOM.Nav.goto("RoomList");
          },
        }),
        menuItemAction({
          text: this.is_show_renovation ? `Relocate / Expand` : `Expand`,
          tooltip: this.is_show_renovation
            ? `Expand the size of your fort as well as move rooms around`
            : `Expand the size of your fort either inwards or outwards`,
          callback: () => {
            setup.DevToolHelper.saveScrollPos();
            delete setup.gFortGridControl;
            setup.DOM.Nav.goto("FortGridRenovate");
          },
        }),
      );
    }

    if (["place", "delete", "build"].includes(this.mode)) {
      menus.push(
        menuItemAction({
          text: ["delete"].includes(this.mode) ? `Finish removals` : `Cancel`,
          tooltip: ["delete"].includes(this.mode)
            ? `Finish removing rooms`
            : `Cancel the current action`,
          callback: cancel_callback,
        }),
      );
    } else if (["confirmbuild"].includes(this.mode)) {
      menus.push(
        menuItemAction({
          text: "Confirm placement",
          tooltip: `Finish the room placement`,
          callback: confirm_build_callback,
        }),
        menuItemAction({
          text: "Cancel",
          tooltip: `Cancel the room placement and pick another position`,
          callback: () => {
            const room = this.getRoom()!;
            const tiles = State.variables.fortgrid.relocateRoom(
              room,
              null,
              /* return obsolete = */ true,
            )!;
            this.mode = "build";
            this.refreshTiles(tiles);
          },
        }),
      );
    } else if (this.mode == "edit") {
      const cost = this.getRenovateCost();
      if (cost > 0 && State.variables.company.player.getMoney() < cost) {
        menus.push(
          menuItemText({
            text: html`Not enough money: ${setup.DOM.Util.money(cost)}`,
          }),
        );
      } else {
        menus.push(
          menuItemAction({
            text: html`Finish${cost
              ? html` (${setup.DOM.Util.money(-cost)})`
              : ``}`,
            tooltip: `Finish the renovation`,
            callback: return_callback,
          }),
        );
      }
    }

    const extras: JQuery[] = [];
    if (this.mode == "edit") {
      extras.push(
        menuItemDanger({
          text: `Reset to start`,
          tooltip: `Reset all room positions to what it was at the start of this renovation`,
          callback: () => {
            this.resetAllRooms();
            this.refreshAll();
          },
        }),
      );
    }

    extras.push(
      State.variables.menufilter.getMenuItemChecked(
        "fortgrid",
        "show_caption",
        () => {
          this.refreshAll();
        },
        "Show titles of the rooms at the top left corner of their images",
      ),
    );
    extras.push(
      State.variables.menufilter.getMenuItemChecked(
        "fortgrid",
        "show_tooltip",
        () => {
          this.refreshAll();
        },
        "Show room tooltips when hovering over them",
      ),
    );
    if (this.is_show_bonus) {
      extras.push(
        State.variables.menufilter.getMenuItemChecked(
          "fortgrid",
          "show_skills",
          () => {
            this.refreshAll();
          },
          "Show the skill benefits of each room, if any, on the bottom left corner of their images",
        ),
      );
    }
    extras.push(
      State.variables.menufilter.getMenuItemChecked(
        "fortgrid",
        "show_activities",
        () => {
          this.refreshAll();
        },
        "Show unit activities on the rooms",
      ),
    );

    menus.push(
      State.variables.menufilter.getMenuFilterToolbarSingleMenu(
        setup.MenuFilter.getMenus("fortgrid"),
        "fortgrid",
        "zoom",
        () => {
          this.refreshAll();
        },
      ),
    );

    if (extras.length) {
      menus.push(
        menuItemExtras({
          children: extras,
        }),
      );
    }

    return menus;
  }
}

function show_adjacencies(room: RoomInstance, location: TileLocation) {
  const control = setup.gFortGridControl!;

  if (!control.is_show_bonus) {
    return;
  }

  const adj_bonus = State.variables.fortgrid.getAffectingRooms(room, location);
  for (const neighbor of adj_bonus.rooms) {
    control.addClass(neighbor.getLocation(), "fortgrid-highlight");
    control.addClass(neighbor.getLocation(), "fortgrid-neighbor");
  }
  for (const tile of adj_bonus.paths) {
    control.addClass(tile.getLocation(), "fortgrid-highlight");
    control.addClass(tile.getLocation(), "fortgrid-path");
  }
}

function on_mouse_enter_callback(tile: Tile) {
  return () => {
    if (!setup.gFortGridControl) return;
    const mode = setup.gFortGridControl.mode;

    const control = setup.gFortGridControl;
    control.current_mouse_enter_tile = tile;
    control.clearClasses();

    if (["place", "build"].includes(mode)) {
      const room = setup.gFortGridControl.getRoom()!;
      const reason = State.variables.fortgrid.checkRoomCanRelocateTo(
        room,
        tile.getLocation(),
        /* skip pathing = */ true,
      );
      let classname;
      if (!reason) {
        classname = `fortgrid-valid`;
      } else {
        classname = `fortgrid-invalid`;
      }
      const location = tile.getLocation();
      for (
        let row = location.row;
        row < location.row + room.getHeight();
        ++row
      ) {
        for (
          let col = location.col;
          col < location.col + room.getWidth();
          ++col
        ) {
          const room_location = { row: row, col: col };
          if (!State.variables.fortgrid.isOutOfBounds(room_location)) {
            control.addClass(room_location, "fortgrid-highlight");
            control.addClass(room_location, classname);
          }
        }
      }

      if (room.getTemplate().isHasDoor()) {
        const entrance_location = room.getEntranceLocation(location);
        if (!State.variables.fortgrid.isOutOfBounds(entrance_location)) {
          control.addClass(entrance_location, "fortgrid-highlight");
          control.addClass(entrance_location, `${classname}-entrance`);
        }
      }

      if (!reason) {
        // show adjacency bonuses
        show_adjacencies(room, location);
      }
    }

    if (mode == "delete") {
      const room = tile.getRoomInstance();
      if (room && !room.getTemplate().isFixed()) {
        const location = tile.getLocation();
        control.addClass(location, "fortgrid-highlight");
        control.addClass(location, "fortgrid-invalid");
      }
    }

    if (["view", "edit", "delete", "confirmbuild"].includes(mode)) {
      const room = tile.getRoomInstance();
      if (room) {
        show_adjacencies(room, tile.getLocation());
        if (room.getTemplate().isHasDoor()) {
          const entrance_location = room.getEntranceLocation(
            tile.getLocation(),
          );
          if (!State.variables.fortgrid.isOutOfBounds(entrance_location)) {
            control.addClass(entrance_location, "fortgrid-highlight");
            control.addClass(entrance_location, `fortgrid-valid-entrance`);
          }
        }
      }
    }
  };
}

export function show_reason(
  room: RoomInstance,
  reason: string,
  action: string,
) {
  // show reason
  setup.Dialogs.open({
    title: `Invalid position`,
    content: html`
      <div>Unable to ${action} ${room.rep()} here because:</div>
      <div>${reason}</div>
    `,
  });
}

function on_build_success(room: RoomInstance, to_update: TileLocation[]) {
  const control = setup.gFortGridControl!;
  const mode = control.mode;
  if (mode == "build") {
    // built successfully. Ask player to confirm
    control.mode = "confirmbuild";
    control.refreshTiles(to_update);
  } else {
    if (control.move_origin_location) {
      control.mode = "edit";
    } else {
      const room_template = room.getTemplate();
      const unplaced = getUnplacedRoom(room_template);
      if (unplaced) {
        control.setRoom(unplaced, /* save location = */ false);
        unplaced.setRotation(room.getClockwiseRotations());
      } else {
        control.mode = "edit";
      }
    }
    control.refreshTiles(to_update);
  }
}

function on_click_callback(tile: Tile) {
  return () => {
    const control = setup.gFortGridControl!;
    const mode = control.mode;
    if (["place", "build"].includes(mode)) {
      const room = control.getRoom()!;
      const reason = State.variables.fortgrid.checkRoomCanRelocateTo(
        room,
        tile.getLocation(),
        /* skip pathing = */ false,
      );
      let tiles;
      if (!reason) {
        // relocate room
        tiles = State.variables.fortgrid.relocateRoom(
          room,
          tile.getLocation(),
          /* return obsolete = */ true,
        )!;
        on_build_success(room, tiles);
      } else {
        // show reason
        show_reason(room, reason, "build");
      }
    } else if (mode == "delete") {
      const room = tile.getRoomInstance()!;
      if (room && !room.getTemplate().isFixed()) {
        const reason = State.variables.fortgrid.checkRoomCanRelocateTo(
          room,
          /* new location = */ null,
          /* skip pathing = */ false,
        );

        if (!reason) {
          // delete the room and continue
          const tiles = State.variables.fortgrid.relocateRoom(
            room,
            null,
            /* return obsolete = */ true,
          )!;
          control.refreshTiles(tiles);
          room.resetRotation();
        } else {
          show_reason(room, reason, "remove");
        }
      } else if (room && room.getTemplate().isFixed()) {
        setup.Dialogs.open({
          title: `Cannot move room`,
          content: `${room.rep()} cannot be moved.`,
        });
      }
    } else if (mode == "edit" && setup.gFortGridControl!.is_show_renovation) {
      const room = tile.getRoomInstance();
      if (room && !room.getTemplate().isFixed()) {
        control.mode = "place";
        control.setRoom(room, /* save location rotation = */ true);
        const tiles = State.variables.fortgrid.relocateRoom(
          room,
          null,
          /* return osbolete = */ true,
        )!;
        control.refreshTiles(tiles);
      } else if (room && room.getTemplate().isFixed()) {
        setup.Dialogs.open({
          title: `Cannot move room`,
          content: `${room.rep()} cannot be moved.`,
        });
      }
    } else if (mode == "confirmbuild") {
      const room = tile.getRoomInstance()!;
      if (room == control.getRoom()) {
        const previous_location = room.getLocation();
        const tiles = State.variables.fortgrid.relocateRoom(
          room,
          null,
          /* return obsolete = */ true,
        )!;
        control.mode = "build";
        control.refreshTiles(tiles);
      }
    }
  };
}

function get_expansion_row_content(is_indoor: boolean): DOM.Node {
  let content = null;
  let cost;
  let direction;
  if (is_indoor) {
    cost = State.variables.fortgrid.getIndoorExpansionMoneyCost();
    direction = "indoors";
  } else {
    cost = State.variables.fortgrid.getOutdoorExpansionMoneyCost();
    direction = "outdoors";
  }

  if (setup.gFortGridControl!.mode == "edit") {
    if (State.variables.company.player.getMoney() >= cost) {
      content = setup.DOM.Nav.button(
        html`Expand ${direction} for ${setup.DOM.Util.money(cost)}`,
        () => {
          if (is_indoor) {
            State.variables.fortgrid.expandIndoors();
          } else {
            State.variables.fortgrid.expandOutdoors();
          }
          setup.gFortGridControl!.refreshAll();
        },
      );
    } else {
      content = html`You lack the ${setup.DOM.Util.money(cost)} required to
      expand ${direction}`;
    }
  } else {
    content = html`Room for expansion (costs ${setup.DOM.Util.money(cost)})`;
  }
  return content;
}

function get_expansion_row_refreshable_id(is_indoor: boolean): string {
  if (is_indoor) {
    return `fortgrid-expansion-indoor-id`;
  } else {
    return `fortgrid-expansion-outdoor-id`;
  }
}

function get_expansion_row(is_indoor: boolean): DOM.Node {
  const tile_size = setup.Tile.getTileSize();
  return html`
    <tr>
      <td
        class="fortgrid-expansion"
        colspan=${State.variables.fortgrid.getWidth()}
      >
        <div
          height="${tile_size}"
          width="${tile_size * State.variables.fortgrid.getWidth()}"
        >
          ${setup.DOM.createRefreshable(
            "div",
            { id: get_expansion_row_refreshable_id(is_indoor) },
            () => get_expansion_row_content(is_indoor),
          )}
        </div>
      </td>
    </tr>
  `;
}

/**
 * Fort Grid menu, displaying how the entire fort looks like
 *
 * Room key only used with mode = 'build'
 */
export const DOM_Menu_fortgrid = function ({
  mode,
  room_key,
}: {
  mode: FortGridMode;
  room_key?: RoomInstanceKey;
}): DOM.Node {
  if (setup.gFortGridControl) {
    // Resume existing one.
  } else {
    setup.gFortGridControl = new setup.FortGridController(mode, room_key);
  }

  const fragments: DOM.Attachable[] = [];

  fragments.push(
    setup.DOM.createRefreshable(
      `div`,
      {
        id: FORTGRID_TITLEBAR_DIV_ID,
      },
      () =>
        setup.DOM.Util.menuItemToolbar(
          setup.gFortGridControl!.getTitleToolbar(),
        ),
    ),
  );

  fragments.push(
    setup.DOM.createRefreshable(
      `div`,
      {
        id: FORTGRID_TOOLBAR_DIV_ID,
        class: "tagtoolbarsticky",
      },
      () =>
        setup.DOM.Util.menuItemToolbar(setup.gFortGridControl!.getToolbars()),
    ),
  );

  fragments.push(
    setup.DOM.create(
      "div",
      {
        class: "overflow-story-container",
      },
      setup.DOM.createRefreshable(
        `div`,
        {
          id: FORTGRID_GRID_DIV_ID,
        },
        () => setup.gFortGridControl!.drawTiles(),
        true,
      ),
    ),
  );

  return setup.DOM.create("div", {}, fragments);
};
