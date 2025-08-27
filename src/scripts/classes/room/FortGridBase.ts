import { TwineClass } from "../_TwineClass";
import type { TileLocation } from "./FortGrid";
import type { RoomInstance } from "./RoomInstance";
import type { RoomTemplateKey } from "./RoomTemplate";
import type { Tile } from "./Tile";

export const CACHED_TILES = Symbol("CACHED_TILES");
export const CACHED_ARE_PATHS_COMPUTED = Symbol("CACHED_ARE_PATHS_COMPUTED");

/**
 * The grid representing your fort. Does not actually get stored,
 * but gets recomputed each time.
 */
export abstract class FortGridBase extends TwineClass {
  /**
   * number of times indoors has been expanded
   */
  indoor_expansions = 0;

  /**
   * number of times outdoors has been expanded
   */
  outdoor_expansions = 0;

  // Using symbols because they won't be serialized
  [CACHED_ARE_PATHS_COMPUTED]?: true;
  [CACHED_TILES]?: Tile[][];

  constructor() {
    super();
  }

  resetCache() {
    this[CACHED_TILES] = undefined;
  }

  // initialize with default buildings
  initialize() {
    this.recomputeTiles();

    // first create fortwalls on all tiles except middle two
    const width = this.getWidth();

    if (width % 2 != 0) {
      throw new Error(`Fort Grid width must be even`);
    }

    for (let col = 0; col < width; ++col) {
      if (col == width / 2 || col == width / 2 - 1) {
        // middle ones are not walled
        continue;
      }
      const room = new setup.RoomInstance({
        template: setup.roomtemplate["fortwalls" as RoomTemplateKey],
      });
      if (col == width / 2 - 2) {
        room.setRotation(3);
      } else if (col == width / 2 + 1) {
        room.setRotation(1);
      }
      this.relocateRoom(room, {
        row: 0,
        col: col,
      });
    }

    // build road in the middle.
    const road = new setup.RoomInstance({
      template: setup.roomtemplate["roadindoor" as RoomTemplateKey],
    });
    this.relocateRoom(road, {
      row: 0,
      col: width / 2 - 1,
    });

    const room = new setup.RoomInstance({
      template: setup.roomtemplate["road" as RoomTemplateKey],
    });

    this._buildRoad(this.getOutdoorHeight());

    FortGridBase.initializeUpgradeCosts(true);
    FortGridBase.initializeUpgradeCosts(false);
  }

  getTotalExpansions(): number {
    return this.outdoor_expansions + this.indoor_expansions;
  }

  _buildRoad(row: number) {
    // relocate the outdoor road
    const room = State.variables.roomlist.getRoomInstances({
      template: setup.roomtemplate["road" as RoomTemplateKey],
    })[0];
    this.relocateRoom(room, {
      row: row,
      col: this.getWidth() / 2 - 1,
    });
  }

  expandIndoors() {
    if (!this.isCanExpandIndoor()) {
      setup.notify(`You have reached the indoor expansion limit.`);
      return;
    }
    setup.qc.Money(-this.getIndoorExpansionMoneyCost()).apply();
    this.indoor_expansions += 1;
    this.recomputeTiles();
  }

  expandOutdoors() {
    if (!this.isCanExpandOutdoor()) {
      setup.notify(`You have reached the indoor expansion limit.`);
      return;
    }
    setup.qc.Money(-this.getOutdoorExpansionMoneyCost()).apply();
    this.outdoor_expansions += 1;
    this.recomputeTiles();
    this._buildRoad(this.getOutdoorHeight());
  }

  getWidth(): number {
    return setup.FORTGRID_WIDTH;
  }

  getIndoorHeight(): number {
    return setup.FORTGRID_INDOOR_HEIGHT_INIT + this.indoor_expansions;
  }

  getOutdoorHeight(): number {
    return setup.FORTGRID_OUTDOOR_HEIGHT_INIT + this.outdoor_expansions;
  }

  isCanExpandIndoor(): boolean {
    return this.getIndoorHeight() < setup.MAX_TILE_INSIDE / this.getWidth();
  }

  isCanExpandOutdoor(): boolean {
    return this.getOutdoorHeight() < setup.MAX_TILE_OUTSIDE / this.getWidth();
  }

  getIndoorExpansionMoneyCost(): number {
    return FortGridBase.INDOOR_UPGRADE_COSTS[this.indoor_expansions];
  }

  getOutdoorExpansionMoneyCost(): number {
    return FortGridBase.OUTDOOR_UPGRADE_COSTS[this.outdoor_expansions];
  }

  /**
   * Return list of list, where tiles[row][col] is the tile at row and col
   * This is opposite of the usual coordinates (x, y) system
   */
  getTiles(): Tile[][] {
    return this[CACHED_TILES] ?? this.recomputeTiles();
  }

  translateLocationToArrayIndex(location: TileLocation): {
    idx1: number;
    idx2: number;
  } {
    return {
      idx1: location.row - 1 + this.getIndoorHeight(),
      idx2: location.col,
    };
  }

  getTile(location: TileLocation): Tile {
    const translated = this.translateLocationToArrayIndex(location);
    return this.getTiles()[translated.idx1][translated.idx2];
  }

  isOutOfBounds(location: TileLocation): boolean {
    return (
      location.row > this.getOutdoorHeight() ||
      location.row <= -this.getIndoorHeight() ||
      location.col < 0 ||
      location.col >= this.getWidth()
    );
  }

  isRoomOutOfBounds(
    room: RoomInstance,
    location_top_left: TileLocation,
  ): boolean {
    return (
      this.isOutOfBounds({
        row: location_top_left.row + room.getHeight() - 1,
        col: location_top_left.col + room.getWidth() - 1,
      }) || this.isOutOfBounds(location_top_left)
    );
  }

  relocateRoom(
    room: RoomInstance,
    location_top_left: TileLocation | null,
    is_return_obsolete_tiles?: boolean,
  ): TileLocation[] | null {
    this.getTiles();
    this[CACHED_ARE_PATHS_COMPUTED] = undefined;

    let past_location = room.getLocation();
    let path_cache: number[][];
    if (is_return_obsolete_tiles) {
      path_cache = this.cachePaths();
    } else {
      path_cache = []; // unused dummy value
    }

    // list of rooms to reset cache
    const to_reset = [];
    const old_location = room.getLocation();

    // current neighbors will be reset, if any
    if (room.isPlaced()) {
      to_reset.push(...this.getAffectingRooms(room, room.getLocation()).rooms);
    }

    room._relocate(location_top_left);

    /* update tiles */
    if (old_location) {
      // empty it
      for (
        let row = old_location.row;
        row < old_location.row + room.getHeight();
        ++row
      ) {
        for (
          let col = old_location.col;
          col < old_location.col + room.getWidth();
          ++col
        ) {
          const tile = this.getTile({ row: row, col: col });
          tile.unsetRoomInstance();
        }
      }
      if (room.getTemplate().isHasDoor()) {
        const entrance = this.getTile(room.getEntranceLocation(old_location));
        entrance.unsetEntranceOf(room);
      }
    }

    if (location_top_left) {
      for (
        let row = location_top_left.row;
        row < location_top_left.row + room.getHeight();
        ++row
      ) {
        for (
          let col = location_top_left.col;
          col < location_top_left.col + room.getWidth();
          ++col
        ) {
          const tile = this.getTile({ row: row, col: col });
          tile.setRoomInstance(
            room,
            row == location_top_left.row && col == location_top_left.col,
          );
        }
      }
      if (room.getTemplate().isHasDoor()) {
        const entrance = this.getTile(
          room.getEntranceLocation(location_top_left),
        );
        entrance.setEntranceOf(room);
      }
    }

    // new neighbors reset too
    if (room.isPlaced()) {
      to_reset.push(...this.getAffectingRooms(room, room.getLocation()).rooms);
    }

    for (const room of to_reset) {
      room.resetCache();
    }

    if (is_return_obsolete_tiles) {
      const to_update = [];

      // change the tiles at location
      const locs = [past_location, location_top_left];
      for (const loc of locs) {
        if (loc) {
          for (let row = loc.row; row < loc.row + room.getHeight() + 1; ++row) {
            for (let col = loc.col; col < loc.col + room.getWidth(); ++col) {
              to_update.push({ row: row, col: col });
            }
          }
          if (room.getTemplate().isHasDoor()) {
            const entrance = room.getEntranceLocation(loc);
            to_update.push(entrance);
          }
        }
      }

      // change paths
      this.recomputePaths();
      const new_cache = this.cachePaths();

      for (
        let row = -this.getIndoorHeight() + 1;
        row <= this.getOutdoorHeight();
        row += 1
      ) {
        for (let col = 0; col < this.getWidth(); ++col) {
          const location = { row: row, col: col };
          const arridx = this.translateLocationToArrayIndex(location);
          if (
            new_cache[arridx.idx1][arridx.idx2] !=
            path_cache[arridx.idx1][arridx.idx2]
          ) {
            to_update.push({ row: row, col: col });
          }
        }
      }

      return to_update;
    } else {
      return null;
    }
  }

  isRoomPlacementsValid(): boolean {
    return (
      State.variables.roomlist
        .getRoomInstances()
        .filter((room) => !room.isPlaced() && !room.getTemplate().isOptional())
        .length == 0
    );
  }

  getAffectingRooms(
    room: RoomInstance,
    room_location: TileLocation,
  ): {
    rooms: RoomInstance[];
    paths: Tile[];
    skill_bonuses: number[];
  } {
    throw new Error(`implement!`);
  }

  static OUTDOOR_UPGRADE_COSTS: number[] = [];
  static INDOOR_UPGRADE_COSTS: number[] = [];

  static getOldFortCosts(max_level: number): number[] {
    const ladder = [
      [0, 15],
      [10, 17],
      [20, 19],
      [30, 21],
      [40, 23],
      [50, 26],
      [60, 30],
      [70, 35],
      [80, 40],
      [90, 50],
      [100, 60],
      [110, 75],
      [120, 90],
      [130, 120],
      [140, 150],
      [150, 200],
      [160, 250],
      [170, 500],
      [180, 1000],
      [190, 2000],
      [200, 4000],
      [210, 8000],
      [220, 16000],
      [230, 32000],
      [240, 64000],
    ];

    let level = 1;
    let cost = 0;
    const result: number[] = [];
    while (level <= max_level) {
      result.push(cost);
      let increment = 0;
      for (const ladder_cost of ladder) {
        if (ladder_cost[0] < level) increment = ladder_cost[1];
      }
      cost += increment;
      level += 1;
    }

    return result;
  }

  static initializeUpgradeCosts(is_indoor: boolean) {
    const old_fort_max_level = 250;
    const old_fort_costs = FortGridBase.getOldFortCosts(
      old_fort_max_level + 50,
    );

    const width = setup.FORTGRID_WIDTH;
    const init_height = is_indoor
      ? setup.FORTGRID_INDOOR_HEIGHT_INIT
      : setup.FORTGRID_OUTDOOR_HEIGHT_INIT;
    let total_tiles = is_indoor
      ? setup.MAX_TILE_INSIDE
      : setup.MAX_TILE_OUTSIDE;
    total_tiles -= init_height * width;

    let cost_sum = 0;
    let idx = -1;

    for (let tileno = 0; tileno < total_tiles + width; ++tileno) {
      while (idx < (tileno / total_tiles) * old_fort_max_level) {
        idx += 1;
      }
      cost_sum += old_fort_costs[idx] / (total_tiles / old_fort_max_level);
      if ((tileno + 1) % width == 0) {
        if (is_indoor) {
          FortGridBase.INDOOR_UPGRADE_COSTS.push(Math.round(cost_sum));
        } else {
          FortGridBase.OUTDOOR_UPGRADE_COSTS.push(Math.round(cost_sum));
        }
        cost_sum = 0;
      }
    }
  }

  abstract recomputeTiles(): Tile[][];

  abstract cachePaths(): number[][];

  abstract recomputePaths(): void;
}
