import { TwineClass } from "../_TwineClass";
import type { TileLocation } from "./FortGrid";
import type { RoomInstance, RoomInstanceKey } from "./RoomInstance";

const ZOOM_AMOUNT = {
  zoom0_25: 0.25,
  zoom0_5: 0.5,
  zoom0_75: 0.75,
  zoom1_25: 1.25,
  zoom1_5: 1.5,
  zoom1_75: 1.75,
  zoom2: 2.0,
  zoom2_5: 2.5,
  zoom3: 3.0,
  zoom4: 4.0,
};

function encode(topdown: number, leftright: number, corner: number) {
  if (topdown && leftright && corner) return 4;
  return topdown + leftright * 2;
}

/**
 * Tiles in the FortGrid
 */
export class Tile extends TwineClass {
  location: TileLocation;
  room_key: RoomInstanceKey | null = null;

  /** this is the entrance of these rooms */
  room_key_entrances: RoomInstanceKey[] = [];
  is_top_left_of_room = false;
  is_path = false;

  constructor(location: TileLocation) {
    super();

    this.location = location;
  }

  isPath(): boolean {
    return this.is_path;
  }

  setPath(): void {
    this.is_path = true;
  }

  removePath(): void {
    this.is_path = false;
  }

  getPathDirectionId(): number[] {
    const location = this.getLocation();
    let walls = [];
    for (const [dr, dc] of [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, -1],
      [-1, 1],
      [1, 1],
      [1, -1],
    ]) {
      const neighbor = {
        row: location.row + dr,
        col: location.col + dc,
      };
      if (State.variables.fortgrid.isOutOfBounds(neighbor)) {
        walls.push(0);
        continue;
      }
      let ok = 0;
      const tile = State.variables.fortgrid.getTile(neighbor);
      if (tile.isPath()) {
        ok = 1;
      }
      if (!ok && !tile.isPassable()) {
        // check if it's entrance
        const room = tile.getRoomInstance()!;
        if (room.getTemplate().isHasDoor()) {
          const loc = room.getEntranceLocation();
          if (loc.row == location.row && loc.col == location.col) {
            ok = 1;
          }
        }
      }
      walls.push(ok);
    }

    return [
      encode(walls[0], walls[3], walls[4]),
      encode(walls[0], walls[1], walls[5]),
      encode(walls[2], walls[1], walls[6]),
      encode(walls[2], walls[3], walls[7]),
    ];
  }

  setRoomInstance(
    room_instance: RoomInstance,
    is_top_left_of_room: boolean,
  ): void {
    if (this.room_key)
      throw new Error(
        `Duplicate room on the same tile: ${this.location.row} ${this.location.col} ${this.room_key}`,
      );
    this.room_key = room_instance.key;
    this.is_top_left_of_room = is_top_left_of_room;
  }

  unsetRoomInstance() {
    this.room_key = null;
    this.is_top_left_of_room = false;
  }

  setEntranceOf(room_instance: RoomInstance): void {
    this.room_key_entrances.push(room_instance.key);
  }

  unsetEntranceOf(room_instance: RoomInstance): void {
    if (!this.room_key_entrances.includes(room_instance.key))
      throw new Error(`unsetting entrance of something that does not exist`);
    this.room_key_entrances = this.room_key_entrances.filter(
      (key) => key != room_instance.key,
    );
  }

  getLocation(): TileLocation {
    return this.location;
  }

  getRoomInstance(): RoomInstance | null {
    if (!this.room_key) return null;
    return State.variables.roominstance[this.room_key];
  }

  entranceOfRooms(): RoomInstance[] {
    return this.room_key_entrances.map(
      (key) => State.variables.roominstance[key],
    );
  }

  isTopLeftOfRoom(): boolean {
    return this.is_top_left_of_room;
  }

  isOutdoors(): boolean {
    return this.getLocation().row > 0;
  }

  isPassable(): boolean {
    const room = this.getRoomInstance();
    if (!room) return true;
    return room.getTemplate().isPassable();
  }

  isWalled(): boolean {
    const room = this.getRoomInstance();
    if (!room) return false;
    return room.isWalled();
  }

  getTileDisplay(): string {
    const room = this.getRoomInstance();
    if (room && !this.isTopLeftOfRoom()) return "";
    let image_path_raw;
    let tooltip;
    let width;
    let height;
    let divwidth;
    let divheight;
    let is_entrance_to_top = false;

    let location;
    if (this.isOutdoors()) {
      location = "outdoors";
    } else {
      location = "indoors";
    }

    let rotatestyle = "";
    let classes = [];
    let imgclass = ["tile-main-image"];
    let rng = setup.rng.choice([1, 2, 3, 4]);
    const tile_size = Tile.getTileSize();
    if (room) {
      image_path_raw = room.getImage();
      tooltip = `<<roominstancecard ${room.key}>>`;
      divwidth = room.getWidth() * tile_size;
      divheight = room.getHeight() * tile_size;
      width = room.getTemplate().getWidth() * tile_size;
      height = room.getTemplate().getHeight() * tile_size;

      rotatestyle = "";

      if (room.isShouldRotateImage()) {
        // center image first
        if (width != divwidth || height != divheight) {
          rotatestyle += `translate(${(divwidth - width) / 2}px, ${(divheight - height) / 2}px)`;
        }
        const rotation = room.getClockwiseRotations();
        if (rotation) {
          rotatestyle += ` rotate(${90 * rotation}deg)`;
        }
      } else {
        width = divwidth;
        height = divheight;
      }
    } else {
      divwidth = divheight = width = height = tile_size;
      if (
        this.entranceOfRooms().filter(
          (room) => room.isWalled() && room.getClockwiseRotations() == 0,
        ).length
      ) {
        image_path_raw = `img/room/${location}_entrance${rng}.png`;
        is_entrance_to_top = true;
      } else {
        image_path_raw = `img/room/${location}_empty${rng}.png`;
      }
      tooltip = ``;
    }

    classes.push(`tile-${location}`);

    if (!room) {
      if (this.entranceOfRooms().length) {
        imgclass.push("tile-entrance");
      } else {
        imgclass.push("tile-empty");
      }
    } else if (!room.getImageObject()) {
      imgclass.push(`tile-type-${room.getTemplate().getTypeTag()}`);
    }

    if (State.variables.menufilter.get("fortgrid", "show_tooltip") == "hide") {
      tooltip = ``;
    }

    let caption = "";
    if (
      room &&
      !room.getTemplate().isHideName() &&
      State.variables.menufilter.get("fortgrid", "show_caption") != "hide"
    ) {
      caption += `<div class='tile-caption tile-caption-top'>${room.getName()}</div>`;
    }

    if (
      room &&
      !room.getTemplate().isHideSkill() &&
      State.variables.menufilter.get("fortgrid", "show_skills") != "hide"
    ) {
      const explanation = setup.SkillHelper.explainSkills(
        room.getSkillBonuses(),
        /* hide skills = */ false,
        /* is to fixed = */ true,
      );
      if (explanation) {
        caption += `<div class='tile-caption tile-caption-bottom'>${explanation}</div>`;
      }
    }

    let extras = "";
    // Draw path underneath if necessary
    if (!room && this.isPath()) {
      const dirs = this.getPathDirectionId();
      let tile_size_half = tile_size / 2;
      for (let [i, dir, offdr, offdc] of [
        [0, "nw", 0, 0],
        [1, "ne", 0, 1],
        [2, "se", 1, 1],
        [3, "sw", 1, 0],
      ] as const) {
        const tile_image = `img/room/${location}-path-${dir}-${dirs[i]}.png`;
        const tile_url = setup.escapeHtml(setup.resolveImageUrl(tile_image));
        extras += `<div class="tile-path" style="width: ${tile_size_half}px; height: ${tile_size_half}px; top:${tile_size_half * offdr}px; left:${tile_size_half * offdc}px"><img style="width:${tile_size_half}px; height:${tile_size_half}px;" src="${tile_url}"/></div>`;
      }
    }

    // Draw walls at the top if necessary.
    if (!is_entrance_to_top && !this.isWalled()) {
      for (let dc = 0; dc < (room ? room.getWidth() : 1); ++dc) {
        const loc = {
          row: this.getLocation().row - 1,
          col: this.getLocation().col + dc,
        };
        if (!State.variables.fortgrid.isOutOfBounds(loc)) {
          const tileabove = State.variables.fortgrid.getTile(loc);
          if (tileabove.isWalled()) {
            // draw extra wall here
            const wall_image = `img/room/${location}_wall${rng}.png`;
            const wall_url = setup.escapeHtml(
              setup.resolveImageUrl(wall_image),
            );
            extras += `<div class="tile-extra-wall" style="top:0px; left:${tile_size * dc}px"><img style="width:${tile_size}px; height:${tile_size}px;" src="${wall_url}"/></div>`;
          }
        }
      }
    }

    // draw activity units
    let outer_extra = "";
    if (
      room &&
      setup.gFortGridControl?.mode == "view" &&
      State.variables.menufilter.get("fortgrid", "show_activities") != "hide"
    ) {
      const activity = State.variables.activitylist.getActivityAt(room);
      if (activity) {
        outer_extra += `<aside class='activity-unit-container'>${activity.getDisplay()}</aside>`;
      }
    }

    const entrances = this.entranceOfRooms();
    for (const entrance of entrances) {
      outer_extra += `<aside class="fortgrid-entrance fortgrid-entrance-${entrance.getClockwiseRotations()}"></aside>`;
    }

    // background tile
    const tile_path_raw = `img/room/${location}_floor${rng}.png`;
    const tile_url = setup.escapeHtml(setup.resolveImageUrl(tile_path_raw));
    const url = setup.escapeHtml(setup.resolveImageUrl(image_path_raw));
    return `${outer_extra}<div style="background-image: url('${tile_url}'); width:${divwidth}px; height:${divheight}px" class="${classes.join(" ")}" ${tooltip ? `data-tooltip="${tooltip}" data-tooltip-med` : ""}>${extras}<img ${rotatestyle ? `style="transform: ${rotatestyle};"` : ""} width="${width}" height="${height}" class="${imgclass.join(" ")}" src="${url}"/>${caption}</div>`;
  }

  static getZoom(): number {
    const zoom = State.variables.menufilter.get("fortgrid", "zoom");
    return ZOOM_AMOUNT[zoom as keyof typeof ZOOM_AMOUNT] ?? 1;
  }

  static getTileSize(): number {
    const zoom = State.variables.menufilter.get("fortgrid", "zoom") ?? 0;
    if (zoom && zoom in ZOOM_AMOUNT) {
      return Math.round(
        setup.FORTGRID_TILE_SIZE *
          ZOOM_AMOUNT[zoom as keyof typeof ZOOM_AMOUNT],
      );
    } else {
      return setup.FORTGRID_TILE_SIZE;
    }
  }
}
